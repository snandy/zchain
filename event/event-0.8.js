/**
 * Event v0.8
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
 * 12, eventHandle修改，from jQuery-1.6.2
 * 13, each修改, 去掉分号, 重构
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
	
	cache = {},
	
	w3c = !!window.addEventListener,

	addListener = w3c ?
		function(el, type, handler) { el.addEventListener(type, handler, false) } :
		function(el, type, handler) { el.attachEvent('on' + type, handler) },
		
	removeListener = w3c ?
		function(el, type, handler) { el.removeEventListener(type, handler, false) } :
		function(el, type, handler) { el.detachEvent('on' + type, handler) },
	
	dispatch = w3c ?
		function(el, type) {
			try {
				var evt = document.createEvent('Event')
				evt.initEvent(type,true,true)
				el.dispatchEvent(evt)
			}catch(e){}
		} :
		function(el, type) {
			try {
				el.fireEvent('on'+type)
			}catch(e){}
		};
		
function isEmpty(obj) {
	for (var a in obj) {
		return false
	}
	return true
}
function each(arr, callback) {
	for (var i=0; i<arr.length; i++) {
		if ( callback(i, arr[i]) === true ) return
	}
}

function now() {return (new Date).getTime()}
function returnFalse() {return false}
function returnTrue() {return true}

function Event( src ) {
	this.originalEvent = src
	this.type = src.type
	this.timeStamp = now()
}
Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue
		var e = this.originalEvent
		if (e.preventDefault) {
			e.preventDefault()
		}
		e.returnValue = false
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue
		var e = this.originalEvent
		if (e.stopPropagation) {
			e.stopPropagation()
		}
		e.cancelBubble = true
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue
		this.stopPropagation()
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

function fixEvent( evt ) {
	var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
		len   = props.length

	var originalEvent = evt
	evt = new Event(originalEvent)
	
	for (var i = len, prop; i;) {
		prop = props[ --i ]
		evt[ prop ] = originalEvent[ prop ]
	}
	if (!evt.target) {
		evt.target = evt.srcElement || document
	}
	if (evt.target.nodeType === 3) {
		evt.target = evt.target.parentNode
	}
	if (!evt.relatedTarget && evt.fromElement) {
		evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement
	}
	if (evt.pageX == null && evt.clientX != null) {
		var doc = document.documentElement, body = document.body
		evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0)
		evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0)
	}
	if ( !evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
		evt.which = evt.charCode || evt.keyCode
	}
	if (!evt.metaKey && evt.ctrlKey) {
		evt.metaKey = evt.ctrlKey
	}
	if (!evt.which && evt.button !== undefined) {
		evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ))
	}
	
	return evt
}

function _callback(el, type, evt, handlerObj) {
	var once = handlerObj.once,
		delay = handlerObj.delay,
		handler = handlerObj.handler,
		scope = handlerObj.scope || el,
		stopEvent = handlerObj.stopEvent,
		preventDefault = handlerObj.preventDefault,
		stopPropagation = handlerObj.stopPropagation
		
	if (stopEvent) {
		evt.preventDefault()
		evt.stopPropagation()
	}
	
	if (preventDefault) {
		evt.preventDefault()
	}
	
	if (stopPropagation) {
		evt.stopPropagation()
	}
	
	if (delay) {
		setTimeout(function() {
			handler.call(scope, evt)
		}, delay)
		
	} else {
		handler.call(scope, evt)
	}
	
	if (once) {
		remove(el, type, handler)
		return true
	}
}

// 添加事件
function on(el, type, handler, opt) {
	var t, obj
	
	if (!el || !type) return
	
	// 批量添加
	if (typeof type == 'object') {
		for (t in type) {
			obj = type[t]
			add(el, t, obj.handler, obj)
		}
		return
	}
	
	var id     = el.guid = el.guid || guid++,
		elData = cache[id] = cache[id] || {},
		events = elData.events,
		eventHandle = elData.handle

	if (!events) {
		elData.events = events = {}
	}
	
	if (!eventHandle) {
		elData.handle = eventHandle = function(e) {
			return handle.call(eventHandle.el, e)
		}
	}
	
	eventHandle.el = el
	
	var handlerObj = opt || {}
	
	handlerObj.handler = handler
	handlers           = events[type]
		
	if (!handlers) {
		handlers = events[type] = []
		addListener(el, type, eventHandle)
	}
	
	handlers.push(handlerObj)
	
	el = null
}
function handle(e) {
	var evt = fixEvent(e || event)
	evt.currentTarget = this
	
	var type   = evt.type,
		id     = this.guid,
		elData = cache[id],
		events = elData.events,
		handlers = events[type]
	
	for (var i=0, handlerObj; handlerObj = handlers[i++];) {
		if ( _callback(this, type, evt, handlerObj) ) {
			i--
		}
	}
}
function remove(el, type, guid) {
	var elData = cache[guid],
		handle = elData.handle,
		events = elData.events
		
	delete events[type]
	
	removeListener(el, type, handle)
	
	if ( isEmpty(events) ) {
		delete cache[guid]
	}
}
// 删除事件
function un(el, type, handler) {
	var id = el.guid
	
	if(!id) return
	
	var elData   = cache[id],
		events   = elData.events,
		handlers = events[type],
		length   = arguments.length
		
	switch (length) {
		case 1 :
			for (var type in events) {
				remove(el, type, id)
			}
			break
		case 2 :
			remove(el, type, id)
			break
		case 3 :
			each(handlers, function(i, item) {
				if (item === handler) {
					handlers.splice(i, 1)
					return true
				}
			})
			if (handlers.length === 0) {
				remove(el, type, id)
			}
			break
	}
}

return {
	on : on,
	un : un,
	fire : dispatch
}

}(this, this.document);
