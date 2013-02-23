/**
 * JavaScript Ajax Suggest
 * Copyright (c) 2013 snandy
 * Blog: http://snandy.cnblogs.com
 * QQ群: 34580561
 * Date: 2013-10-14 
 * 
 * InputSuggest({
 *	   input		 HTMLInputElement 必选
 *	   url			 ajax请求的地址
 * 	   queryName     指定传给后台的name
 *	   containerCls  容器className
 *	   itemCls		 容器子项className
 *	   activeCls	 高亮子项className
 * });
 * 
 */

~function(win, doc, undefined) {
	
// Utility functions
function bind(el, type, handler) {
	el.addEventListener ? el.addEventListener(type, handler, false) : el.attachEvent('on' + type, handler);
}
function createEl(tagName, cls, html) {
	var el = doc.createElement(tagName);
	if (cls) {
		el.className = cls;
	}
	if (html) {
		el.innerHTML = html;
	}
	return el;
}
function getPos(el) {
	var pos = [0,0], box;
	if (el.getBoundingClientRect) {
		box = el.getBoundingClientRect();
		pos = [box.left, box.top];
	}
	return pos;
}

var Ajax = function(window, undefined) {
	
	var createXHR = window.XMLHttpRequest ?
		function() {
			try{
				return new window.XMLHttpRequest()
			} catch(e){}
		} :
		function() {
			try{
				return new window.ActiveXObject('Microsoft.XMLHTTP')
			} catch(e){}
		}
	
	function noop() {}
	
	function serialize(obj) {
		var a = [], key, val
		for (key in obj) {
			val = obj[key]
			if (val.constructor === Array) {
				for (var i = 0, len = val.length; i<len; i++) {
					a.push(key + '=' + encodeURIComponent( val[i]) )
				}
			} else {
				a.push(key + '=' + encodeURIComponent(val))
			}
		}
		
		return a.join('&')
	}
	
	function request(url, opt) {
		if (typeof url === 'object') {
			opt = url
			url = opt.url
		}
		var xhr, isTimeout, timer, opt = opt || {}
		var async   = opt.async !== false,
			method  = opt.method  || 'GET',
			type	= opt.type	  || 'text',
			encode  = opt.encode  || 'UTF-8',
			timeout = opt.timeout || 0,
			data	= opt.data,
			scope   = opt.scope,
			success = opt.success || noop,
			failure = opt.failure || noop
			
		method  = method.toUpperCase()
		// 对象转换成字符串键值对
		if (data && typeof data === 'object') {
			data = serialize(data)
		}
		if (method === 'GET' && data) {
			url += (url.indexOf('?') === -1 ? '?' : '&') + data
		}
		
		xhr = createXHR()
		if (!xhr) {
			return
		}
		
		isTimeout = false
		if (async && timeout>0) {
			timer = setTimeout(function() {
				// 先给isTimeout赋值，不能先调用abort
				isTimeout = true
				xhr.abort()
			}, timeout)
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (isTimeout) {
					failure(xhr,'request timeout')
				} else {
					onStateChange(xhr, type, success, failure, scope)
					clearTimeout(timer)
				}
			}
		}
		xhr.open(method,url,async)
		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode)
		}
		xhr.send(data)
		return xhr
	}
	
	function onStateChange(xhr, type, success, failure, scope) {
		var s = xhr.status, result
		if (s>= 200 && s < 300) {
			switch (type) {
				case 'text':
					result = xhr.responseText
					break
				case 'json':
					result = function(str) {
						try {
							return JSON.parse(str)
						} catch(e) {
							try {
								return (new Function('return ' + str))()
							} catch(e) {
								failure(xhr,'parse json error', e)
							}
						}
					}(xhr.responseText)
					break
				case 'xml':
					result = xhr.responseXML
					break
			}
			// text, 返回空字符时执行success
			// json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
			result !== undefined && success.call(scope, result)
			
		} else {
			failure(xhr, xhr.status)
		}
		xhr = null
	}
	
	return (function() {
		var Ajax = {request: request}, types = ['text','json','xml']
		for (var i = 0, len = types.length; i<len; i++) {
			Ajax[ types[i] ] = function(i) {
				return function(url, opt) {
					opt = opt || {}
					opt.type = types[i]
					return request(url, opt)
				}
			}(i)
		}
		return Ajax
	})()

}(this);

// API
function InputSuggest(opt) {
	var input = opt.input,
		cCls  = opt.containerCls || 'suggest-container',
		iCls  = opt.itemCls || 'suggest-item',
		aCls  = opt.activeCls || 'suggest-active',
		url   = opt.url || location.href,
		key   = opt.queryName || 'key',
		finalVal = '', visible, activeItem;
		
	var suggestEl = createEl('div', cCls);
	doc.body.appendChild(suggestEl);
	cssSuggest(opt);
	
	function show() {
		suggestEl.style.visibility = 'visible';
		visible = true;
	}
	function hide() {
		suggestEl.style.visibility = 'hidden';
		visible = false;
	}
	function doKey(e) {
		switch (e.keyCode) {
			case 13: // Enter
				if (activeItem) {
					input.value = activeItem.firstChild.data;
					hide();
				}
				break;
			case 38: // 方向键上
				if (activeItem == null) {
					activeItem = suggestEl.lastChild;
					activeItem.className = aCls;
					input.value = activeItem.firstChild.data;
				} else {
					if (activeItem.previousSibling != null) {
						activeItem.className = iCls;
						activeItem = activeItem.previousSibling;
						activeItem.className = aCls;
						input.value = activeItem.firstChild.data;
					} else {
						activeItem.className = iCls;
						activeItem = null;
						input.focus();
						input.value = finalVal;
					}
				}
				break;
			case 40: // 方向键下
				if (activeItem == null) {
					activeItem = suggestEl.firstChild;
					activeItem.className = aCls;
					input.value = activeItem.firstChild.data;
				} else {
					if (activeItem.nextSibling != null) {
						activeItem.className = iCls;
						activeItem = activeItem.nextSibling;
						activeItem.className = aCls;
						input.value = activeItem.firstChild.data;
					} else {
						activeItem.className = iCls;
						activeItem = null;
						input.focus();
						input.value = finalVal;
					}
				}
				break;
			case 27: // ESC
				hide();
				input.value = finalVal;
				break;
		}
	}
	function cssSuggest(obj) {
		var pos   = getPos(input);
		
		// IE6/7/8/9/Chrome/Safari input[type=text] border为2，padding为1，Firefox则为1和2px，因此取offsetWidth-2	
		suggestEl.style.cssText =
			'position:absolute;overflow:hidden;left:' + pos[0] + 'px;top:' +
			(pos[1] + input.offsetHeight) + 'px;width:' + (input.offsetWidth-2) + 'px;';
	}
	function createItem(val) {
		var item = createEl('div', iCls, val);
		return item;
	}
	function showSuggest() {
		var data = {},
			val = input.value;
			
		data[key] = val;
		Ajax.json(url, {
			data: data,
			success: function(arr) {
				suggestEl.innerHTML = '';
				for (var i=0; i<arr.length; i++) {
					var item = createItem(arr[i]);
					suggestEl.appendChild(item);
				}
				show();
				finalVal = val;
			}
		});
	}
	function onKeyup(e) {
		var kc = e.keyCode;
		if (input.value === '') {
			hide();
		} else {
			if (kc===13 || kc===27 || kc===38 || kc===40) {
				return doKey(e);
			}
			showSuggest();
		}
	}
	
	bind(input, 'keyup', onKeyup);
	// blur会在click前发生，这里使用mousedown
	bind(input, 'blur', function(e) {
		hide();
	});
	bind(suggestEl, 'mouseover', function(e) {
		var target = e.target || e.srcElement;
		if (target.className === iCls){
			if (activeItem) {
				activeItem.className = iCls;
			}
			target.className = aCls;
			activeItem = target;
		}
	});
	bind(suggestEl, 'mousedown', function(e) {
		var target = e.target || e.srcElement;
		input.value = target.innerHTML;
		hide();
	});
}

this.InputSuggest = InputSuggest;

}(this, this.document);

