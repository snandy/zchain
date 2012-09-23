/**
 * Event v0.6
 * Copyright (c) 2011 snandy
 * 
 * 1, 解决IE handler中丢失this
 * 2, 统一了事件对象作为handler的第一个参数
 * 3, 解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome/Opera中顺序)
 * 4, add方法新增once参数，handler只执行一次
 * 5, remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 6, remvoe方法新增删除元素所有的监听器(参数传el)
 * 7, 解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等（支持DOM2/3 events）
 * 8, 重构
 * 9, 使用guid，HTMLElenent上不再挂events属性
 * 10, 接口修改，添加once/delay/scope/stopEvent/preventDefault/stopPropagation
 * 11, 接口修改，可以一次添加多种事件
 * 
 * 
 * Example
 * 
 * 1, 添加一个简单事件
 * E.on(el, 'click', handler)
 * 
 * 2, 添加一个可配置的事件
 * E.on(el, 'click', handler, {
 * 		once : // true则该handler仅执行一次
 * 		delay : // handler延迟执行的时间，以毫秒为单位
 * 		scope : // handler执行上下文，默认为el
 * 		stopEvent : // 阻止el默认行为，停止冒泡
 * 		preventDefault : // 阻止默认行为
 * 		stopPropagation : // 停止冒泡
 * });
 * 
 * 3, 一次添加多个事件
 * E.on(el, {
 * 		click : {
 * 			handler :
 * 			once :
 * 			delay : 
 * 			scope : 
 * 			stopEvent :
 * 			preventDefault : 
 * 			stopPropagation :
 * 		},
 * 		mouseover : {},
 * 		mouseout : {}
 * });
 *
 */

E = function(window, document) {
	
var guid = 1,
	
	evtHash = {},
	
	w3c = !!window.addEventListener,

	addListener = w3c ?
		function(el, type, handler) { el.addEventListener(type, handler, false); } :
		function(el, type, handler) { el.attachEvent('on' + type, handler); },
		
	removeListener = w3c ?
		function(el, type, handler) { el.removeEventListener(type, handler, false); } :
		function(el, type, handler) { el.detachEvent('on' + type, handler); };
	
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
		
function _isEmptyObj(obj) {
	for(var a in obj){
		return false;
	}
	return true;
}
function _each(ary, callback) {
	for(var i=0; i<ary.length;){ 
		callback(i, ary[i]) ? i=0 : i++;
	}
}
function _remove(el, type, guid) {
	removeListener(el, type, evtHash[guid][type]['_handler_']);
	delete evtHash[guid][type];
	if(_isEmptyObj(evtHash[guid])){
		delete evtHash[guid];
	}
}
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

function _fixEvent( evt, el ) {
	
	var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
		len   = props.length;

	var originalEvent = evt;
	evt = new Event(originalEvent);
	
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

function _callback(el, type, evt, handlerObj) {
	
	var handler = handlerObj.handler,
		once = handlerObj.once,
		delay = handlerObj.delay,
		scope = handlerObj.scope || el,
		stopEvent = handlerObj.stopEvent,
		preventDefault = handlerObj.preventDefault,
		stopPropagation = handlerObj.stopPropagation;
		
	if(stopEvent){
		evt.preventDefault();
		evt.stopPropagation();
	}
	if(preventDefault){
		evt.preventDefault();
	}
	if(stopPropagation){
		evt.stopPropagation();
	}
	if(delay){
		setTimeout(function(){
			handler.call(scope, evt);
		},delay);
	}else{
		handler.call(scope, evt);
	}
	
	if(once){
		remove(el, type, handler);
		return true;
	}
}
// 添加事件
function add(el, type, handler, opt) {
	var gid, listeners, handlerObj = {};
	
	gid = el.guid = el.guid || guid++;
	evtHash[gid] = evtHash[gid] || {};
	listeners = evtHash[gid][type] = evtHash[gid][type] || [];
	
	if(opt){
		handlerObj = opt;
	}
	handlerObj.handler = handler;
	listeners.push(handlerObj);
	
	if(!listeners['_handler_']){
		listeners['_handler_'] = function(evt){
			var evt = _fixEvent(evt||window.event, el);
			for(var i=0,handlerObj; handlerObj=listeners[i++];){
				if(_callback(el, type, evt, handlerObj)){
					i--;
				}
			}
		}
		addListener(el, type, listeners['_handler_']);
	}
}
// 删除事件
function remove(el, type, handler) {
	var gid = el.guid;
	if(!gid) return;
	
	var events = evtHash[gid],
		listeners = events[type],
		len = arguments.length;
		
	switch(len){
		case 1 :
			for(var type in events){
				_remove(el, type, gid);
			}
			break;
		case 2 :
			_remove(el, type, gid);
			break;
		case 3 :
			_each(listeners, function(i, handlerObj){
				if(handlerObj.handler == handler){
					return listeners.splice(i, 1);
				}
			});
			if(listeners.length == 0){
				_remove(el, type, gid);
			}
			break;
	}
}

return {
	on : function(el, type, handler, opt){
		if (!el || !type) {
			return;
		}
		if(typeof type == 'string'){
			add(el, type, handler, opt);
		}else{
			for(var t in type){
				var obj = type[t];
				add(el, t, obj.handler, obj)
			}
		}
	},
	
	un : remove,
	
	fire : dispatch
};
	
}(this, this.document);
