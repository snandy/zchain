/**
 * Event v0.1
 * Copyright (c) 2011 snandy
 *
 * 1, 解决IE fn中丢失this
 * 2, 统一了事件对象作为fn的第一个参数
 * 3, 解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome/Opera中顺序)
 * 4, add方法新增once参数，fn只执行一次
 * 5, remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 6, remvoe方法新增删除元素所有的监听器(参数传el)
 */
E = function(){
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
		var handler = el.events[type]['_handler_'];
		el.removeEventListener ?
			el.removeEventListener(type, handler, false) :
			el.detachEvent('on'+type, handler);
		delete el.events[type];
		if(_isEmptyObj(el.events)){
			delete el.events;
		}
	}
	// 添加事件
	function add(el, type, fn, one){
		el.events = el.events || {};
		var listeners = el.events[type] = el.events[type] || [];
		one ? listeners.push({one:fn}) : listeners.push(fn);
		if(!listeners['_handler_']){
			listeners['_handler_'] = function(e){
				var evt = e || window.event;
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
			el.addEventListener ?
				el.addEventListener(type, listeners['_handler_'], false) :
				el.attachEvent('on' + type,  listeners['_handler_']);
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
			default:;
		}
	}
	//主动触发事件
	function dispatch(el ,type){
		try{
			if(el.dispatchEvent){
				var evt = document.createEvent('Event');
				evt.initEvent(type,true,true);
				el.dispatchEvent(evt);
			}else if(el.fireEvent){
				el.fireEvent('on'+type);
			}
		}catch(e){};
	}
	return {
		on : add,
		un : remove,
		fire : dispatch
	};
}();
