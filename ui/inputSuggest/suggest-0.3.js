/**
 * JavaScript Ajax Suggest
 * Copyright (c) 2013 snandy
 * Blog: http://snandy.cnblogs.com
 * QQ群: 34580561
 * Date: 2013-10-14 
 * 
 * InputSuggest({
 *	   input		 HTMLInputElement 必选
 *	   url			 ajax请求的地址 必选
 *	 data		  Array ['sina.cn','sina.com','2008.sina.com','vip.sina.com.cn'] 必选
 *	   containerCls  容器className
 *	   itemCls		 容器子项className
 *	   activeCls	 高亮子项className
 *	   width		 宽度设置 此项将覆盖containerCls的width
 *	   opacity		 透明度设置 此项将覆盖containerCls的opacity
 * });
 * 
 */

~function(win, doc, undefined) {
	// Utility functions
	function bind(el, type, handler) {
		el.addEventListener ? el.addEventListener(type, handler, false) : el.attachEvent('on' + type, handler);
	}
	function unbind(el, type, handler) {
		el.removeEventListener ? el.removeEventListener(type, handler, false) : el.detachEvent('on' + type, handler);
	}
	function createEl(tagName, cls) {
		var el = doc.createElement(tagName);
		if (cls) {
			el.className = cls;
		}
		return el;
	}
	function attr(el, name, val) {
		if (val === undefined) {
			return el.getAttribute(name);
		} else {
			el.setAttribute(name,val);
			name === 'class' && (el.className = val);
		}
	}
	function getPos (el) {
		var pos = [0,0], box;
		if (el.getBoundingClientRect) {
			box = el.getBoundingClientRect();
			pos = [box.left, box.top];
		}
		return pos;
	}
	function setSuggest(el, obj) {
		var input = obj.input,
			pos   = getPos(input),
			width = obj.width,
			opacity = obj.opacity;
		// IE6/7/8/9/Chrome/Safari input[type=text] border默认为2，Firefox为1，因此取offsetWidth-2保证与FF一致	
		el.style.cssText =
			'position:absolute;overflow:hidden;left:' 
			+ pos[0] + 'px;top:'
			+ (pos[1] + input.offsetHeight) + 'px;width:'
			+ (input.offsetWidth-2) + 'px;';
			
		if (width) {
			el.style.width = width + 'px';
		}
		if (opacity) {
			if (browser.ie) {
				el.style.filter = 'Alpha(Opacity=' + opacity * 100 + ');';
			} else {
				el.style.opacity = (opacity == 1 ? '' : '' + opacity);
			}
		}
	}
	function show(el) {
		el.style.visibility = 'visible';
		el.visible = true;
	}
	function hide(el) {
		el.style.visibility = 'hidden';
		el.visible = false;
	}
	var browser = function(ua) {
		return {
			ie: /msie/.test(ua) && !/opera/.test(ua),
			opera: /opera/.test(ua),
			firefox: /firefox/.test(ua)
		}
	}(navigator.userAgent.toLowerCase());
	
	function onKeyup(e, opt, elSuggest, activeEl) {
		var ary   = [],
			input = opt.input,
			iCls  = opt.itemCls,
			aCls  = opt.activeCls;
		var visible = elSuggest.visible;
			
		if (visible) {
			switch (e.keyCode) {
				case 13: // Enter
					if (activeEl) {
						input.value = activeEl.firstChild.data;
						hide(elSuggest);
					}
					return;
				case 38: // 方向键上
					if (this.active == null) {
						this.active = container.lastChild;
						this.attr(this.active, 'class', aCls);
						input.value = this.active.firstChild.data;
					} else {
						if (this.active.previousSibling != null) {
							this.attr(this.active, 'class', iCls);
							this.active = this.active.previousSibling;
							this.attr(this.active, 'class', aCls);
							input.value = this.active.firstChild.data;
						} else {
							this.attr(this.active, 'class', iCls);
							this.active = null;
							input.focus();
							input.value = this.finalValue;
						}
					}
					return;
				case 40: // 方向键下
					if (this.active == null) {
						this.active = container.firstChild;
						this.attr(this.active, 'class', aCls);
						input.value = this.active.firstChild.data;
					} else {
						if (this.active.nextSibling != null) {
							this.attr(this.active, 'class', iCls);
							this.active = this.active.nextSibling;
							this.attr(this.active, 'class', aCls);
							input.value = this.active.firstChild.data;
						} else {
							this.attr(this.active, 'class', iCls);
							this.active = null;
							input.focus();
							input.value = this.finalValue;
						}
					}
					return;
				case 27: // ESC
					hide(elSuggest);
					input.value = this.finalValue;
					return;
			}
		}
		if (this.finalValue !== input.value) {
			elSuggest.innerHTML = '';
			var val = input.value, strs = [];
			if (input.value.indexOf('@') !== -1) {
				strs = input.value.split('@');
				ary.push(strs[1]);
				for (var i=0, len = this.data.length; i<len; i++) {
					if ( this.startsWith(this.data[i], strs[1]) ) {
						ary.push(this.data[i]);
					}
				}
			}
			ary = ary.length>=1 ? ary : this.data;
			for (var i=0; i<ary.length; i++) {
				this.createItem(strs[0]||val, ary[i]);
			}
			this.finalValue = val;
		}
		show(elSuggest);
	}
	function InputSuggest(opt) {
		var input = opt.input,
			containerCls = opt.containerCls ||  'suggest-container',
			itemCls = opt.itemCls || 'suggest-item',
			activeCls = opt.activeCls || 'suggest-active',
			data = opt.data || [],
			url = opt.url,
			finalVal = '',
			activeEl;
			
		var suggestEl = createEl('div', containerCls);
		doc.body.appendChild(suggestEl);
		setSuggest(suggestEl, opt);
		
		bind(input, 'keyup', function(e) {
			if (input.value === '') {
				hide(suggestEl);
			} else {
				onKeyup(e, opt);
			}
		});
		
		if (data.length) {
			
		} else {
			
		}
		
		
		
	}
	
	this.InputSuggest = InputSuggest;
}(this, this.document);

