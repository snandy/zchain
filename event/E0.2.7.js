/**
 * Event v0.2.7
 * 1,解决IE fn中丢失this
 * 2,统一了事件对象作为fn的第一个参数
 * 3,解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等统一使用w3c标准方式
 * 4,remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 5,remvoe方法新增删除元素所有的监听器(参数传el)
 * 6,解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome中顺序)
 * 8,add方法新增once参数，fn只执行一次
 *
 */
var E = {

	add : function(el, type, fn, once) {
		
		el.listeners = el.listeners || {};
		var listeners = el.listeners[type] = el.listeners[type] || [];
		!once ? listeners.push(fn) : listeners.push({one:fn});
		var self = this;
		
		if( !listeners['_fn_'] ){
			listeners['_fn_'] = function(e){
				
				var evt = e || window.event;
				evt.stopPropagation = evt.stopPropagation || function(){ this.cancelBubble = true; };
				evt.preventDefault = evt.preventDefault || function(){ this.returnValue = false;};			
				if(!evt.target) evt.target = evt.srcElement;
				if(!evt.currentTarget) evt.currentTarget = el;			

				for(var i=0,fn;fn=listeners[i++];){
				
					if( typeof fn=="function" ){
						fn.call( el, evt );	
					}else{
						fn.one.call( el, evt );
						self.remove( el, type, fn.one );
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
	},

	_each : function(ary, callback) {

		for( var i=0; i<ary.length; ) { 
			if( callback( i, ary[i] ) ) 
				i=0;
			else
				i++;
		}
	},
	
	_remove : function(el, type) {

		if(el.removeEventListener){
			el.removeEventListener( type, el.listeners[type]['_fn_'], false );
			
		}else if(el.detachEvent){
			el.detachEvent( 'on'+type, el.listeners[type]['_fn_'] );

		}

		delete el.listeners[type];
	},
	
	remove : function(el,type,fn) {
		
		if(!el.listeners) return;

		//只传参数el
		if( !type && !fn ){
			for( var t in el.listeners ){
				this._remove( el, t );
			}
			return;
		}

		//传参数el，type
		if( type && !fn && el.listeners[type] ){
			this._remove( el, type );			
			return;
		}
		
		//传参数el，type，fn
		var listeners = el.listeners && el.listeners[type];
		if( listeners ) {
			this._each(listeners,function( i, f ) {
				if( f==fn || f.one==fn )
					return listeners.splice( i, 1 );											
			});
			if( listeners.length == 0 )
				delete el.listeners[type];
		}
		
	}
};
