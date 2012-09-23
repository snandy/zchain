/**
 *
 * DOM util
 * Version:  0.1
 * Author: snandy
 * Blog: http://snandy.cnblogs.com
 *
 * 1, 普通属性直接name
 * 2, IE6/7中特殊属性如class, for等转义
 * 3, IE6/7中style属性使用cssText
 * 4, support对象
 * 5, class 操作 addClass/removeClass/hasClass/toggleClass/replaceClass
 * 6, 
 * 
 */

define(function() {

	var rupper = /([A-Z]|^ms)/g,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/,
		camelRe = /(-[a-z])/gi;
		
	var cssWidth = ['Left', 'Right'],
		cssHeight = ['Top', 'Botton'];
	
	var fixAttr = {
		tabindex: 'tabIndex',
		readonly: 'readOnly',
		'for': 'htmlFor',
		'class': 'className',
		maxlength: 'maxLength',
		cellspacing: 'cellSpacing',
		cellpadding: 'cellPadding',
		rowspan: 'rowSpan',
		colspan: 'colSpan',
		usemap: 'useMap',
		valign: 'vAlign',
		frameborder: 'frameBorder',
		contenteditable: 'contentEditable'
	},
	
	getComputedStyle, currentStyle, getRealStyle, strFloat, getCSS;
	
	// 特性检测
	var support = function() {
		
		var div, p, a;
		
		div = document.createElement( 'div' );
		div.className = 'a';
		div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.45;float:left;">a</a></p>';
		div.setAttribute('class', 't');
		
		p = div.getElementsByTagName('p')[0];
		a = p.getElementsByTagName('a')[0];
	
		var 
		// http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
		setAttr = div.className === 't',
		// http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
		cssText = /;/.test(p.style.cssText),
		
		opacity = /^0.45$/.test(a.style.opacity),
		getComputedStyle = !!(document.defaultView && document.defaultView.getComputedStyle);
		
		return {
			setAttr : setAttr,
			cssText : cssText,
			opacity : opacity,
			classList : !!div.classList,
			cssFloat : !!a.style.cssFloat,
			getComputedStyle : getComputedStyle
			
		};
		
	}();
	
	strFloat = support.cssFloat ? 'cssFloat' : 'styleFloat';
	
	var special = {
		style : {
			get: function( el ) {
				var txt = el.style.cssText;
				if(txt) {
					txt =  support.cssText ? txt : txt + ';';
					return txt.toLowerCase();
				}
			},
			set: function( el, value ) {
				return (el.style.cssText = '' + value);
			}
		}
	};
	
	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}
	
	if(document.defaultView && document.defaultView.getComputedStyle) {
		
		getRealStyle = function(el) {
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			return defaultView.getComputedStyle( el, null );
		};
		
		getComputedStyle = function(el, name) {
			var ret, defaultView, computedStyle;
	
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			
			if( (computedStyle = defaultView.getComputedStyle( el, null )) ) {
				ret = computedStyle.getPropertyValue( name );
				if(ret === '') {
					ret = el.style[name];
				}
			}
	
			return ret;
		};
	}
	
	if(document.documentElement.currentStyle) {
		
		getRealStyle = function(el) {
			return el.currentStyle;
		};
		
		currentStyle = function( el, name ) {
			var ret = el.currentStyle && el.currentStyle[ name ];
			return ret === "" ? "auto" : ret;
		};
	}
	
	getCSS = getComputedStyle || currentStyle;
	
	function setCSS(el, name, val) {
		name = name.replace(camelRe, camelFn);
		var cssNumber = {
			fontWeight : 1,
			zIndex : 1,
			zoom : 1
		};
		if(typeof val === 'number' && !cssNumber[name]) {
			val += 'px';
		}
		el.style[name] = val;
	}
	
	// class 模块
	var supportClassList = support.classList;
	var hasClass, addClass, removeClass, toggleClass, replaceClass;
	
	function check(el, cls) {
		if (el.nodeType !== 1 || typeof cls !== 'string') {
			return false;
		}
		return true;
	}
	if(supportClassList) {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return el.classList.contains(cls);
			else
				return false;
		};
		addClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.add(c);
				}
			}
		};
		removeClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.remove(c);
				}
			}
		};
		toggleClass = function(el, cls) {
			if( check(el, cls) ) {
				el.classList.toggle(cls);
			}
		};
		
	}
	else {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') != -1;
			else
				return false
		};
		addClass = function(el, cls) {
			if( check(el, cls) && !hasClass(el, cls) ) {
				el.className += (el.className ? " " : "") + cls;;
			}
		};
		removeClass = function(el, cls) {
			if( check(el, cls) ) {
				el.className = el.className.replace(RegExp("\\b" + cls + "\\b", "g"), "");
			}
		};
		toggleClass = function(el, cls) {
			hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
		};
	}
	replaceClass = function(el, oldCls, newCls) {
		removeClass(el, oldCls);
		addClass(el, newCls);
	}
	
	// 获取元素宽高
	function getWidthOrHeight(el, name, extra) {
		// Start with offset property
		var val = name === "width" ? el.offsetWidth : el.offsetHeight,
			which = name === "width" ? cssWidth : cssHeight;
		
		// display is none
		if(val === 0) {
			return 0;
		}
		
		// css3 box-sizing
		if(extra === 'border-box') {
			return val + 'px';
		}
		
		for(var i = 0, a; a = which[i++];) {
			val -= parseFloat( getCSS(el, "border" + a + "Width") ) || 0;
			val -= parseFloat( getCSS(el, "padding" + a) ) || 0;
		}
	
		if(extra === undefined) {
			return val + 'px';
		}
	
		if(extra === 'padding' || extra === "margin" || extra === "border") {
			for(var i = 0, a; a = which[i++];) {
				val += parseFloat( getCSS( el, extra + a + (extra==='border' ? 'Width' : '')) ) || 0;
			}
			return val + 'px';
		}
		
	}
	
	function getWorH(el, wh, extra) {
		switch(extra) {
			case 'border-box' :
			case 'margin' :
			case 'padding':
			case 'border' :
				return getWidthOrHeight(el, wh, extra);
			default :
				return getWidthOrHeight(el, wh);
		}	
	}
	
	// 获取文档宽高
	function getDocWH(name) {
		var doc = document;
		var val = Math.max(
			doc.documentElement["client" + name],
			doc.body["scroll" + name], doc.documentElement["scroll" + name],
			doc.body["offset" + name], doc.documentElement["offset" + name]
		);
		return val;
	}
	
	div = p = a = null;
	
	return {
		
		support : support,
		
		setAttr : function(el, name, val) {
			if(support.setAttr) {
				el.setAttribute(name, val);
				return val;
				
			}else {
				if(special[name]) {
					return special[name].set(el, val);
					
				}else {
					el.setAttribute(fixAttr[name] || name, val);
					return val;
				}
			}
			
		},
		
		getAttr : function(el, name) {
			if(support.setAttr) {
				return el.getAttribute(name);
				
			}else {
				if(special[name]) {
					return special[name].get(el);
					
				}else {
					return el.getAttribute(fixAttr[name] || name);
				}
			}
			
		},
		
		// 布尔类型的使用property，不要使用attribute，如checkbox/radio 的checked属性
		// 类似：autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected
		setProp : function(el, name, val) {
			name = fixAttr[name] || name;
			el[name] = val;
		},
		
		getProp : function(el, name) {
			name = fixAttr[name] || name;
			return  el[name];
		},
		
		setVal : function(el, val) {
			el.value = val;
		},
		
		getVal : function(el) {
			return el.value;
		},
		
		html : function(el, val) {
			this.setProp(el, 'innerHTML', val);
		},
		
		text : function(el, val) {
			this.setProp(el, el.innerText === undefined ? 'innerText' : 'textContent', val);
		},
		
		setCssText : function(el, css) {
			var sty = el.style, str = sty.cssText || '';
			if (!support.cssText) {
				str += ';';
			}
			sty.cssText = str + css;
		},
		
		setCSS : setCSS,
		
		getCSS : getCSS,
		
		setOpacity : function(el, val) {
			if(support.opacity) {
				el.style.opacity = (val === 1 ? '' : '' + val);
			} else {
				el.style.filter = 'alpha(opacity=' + val * 100 + ');';
				el.style.zoom = 1;
			}
		},
		
		getOpacity : function(el, val) {
			if(support.getComputedStyle) {
				style = window.getComputedStyle(el, null);
				opa = style.opacity;
				// http://www.cnblogs.com/snandy/archive/2011/07/27/2118441.html
				if(opa.length>1) {
					opa = opa.substr(0,3);
				}
				return parseFloat(opa);
			}else{
				style = el.currentStyle;
				filter = style.filter;
				return filter.indexOf('opacity=') >= 0 ? parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
			}
		},
		
		setFloat : function(el, val) {
			setCSS(el, strFloat, val);
		},
		
		getFloat : function(el) {
			return getCSS(el, strFloat);
		},
		
		hasClass : hasClass,
		
		addClass : addClass,
		
		removeClass : removeClass,
		
		toggleClass : toggleClass,
		
		replaceClass : replaceClass,
		
		setWidth : function(el, size) {
			if(!isNaN(size)) {
				el.style.width = val + 'px';
			}
		},
		
		getWidth : function(el, extra) {
			return getWorH(el, 'width', extra);
		},
		
		getInnerWidth : function(el) {
			return getWorH(el, 'width', 'border-box');
		},
		
		getOuterWidth : function(el) {
			return getWorH(el, 'width', 'margin');
		},
		
		setHeight : function(el, size) {
			if(!isNaN(size)) {
				el.style.height = val + 'px';
			}
		},
		
		getHeight : function(el, extra) {
			return getWorH(el, 'height', extra);
		},
		
		getInnerHeight : function(el) {
			return getWorH(el, 'height', 'border-box');
		},
		
		getOuterHeight : function(el) {
			return getWorH(el, 'height', 'margin');
		},
		
		setWH : function(el, w, h) {
			var style = el.style;
			if(!isNaN(w) && !isNaN(h)) {
				style.width = w + 'px';
				style.height = h + 'px';
			}
		},
		
		getWH : function(el, extra) {
			return {
				width : this.getWidth(el, extra),
				height : this.getHeight(el, extra)
			};
		},
		
		getStyle : function(el) {
			return el.style;
		},
		
		getRealStyle : getRealStyle,
		
		getDocWidth : function() {
			return getDocWH('Width');
		},
		
		getDocHeight : function() {
			return getDocWH('Height');
		},
		
		getWinWidth : function() {
			return window['innerWidth'] || document.documentElement.clientWidth;
		},
		
		getWinHeight : function() {
			return window['innerHeight'] || document.documentElement.clientHeight;
		},
		
		getViewSize : function() {
			return {
				width : this.getWinWidth(),
				height : this.getWinHeight()
			}
		},
		
		getFullSize : function() {
			return {
				width : this.getDocWidth(),
				height : this.getDocHeight()
			}
		},
		
		getOffset : function(el) {
			var box;
			try {
				box = el.getBoundingClientRect();
			} catch(e) {}
			
			var doc = el.ownerDocument,
				docElem = doc.documentElement;
			var body = doc.body,
				win = doc.defaultView || doc.parentWindow,
				clientTop  = docElem.clientTop  || body.clientTop  || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0,
				scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
				scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
				top  = box.top  + scrollTop  - clientTop,
				left = box.left + scrollLeft - clientLeft;
		
			return { top: top, left: left };
		},
		
		getRefOffset : function(el, refEl) {
			var doc = el.ownerDocument,
				docElem = doc.documentElement,
				body = doc.body,
				refEl = refEl || body,
				x = 0,
				y = 0;
			while(el && el !== refEl && el !== body && el !== docElem) {
				x += el.offsetLeft;
				y += el.offsetTop;
				el = el.offsetParent;
			}
			return {top: x, left: y};
			
		}
		
	};

});

