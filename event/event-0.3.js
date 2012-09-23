/**
 * Event v0.3
 * Copyright (c) 2011 snandy
 * 
 * 1, 解决IE fn中丢失this
 * 2, 统一了事件对象作为fn的第一个参数
 * 3, 解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome/Opera中顺序)
 * 4, add方法新增once参数，fn只执行一次
 * 5, remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 6, remvoe方法新增删除元素所有的监听器(参数传el)
 * 7, 解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等（支持DOM2/3 events）
 * 8, 添加事件分支方式修改（http://www.cnblogs.com/snandy/archive/2011/05/24/2055048.html）
 * 
 */
E = function(window, document){
	
	var w3c = !!window.addEventListener,
	
		addListener = w3c ?
			function(el, type, fn) { el.addEventListener(type, fn, false); } :
			function(el, type, fn) { el.attachEvent('on' + type, fn); },
			
		removeListener = w3c ?
			function(el, type, fn) { el.removeEventListener(type, fn, false); } :
			function(el, type, fn) { el.detachEvent('on' + type, fn); };
		
		dispatch = w3c ?
			function(el, type){
				try{
					var evt = document.createEvent('Event');
					evt.initEvent(type,true,true);
					el.dispatchEvent(evt);
				}catch(e){alert(e)};
			} :
			function(el, type){
				try{
					el.fireEvent('on'+type);
				}catch(e){alert(e)}
			};
			
	function _isEmptyObj(obj){
		for(var a in obj){
			return false;
		}
		return true;
	}
	function _each(ary, callback){
		for(var i=0; i<ary.length;){ 
			callback(i, ary[i]) ? i=0 : i++;
		}
	}
	function _remove(el, type){
		removeListener(el, type, el.events[type]['_handler_']);
		delete el.events[type];
		if(_isEmptyObj(el.events)){
			delete el.events;
		}
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
				if( e.preventDefault ) {
					e.preventDefault();
				}
				e.returnValue = false;
			},
			stopPropagation: function() {
				this.isPropagationStopped = returnTrue;
				var e = this.originalEvent;
				if( e.stopPropagation ) {
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
		
		for(var i = len, prop; i;) {
			prop = props[ --i ];
			evt[ prop ] = originalEvent[ prop ];
		}
		if(!evt.target) {
			evt.target = evt.srcElement || document;
		}
		if( evt.target.nodeType === 3 ) {
			evt.target = evt.target.parentNode;
		}
		if( !evt.relatedTarget && evt.fromElement ) {
			evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement;
		}
		if( evt.pageX == null && evt.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}
		if( !evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
			evt.which = evt.charCode || evt.keyCode;
		}
		if( !evt.metaKey && evt.ctrlKey ) {
			evt.metaKey = evt.ctrlKey;
		}
		if( !evt.which && evt.button !== undefined ) {
			evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ));
		}		
		if(!evt.currentTarget) evt.currentTarget = el;
		return evt;
	}	
	// 添加事件
	function add(el, type, fn, one){
		el.events = el.events || {};
		var listeners = el.events[type] = el.events[type] || [];
		one ? listeners.push({one:fn}) : listeners.push(fn);
		if(!listeners['_handler_']){
			listeners['_handler_'] = function(e){
				var evt = e || window.event;
				evt = _fixEvent(evt, el);
				for(var i=0,fn; fn=listeners[i++];){
					if(typeof fn == 'function'){
						fn.call(el, evt);
					}else{
						fn.one.call(el, evt);
						remove(el, type, fn.one);
						i--;
					}
				}
			}
			addListener(el, type, listeners['_handler_']);
		}
	}
	// 删除事件
	function remove(el, type, fn){
		if(!el.events) return;
		var events = el.events,
			listeners = events[type],
			len = arguments.length;
		switch(len){
			case 1 :
				for(var type in events){
					_remove(el, type);
				}
				break;
			case 2 :
				_remove(el, type);
				break;
			case 3 :
				_each(listeners, function(i, f){
					if(f == fn || f.one == fn){
						return listeners.splice(i, 1);
					}
				});
				if(listeners.length == 0){
					_remove(el, type);
				}
				break;
		}
	}
	return {
		on : add,
		un : remove,
		fire : dispatch
	};
}(this, this.document);
