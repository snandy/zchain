/**
 * Event v0.3.1
 * 1, 解决IE fn中丢失this
 * 2, 统一了事件对象作为fn的第一个参数
 * 3, 解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等（支持DOM2/3 events）
 * 4, remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 5, remvoe方法新增删除元素所有的监听器(参数传el)
 * 6, 解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome中顺序)
 * 8, add方法新增once参数，fn只执行一次
 * 9, 增加对非html元素(普通对象)自定义事件---观察者模式
 * 10,增加dispatch方法
 */
E = function(){
	
	function _each( ary, callback ) {
		for( var i=0; i<ary.length; ) { 
			if( callback( i, ary[i] ) ) 
				i=0;
			else
				i++;
		}
	}
	function _remove( el, type ) {
		if(el.removeEventListener){
			el.removeEventListener( type, el.listeners[type]['_fn_'], false );
			
		}else if(el.detachEvent){
			el.detachEvent( 'on'+type, el.listeners[type]['_fn_'] );
		}
		delete el.listeners[type];
	}
	function _fixEvent( evt, el ) {
		var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
			len   = props.length;
		function now() {return (new Date).getTime();}
		function returnFalse() {return false;}
		function returnTrue() {return true;}
		function Event( src ) {
			this.originalEvent = src;
			this.type = src.type;
			this.timeStamp = now();
		}
		Event.prototype = {
			preventDefault: function() {
				this.isDefaultPrevented = returnTrue;
				var e = this.originalEvent;
				if ( e.preventDefault ) {
					e.preventDefault();
				}
				e.returnValue = false;
			},
			stopPropagation: function() {
				this.isPropagationStopped = returnTrue;
				var e = this.originalEvent;
				if ( e.stopPropagation ) {
					e.stopPropagation();
				}		
				e.cancelBubble = true;
			},
			stopImmediatePropagation: function() {
				this.isImmediatePropagationStopped = returnTrue;
				this.stopPropagation();
			},
			isDefaultPrevented: returnFalse,
			isPropagationStopped: returnFalse,
			isImmediatePropagationStopped: returnFalse
		};

		var originalEvent = evt;
		evt = new Event( originalEvent );
		
		for ( var i = len, prop; i; ) {
			prop = props[ --i ];
			evt[ prop ] = originalEvent[ prop ];
		}
		if ( !evt.target ) {
			evt.target = evt.srcElement || document;
		}
		if ( evt.target.nodeType === 3 ) {
			evt.target = evt.target.parentNode;
		}
		if ( !evt.relatedTarget && evt.fromElement ) {
			evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement;
		}
		if ( evt.pageX == null && evt.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}
		if ( !evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
			evt.which = evt.charCode || evt.keyCode;
		}
		if ( !evt.metaKey && evt.ctrlKey ) {
			evt.metaKey = evt.ctrlKey;
		}
		if ( !evt.which && evt.button !== undefined ) {
			evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ));
		}		
		if(!evt.currentTarget) evt.currentTarget = el;

		return evt;
	}
	function _isHtmlControl(obj) { 
		var d = document.createElement("div");
		try{
			d.appendChild(obj.cloneNode(true));
			return obj.nodeType==1 ? true : false;
		}catch(e){
			return obj==window || obj==document;
		}
	}	
	function add( el, type, fn, once ) {
		el.listeners = el.listeners || {};
		var listeners = el.listeners[type] = el.listeners[type] || [];
		!once ? listeners.push( fn ) : listeners.push( {one:fn} );
		
		if( _isHtmlControl(el) ){
			if ( !listeners['_fn_'] ){
				listeners['_fn_'] = function(e){
					var evt = e || window.event;
						evt = _fixEvent( evt, el );
					for(var i=0,fn;fn=listeners[i++];){
						if( typeof fn=="function" ){
							fn.call( el, evt );
						}else{
							fn.one.call( el, evt );
							remove( el, type, fn.one );
							i--;
						}
					}
				}
				if( el.addEventListener ){
					el.addEventListener( type, listeners['_fn_'], false );
				}else if(el.attachEvent){
					el.attachEvent('on' + type,  listeners['_fn_'] );
				}
			}
		}else {
			if ( !listeners['_fn_'] ){
				listeners['_fn_'] = function(){
					for(var i=0,fn;fn=listeners[i++];){
						if( typeof fn=="function" ){
							fn.call( el );
						}else{
							fn.one.call( el );
							remove( el, type, fn.one );
							i--;
						}
					}
				}
			}
			el[ type ] = listeners['_fn_'];
		}
	}
	function remove( el, type, fn ) {
		if(!el.listeners) return;
		
		if( !type && !fn ){
			for( var t in el.listeners ){
				_remove( el, t );
			}
			return;
		}
		
		if( type && !fn && el.listeners[type] ){
			_remove( el, type );
			return;
		}
		
		var listeners = el.listeners && el.listeners[type];
		if( listeners ) {
			_each(listeners,function( i, f ) {
				if( f==fn || f.one==fn )
					return listeners.splice( i, 1 );
			});
			if( listeners.length == 0 )
				delete el.listeners[type];
		}
	}
	function dispatch(el, type, args) {
		try{
			if(el.dispatchEvent){
				var evt = document.createEvent('Event');
				evt.initEvent(type,false,true);
				el.dispatchEvent(evt);
			}else if(el.fireEvent){
				el.fireEvent('on'+type);
			}else{
				el[ type ]();
			}
		}catch(e){alert(e);};
	}
	return {add: add, remove: remove, dispatch: dispatch};
}();