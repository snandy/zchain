/**
 *
 * ZChain JS
 * Version:  0.1
 * weibo: @snandy
 * Blog: http://snandy.cnblogs.com
 * Date: 2011-04-17
 * 
 * 1, 重写了选择器，已支持id，className, tagName, attribute
 * 2, 重写了事件模块
 * 3, 去掉了isUndefined，isNull，isBoolean，isString，isNumber等
 * 4, 事件模块重写  （die/undelegate）
 * 5, 增加domReady（$.ready 或  $(function(){})）
 * 6, 增加data/removeData，事件模块重写利用data函数
 * 7, 增加特性判断模块（support对象）
 * 8, class属性操作重写（标准浏览器使用classList属性）
 * 9, 添加offset, pos, offsetParent, isWindow方法
 * 
 */

(function(window, undefined) {

var OP = Object.prototype,
	SP = String.prototype,
	AP = Array.prototype,
	slice = AP.slice,
	push  = AP.push,
	doc	  = window.document,
	isStrict = doc.compatMode == 'CSS1Compat',
	rwhite = /\s/,
	trimLeft = /^\s+/,
	trimRight = /\s+$/,
	rroot = /^(?:body|html)$/i;
	
// IE6/7/8 return false
if(!rwhite.test( '\xA0' )) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

var makeArray = function(obj) {
	// IE9/Firefox/Safari/Chrome/Opera
	return slice.call(obj,0);
}
try{
	slice.call(doc.documentElement.childNodes, 0)[0].nodeType;
}catch(e){
	// IE6/7/8
	makeArray = function(obj) {
		var res = [];
		for(var i=0,len=obj.length; i<len; i++) {
			res[i] = obj[i];
		}
		return res;
	}
}

// 特性检测
var support = function() {
	var div, p, a;
	div = doc.createElement( 'div' );
	div.className = 'a';
	div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.45;float:left;">a</a></p>';
	div.setAttribute('class', 't');
	
	p = div.getElementsByTagName('p')[0];
	a = p.getElementsByTagName('a')[0];
	
	var setAttr, setAttr, opacity, getComputedStyle;
	
	// http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
	setAttr = div.className === 't',
	// http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
	cssText = /;/.test(p.style.cssText),
	opacity = /^0.45$/.test(a.style.opacity),
	getComputedStyle = !!(doc.defaultView && doc.defaultView.getComputedStyle);
	
	return {
		setAttr : setAttr,
		cssText : cssText,
		opacity : opacity,
		classList : !!div.classList,
		cssFloat : !!a.style.cssFloat,
		getComputedStyle : getComputedStyle
	};
}();

function getWindow(el) {
	return zChain.isWindow(el) ? el :
			el.nodeType === 9 ?
			el.defaultView || el.parentWindow :
			false;
}
function getOffset(el, doc, docElem, box) {
	try {
		box = el.getBoundingClientRect();
	} catch(e) {}

	if ( !box || !zChain.contains(docElem, el) ) {
		return box ? {top: box.top, left: box.left} : {top: 0, left: 0};
	}

	var body = doc.body,
		win = getWindow(doc),
		clientTop  = docElem.clientTop  || body.clientTop  || 0,
		clientLeft = docElem.clientLeft || body.clientLeft || 0,
		scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
		scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
		top  = box.top  + scrollTop  - clientTop,
		left = box.left + scrollLeft - clientLeft;

	return {top: top, left: left};
}

function setOffset(el, options) {
	var curElem = zChain(el);
	var position = curElem.css('position');
	
	if (position === 'static') {
		el.style.position = 'relative';
	}

	var top = 'top',
		left = 'left',
		curOffset = curElem.offset(),
		curCSSTop = curElem.css('top'),
		curCSSLeft = curElem.css('left'),
		calculatePosition = ( position === 'absolute' || position === 'fixed' ) && ([curCSSTop, curCSSLeft].join(',')).indexOf('auto') > -1,
		props = {}, curPosition = {}, curTop, curLeft;
		
	if (calculatePosition) {
		curPosition = curElem.pos();
		curTop = curPosition.top;
		curLeft = curPosition.left;
	} else {
		curTop = parseFloat(curCSSTop) || 0;
		curLeft = parseFloat(curCSSLeft) || 0;
	}

	if (options.top != null) {
		props.top = (options.top - curOffset.top) + curTop;
	}
	if (options.left != null) {
		props.left = (options.left - curOffset.left) + curLeft;
	}
	
	curElem.css(props);
}

function filter(all,attr,val) {
	var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)');
	function test(node) {
		var v = attr == 'className' ? node.className : node.getAttribute(attr);
		if(v) {
			if(val) {
				if(reg.test(v))
					return true;
			} else {
				return true;
			}
		}
		return false;
	}
	var i = -1, el, r = -1, res = [];
	while((el = all[++i])) {
		if(test(el)){
		res[++r] = el;
		}
	}
	return res;
}

function camelFn(name) {
	return name.replace(/[A-Z]/g, function(match) {
		return '-' + match.toLowerCase();
	});
}

function zChain(selector, context) {
	return new zChain.prototype.init(selector, context);
}
zChain.prototype = {
	init: function(selector, context) {
		
		var rId = /^#[-\w]+/,
		
		rCls = /^([-\w]+)?\.([-\w]+)/,
		
		rTag = /^([\w\*]+)$/,
		
		rAttr = /^([\w]+)?\[([\w-]+)(=(\w+))?\]/;
		
		simple = /^[-#\w]+$/.test(selector);
		
		context = context === undefined ?
			doc :
				typeof context === 'string' ?
					doc.getElementById(context.substr(1, context.length)) :
						context;
		
		if (selector == null) {
			return;
		}
		if (typeof selector === 'function') {
			zChain.ready(selector);
			return;
		}
		if (selector.nodeType || selector == window) {
			this[0] = selector;
			this.length = 1;
			return;
		}
		if (rId.test(selector)) {
			this[0] = doc.getElementById(selector.substr(1, selector.length));
			if( this[0] ) {
				this.length = 1;
			}
			return;
		}
		if (!simple && context.querySelectorAll) {
			if (context.nodeType == 1) {
				var old = context.id, id = context.id = '__zchain__';
				try {
					return this._toSelf( context.querySelectorAll( '#' + id + ' ' + selector ) );
				} catch(e){
				} finally {
					old ? context.id = old : context.removeAttribute('id');
				}
			}
			this._toSelf( context.querySelectorAll(selector) );
			return;
		}
		if ( rCls.test(selector) ) {
			var ary = selector.split('.'),	all = context.getElementsByTagName(ary[0] || '*');
			this._toSelf( filter(all,'className',ary[1]) );
			return;
		}
		if ( rTag.test(selector) ) {
			this._toSelf( context.getElementsByTagName(selector) );
			return;
		}
		if ( rAttr.test(selector) ) {
			var ary = rAttr.exec(selector), all = context.getElementsByTagName(ary[1] || '*');
			this._toSelf( filter(all,ary[2],ary[4]) );
			return;
		}
		
	},
	length: 0,
	_toSelf: function(els) {
		push.apply(this, makeArray(els));
	},
	find: function(selector, idx) {
		var context = idx === undefined ? this[0] : this[idx];
		return new zChain.prototype.init(selector, context);
	},
	toArray: function() {
		return makeArray(this);
	},
	slice: function() {
		var ret = zChain(), ary = slice.apply(this,arguments);
		push.apply(ret,ary);
		return ret;
	},
	eq: function(i) {
		return i === -1 ?
		this.slice( i ) :
		this.slice( i, +i + 1 );
	},
	first: function() {
		return this.eq(0);
	},
	last: function() {
		return this.eq(-1);
	},
	get: function(i) {
		return i == null ?
		this.toArray() :
		(i < 0 ? this.slice(i)[0] : this[i]);
	},
	each: function(fn) {
		zChain.each(this, fn);
		return this;
	},
	attr: function(name, val) {
		if (val === undefined) {
			var el = this[0];
			switch (name) {
				case 'class':
					return el.className;
				case 'style':
					return el.style.cssText;
				default:
					return el.getAttribute(name);
			}
		} else {
			this.each( function(el) {
				switch (name) {
					case 'class':
						el.className = val;
						break;
					case 'style':
						el.style.cssText = val;
						break;
					default:
						el.setAttribute(name, val);
				}
			});
			return this;
		}
	},
	prop: function(name, val) {
		if (val === undefined) {
			return this[0][name];
		} else {
			this.each( function(el) {
				el[name] = val;
			});
			return this;
		}
	},
	css: function(name, val) {
		if (typeof name === 'object') {
			for (var k in name) {
				this.css(k, name[k]);
			}
			return;
		}
		if (val === undefined) {
			var el = this[0], style;
			if (name == 'opacity') {
				var opacity, filter, reg = /opacity=/i;
				if(!zChain.ie) {
					style = window.getComputedStyle(el, null);
					opacity = style.opacity;
					// http://www.cnblogs.com/snandy/archive/2011/07/27/2118441.html
					if(opacity.length>1) {
						opacity = opacity.substr(0,3);
					}
					return parseFloat(opacity);
				}else{
					style = el.currentStyle;
					filter = style.filter;
					return reg.test(filter) ? parseFloat(filter.match(/opacity=([^)]*)/i)[1]) / 100 : 1;
				}
			} else {
				if (window.getComputedStyle) {
					return window.getComputedStyle(el, null).getPropertyValue(camelFn(name));
				}
				if (doc.defaultView && doc.defaultView.getComputedStyle) {
					var computedStyle = doc.defaultView.getComputedStyle(el, null);
					if (computedStyle){
						return computedStyle.getPropertyValue(camelFn(name));
					}
				}
				if (el.currentStyle) {
					return el.currentStyle[name];
				}
				return el.style[name];
			}
		} else {
			this.each( function(el) {
				if (name == 'opacity') {
					if (zChain.ie) {
						el.style.filter = 'alpha(opacity=' + val * 100 + ');';
						el.style.zoom = 1;
					} else {
						el.style.opacity = (val == 1 ? '' : '' + val);
					}
				} else {
					if (typeof val == 'number') {
						val += 'px';
					}
					el.style[name] = val;
				}
			});
			return this;
		}
	},
	offsetParent: function() {
		var parent = this[0].offsetParent || document.body;
		while ( parent && (!rroot.test(parent.nodeName) && zChain(parent).css('position') === 'static') ) {
			parent = parent.offsetParent;
		}
		
		return zChain(parent);
	},
	pos: function() {
		if (!this[0]) {
			return null;
		}
		
		var $parent = this.offsetParent(),
		offset      = this.offset(),
		parentOffset = rroot.test($parent[0].nodeName) ? { top: 0, left: 0 } : $parent.offset();

		offset.top  -= parseFloat( this.css('marginTop') ) || 0;
		offset.left -= parseFloat( this.css('marginLeft') ) || 0;

		parentOffset.top  += parseFloat( $parent.css('borderTopWidth') ) || 0;
		parentOffset.left += parseFloat( $parent.css('borderLeftWidth') ) || 0;

		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},
	offset: function(options) {
		if (arguments.length) {
			return options === undefined ? this :
				this.each(function(i) {
					setOffset(this, options, i);
				});
		}
	
		var el = this[0], doc = el && el.ownerDocument;
	
		if (!doc) {
			return null;
		}
	
		return getOffset(el, doc, doc.documentElement);
	},
	isStyle: function(name, val) {
		return this.css(name) == val;
	},
	text: function(val) {
		return this.prop(this[0].innerText === undefined ? 'innerText' : 'textContent', val);
	},
	html: function(val) {
		return this.prop('innerHTML', val);
	},
	val: function(val) {
		if (val === undefined) {
			var el = this[0];
			if (el.tagName == 'INPUT' && /checkbox|radio/.test(el.type)) {
				return el.checked;
			}
			return el.value;
		} else {
			return this.prop('value', val);
		}
	},
	hasClass: function(name) {
		return domClass.has(this[0], name);
	},
	addClass: function(name) {
		return this.each( function(el) {
			domClass.add(el, name);
		});
	},
	removeClass: function(name) {
		return this.each( function(el) {
			domClass.remove(el, name);
		});
	},
	toggleClass: function(name) {
		return this.each( function(el) {
			domClass.toggle(el, name);
		});
	},
	replaceClass: function(oCls, nCls) {
		return this.each( function(el) {
			domClass.replace(el, oCls, nCls);
		});
	},
	on: function(type, fn, once, /* Internal use only */liveHandler) {
		return this.each( function(el) {
			zChain.event.add({
				el : el,
				type : type,
				fn : fn,
				once : once,
				live : liveHandler
			});
		});
	},
	un: function(type,fn) {
		return this.each( function(el) {
			zChain.event.remove({
				el : el,
				type : type,
				fn : fn
			});
		});
	},
	fire: function(type) {
		this.each( function(el) {
			zChain.event.dispatch(el,type);
		});
	},
	delegate: function(selector, type, fn) {
		if(arguments.length === 2 && zChain.isFunction(type)) {
			fn = type;
			type = 'click';
		}
		return this.each(function(el) {
			zChain(el).on(type, function(e) {
				var target = e.target;
				zChain(selector, this).each( function(el) {
					if (target == el || zChain.contains(el, target)) {
						fn.call(el, e);
					}
				});
			}, null, fn);
		});
	},
	undelegate: function(selector, type, fn) {
		return this.each( function(el) {
			zChain(el).un(type, fn);
		} );
	},
	hover: function(fnIn,fnOut) {
		this.each( function(el) {
			zChain(el).mouseenter(fnIn).mouseleave(fnOut);
		});
	}
};
zChain.fn = zChain.prototype.init.prototype = zChain.prototype;

zChain.extend = zChain.fn.extend = function(obj) {
	for(var a in obj) {
		this[a] = obj[a];
	}
};

// 元素class属性操作
var domClass = function() {
	var supportClassList = support.classList;
	var has, add, remove, toggle, replace;
	
	function check(el, cls) {
		if (el.nodeType !== 1 || typeof cls !== 'string') {
			return false;
		}
		return true;
	}
	if (supportClassList) {
		has = function(el, cls) {
			if ( check(el, cls) )
				return el.classList.contains(cls);
			else
				return false;
		};
		add = function(el, cls) {
			var i = 0, c;
			if ( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.add(c);
				}
			}
		};
		remove = function(el, cls) {
			var i = 0, c;
			if ( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.remove(c);
				}
			}
		};
		toggle = function(el, cls) {
			if ( check(el, cls) ) {
				el.classList.toggle(cls);
			}
		};
		
	} else {
		has = function(el, cls) {
			if ( check(el, cls) )
				return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') != -1;
			else
				return false;
		};
		add = function(el, cls) {
			if ( check(el, cls) && !has(el, cls) ) {
				el.className += (el.className ? ' ' : '') + cls;;
			}
		};
		remove = function(el, cls) {
			if ( check(el, cls) ) {
				el.className = el.className.replace(RegExp('\\b' + cls + '\\b', 'g'), '');
			}
		};
		toggle = function(el, cls) {
			has(el, cls) ? remove(el, cls) : add(el, cls);
		};
	}
	
	replace = function(el, oldCls, newCls) {
		remove(el, oldCls);
		add(el, newCls);
	}
	
	return {
		has : has,
		add : add,
		remove : remove,
		toggle : toggle,
		replace : replace
	};
}();

zChain.extend({
	uuid : 0,
	cache : {},
	expando : 'zChain' + (''+Math.random()).replace(/\D/g, ''),
	data : function(el, name, data) {
		var internalKey = zChain.expando, 
		
			getByName = typeof name === 'string', 
			
			thisCache, isNode = el.nodeType,
			
			cache = isNode ? zChain.cache : el,
			
			id = isNode ? el[ internalKey ] : el[ internalKey ] && internalKey;
			
			if ( !id && isNode ) {
				el[internalKey] = id = ++zChain.uuid;
			}
			
			if ( !cache[ id ] ) {
				cache[id] = {};
			}
			
			thisCache = cache[ id ];
			
			if ( data !== undefined ) {
				thisCache[name] = data;
			}
	
			return getByName ? thisCache[name] : thisCache;
	},
	removeData : function(el, name) {
		var internalKey = zChain.expando, id = el[internalKey],
			thisCache = zChain.cache[ id ];
			
		if (!id || !thisCache) {
			return;
		}
		
		if (typeof name === 'string') {
			delete thisCache[name];
		} else {
			delete zChain.cache[id];
		}
	}
});

zChain.fn.extend({
	data : function(key, val) {
		if ( key === undefined ) {
			return zChain.data(this[0]);
		}
		
		if ( val === undefined ) {
			return zChain.data(this[0], key);
		} else {
			this.each(function() {
				zChain.data(this, key, val);
			});
		}
	},
	removeData : function(key) {
		return this.each(function() {
			zChain.removeData(this, key);
		});
	}
});

zChain.extend({
	isFunction: function(f) {
		return typeof f === 'function';
	},
	isPlainObject: function(o) {
		if (!o || o === window || o === doc || o === doc.body) {
			return false;
		}
		return 'isPrototypeOf' in o && OP.toString.call(o) === '[object Object]';
	},
	isEmptyObject: function(o) {
		for (var a in o) {
			return false;
		}
		return true;
	},
	isPrimitive: function(b) {
		var a = typeof b;
		return !!(b === undefined || b === null || a == 'boolean' || a == 'number' || a == 'string');
	},
	isWindow: function(obj) {
		return obj != null && obj == obj.window;
	},
	ready: (function(fn) {
		var init, bindReady, fns = [], 
			isReady = 0, isBind = 0,
			testEl = doc.createElement('p');
		
		function domReady(fn) {
			bindReady(fn);
			if (isReady) {
				fn();
			} else {
				fns.push(fn);
			}
		}
		
		function bindReady() {
			if(isBind)
				return;
			isBind = 1;
	
			// Catch cases where domReady is called after the browser event has already occurred.
			// readyState: 'uninitalized'、'loading'、'interactive'、'complete' 、'loaded'
			if(doc.readyState === 'complete') {
				init();
			} else if (doc.addEventListener) {
				doc.addEventListener('DOMContentLoaded', function () {
					doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
					init();
				}, false);
				window.addEventListener('onload', init, false);
			} else if(doc.attachEvent) {
				// In IE, ensure firing before onload, maybe late but safe also for iframes.
				doc.attachEvent('onreadystatechange', function() {
					if (doc.readyState === 'complete') {
						doc.detachEvent('onreadystatechange', arguments.callee);
						init();
					}
				});
				window.attachEvent('onload', init);
	
				// If IE and not a frame, continually check to see if the document is ready.
				if(testEl.doScroll && window == window.top) {
					doScrollCheck();
				}
			}
		}
		
		// Process items when the DOM is ready.
		function init() {
			isReady = 1;
	
			// Make sure body exists, at least, in case IE gets a little overzealous.
			// This is taked directly from jQuery's implementation.
			if (!doc.body) {
				setTimeout(init, 10);
				return;
			}
	
			for (var i = 0, l = fns.length; i < l; i++) {
				fns[i]();
			}
			fns = [];
		}
		function doScrollCheck() {
			if(isReady) return;
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				testEl.doScroll('left');
			} catch (e) {
				setTimeout(doScrollCheck, 10);
				return;
			}
	
			init();
		}
		
		return domReady;
	})()
});

zChain.extend( function(ua) {
	var b = {
		msie: /msie/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua),
		maxthon: /maxthon/.test(ua),
		sogou: /se/.test(ua),
		tt: /TencentTraveler/.test(ua)
	};
	var mark = '', v;
	for(var i in b) {
		if(b[i]) {
			mark = 'safari' == i ? 'version' : i;
			break;
		}
	}
	b.version = mark && RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)').test(ua) ? RegExp.$1 : '0';
	b.ie = b.msie;
	v = parseInt(b.version, 10);
	b.ie6 = b.msie && v == 6;
	b.ie7 = b.msie && v == 7;
	b.ie8 = b.msie && v == 8;
	b.ie9 = b.msie && v == 9;
	return b;
}(navigator.userAgent.toLowerCase())
);

zChain.extend({
	each: function(obj, fn) {
		var name, i = 0, len = obj.length;
		if ('length' in obj) {
			for (var val = obj[0]; i < len && fn.call(val, val, i) !== false; val = obj[++i]) {
			}
		} else {
			for (name in obj) {
				if (fn.call(obj[name], obj[name], name) === false) {
					break;
				}
			}
		}
	},
	
	map: function(obj, fn) {
		var value, key, ret = [], i = 0, length = obj.length,
			isArray = length !== undefined && typeof length === 'number';
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = fn(obj[i], i);

				if (value != null) {
					ret[ret.length] = value;
				}
			}
		} else {
			for (key in obj) {
				value = fn(obj[key], key);

				if (value != null) {
					ret[ret.length] = value;
				}
			}
		}
		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},
	
	makeArray: makeArray,
	
	applyIf: function(o, c) {
		var args = slice.call(arguments, 1), i = -1, p;
		if (args.length) {
			while (c = args[++i]) {
				for (p in c) {
					if(o[p] === undefined) o[p] = c[p];
				}
			}
		}
		return o;
	},
	
	contains: function(a, b) {
		try {
			return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
		} catch(e) {}
	}
});

zChain.extend({
	array: {
		contain: function(arr, val) {
			return arr.indexOf(val) != -1;
		},
		removeAt: function(arr, i) {
			return AP.splice.call(arr, i, 1).length == 1;
		},
		remove: function(arr, obj) {
			var i = arr.indexOf(obj), rv;
			if ((rv = i >= 0)) {
				this.removeAt(arr, i);
			}
			return rv;
		}
	},
	string: {
		encodeUriRegExp_: /^[a-zA-Z0-9\-_.!~*'()]*$/,
		startsWith: function(str, prefix) {
			return str.lastIndexOf(prefix, 0) == 0;
		},
		endsWith: function(str, suffix) {
			var l = str.length - suffix.length;
			return l >= 0 && str.indexOf(suffix, l) == l;
		},
		isEmpty: function(str) {
			return /^[\s\xa0]*$/.test(str);
		},
		isNumeric: function(str) {
			return !/[^0-9]/.test(str);
		},
		toNumber: function(str) {
			var num = Number(str);
			if (num == 0 && this.isEmpty(str)) {
				return NaN;
			}
			return num;
		},
		trimLeft: function(str) {
			return str.replace(trimLeft, '');
		},
		trimRight: function(str) {
			return str.replace(trimRight, '');
		},
		left: function(str, n) {
			var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
			s = s.slice(0, n).replace(/\*\*/g, ' ').replace(/\*/g, '').length;
			return str.slice(0, s);
		},
		right: function(str, n) {
			var len = str.length;
			var s = str.replace(/\*/g, ' ').replace(/[^\x00-\xff]/g, '**');
			s = s.slice(s.length - n, s.length).replace(/\*\*/g, ' ').replace(/\*/g, '').length;
			return str.slice(len - s, len);
		},
		urlEncode: function(str) {
			str = String(str);
			if (!this.encodeUriRegExp_.test(str)) {
				return encodeURIComponent(str);
			}
			return str;
		},
		urlDecode: function(str) {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		}
	},
	cookie: function(name, val) {
		if (arguments.length == 2) {
			var date = new Date(2099, 12, 31);
			doc.cookie = name + '=' + val + ';expires=' + date.toGMTString() + ';';
		} else {
			var arg = name + '=', ck = doc.cookie, len = ck.length;
			if (ck.indexOf(arg) != -1) {
				var vstr = ck.indexOf(arg) + arg.length;
				ck.indexOf(';', vstr) == -1 ? len = ck.length : len = ck.indexOf(';', vstr);
				return ck.substring(vstr, len);
			} else {
				return '';
			}
		}
	}
	
});

// ajax.json/.text/.xml/.request
var ajax = function() {
	
	function request(url, opt) {
		function fn(){}
		opt = opt || {};
		var
		async = opt.async !== false,
		method = opt.method || 'GET',
		type = opt.type || 'text',
		encode = opt.encode || 'UTF-8',
		timeout = opt.timeout || 0,
		data = opt.data || null,
		success = opt.success || fn,
		failure = opt.failure || fn;
		method = method.toUpperCase();
		
		if (data && typeof data == 'object') {//对象转换成字符串键值对
			data = _serialize(data);
		}
		if (method == 'GET' && data) {
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
		}
		var xhr = function() {
			try {
				return new XMLHttpRequest();
			} catch (e) {
				try {
					return new ActiveXObject('Msxml2.XMLHTTP');
				} catch (e) {
					try {
						return new ActiveXObject('Microsoft.XMLHTTP');
					} catch (e) {
						failure(null, 'create xhr failed', e);
					}
				}
			}
		}();
		if (!xhr) {
			return;
		}
		var isTimeout = false, timer;
		if (async && timeout > 0) {
			timer = setTimeout( function() {
				isTimeout = true;// 先给isTimeout赋值，不能先调用abort
				xhr.abort();
			}, timeout);
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (isTimeout) {
					failure(xhr, 'request timeout');
				} else {
					_onStateChange(xhr, type, success, failure);
					clearTimeout(timer);
				}
			} else {
			}
		};
		xhr.open(method, url, async);
		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
		}
		xhr.send(data);
		return xhr;
	}
	function _serialize(obj) {
		var a = [];
		for (var k in obj) {
			var val = obj[k];
			if (val.constructor == Array) {
				for(var i = 0, len = val.length; i < len; i++) {
					a.push(k + '=' + encodeURIComponent(val[i]));
				}
			} else {
				a.push(k + '=' + encodeURIComponent(val));
			}
		}
		return a.join('&');
	}
	function _onStateChange(xhr, type, success, failure) {
		var s = xhr.status, result;
		if (s >= 200 && s < 300) {
			switch (type) {
				case 'text':
					result = xhr.responseText;
					break;
				case 'json':
					result = function(str) {
						try {
							return window.JSON.parse(str);
						} catch (e) {
							try {
								return (new Function('return ' + str))();
							} catch (e) {
								failure(xhr, 'parse json error', e);
							}
						}
					}(xhr.responseText);
					break;
				case 'xml':
					result = xhr.responseXML;
					break;
			}
			result !== undefined && success(result);
		} else {
			failure(xhr, xhr.status);
		}
		xhr = null;
	}
	
	return (function() {
		var ajax = {request: request}, types = ['text', 'json', 'xml'];
		zChain.each(types, function(type, i) {
			ajax[type] = function(url, opt) {
				opt = opt || {};
				opt.type = type;
				return request(url, opt);
			}
		});
		return ajax;
	})();
	
}();

// event.add/.remove/.dispatch
var event = function() {
	
	var w3c = !!window.addEventListener,
	
		addListener = w3c ?
			function(el, type, fn){ el.addEventListener(type, fn, false); } :
			function(el, type, fn){ el.attachEvent('on' + type, fn); },
			
		removeListener = w3c ?
			function(el, type, fn){ el.removeEventListener(type, fn, false); } :
			function(el, type, fn){ el.detachEvent('on' + type, fn); },
		
		dispatch = w3c ?
			function(el, type){
				var type = getEventType(type);
				try{
					var evt = doc.createEvent('Event');
					evt.initEvent(type,true,true);
					el.dispatchEvent(evt);
				} catch(e) {};
			} :
			function(el, type){
				try {
					el.fireEvent('on'+type);
				} catch(e) {}
			};
	
	function getEventType(type){
		// fix noIE mouseenter/mouseleave
		var type = type;
		if (!zChain.ie){
			type = type=='mouseenter' ? 'mouseover' :
				type=='mouseleave' ? 'mouseout' :
				type;
		}
		return type;
	}
	function _each(ary, fn) {
		for (var i=0; i<ary.length;) {
			fn(i, ary[i]) ? i=0 : i++;
		}
	}
	function now() {return (new Date).getTime();}
	function returnFalse() {return false;}
	function returnTrue() {return true;}
	
	function Event(src) {
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
	
	function fixEvent(evt) {
		var props = 'altKey bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedTarget screenX screenY shiftKey target toElement view wheelDelta which'.split(' '),
			len   = props.length;
	
		var originalEvent = evt;
		evt = new Event(originalEvent);
		
		for (var i = len, prop; i;) {
			prop = props[ --i ];
			evt[ prop ] = originalEvent[ prop ];
		}
		if (!evt.target) {
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
		
		return evt;
	}
	function _remove(el, type) {
		var type = getEventType(type),
			events = zChain.data(el, 'events');
		
		removeListener(el, type, events[type].handle);
		delete events[type];
		if (zChain.isEmptyObject(events)) {
			zChain.removeData(el, 'events');
		}
	}
	function add(opt) {
		var el	  = opt.el,
		fn	 = opt.fn,
		once = opt.once,
		live = opt.live,
		type = opt.type || 'click',
		listeners,
		eventHandle;
		
		if (el==window || el.nodeType === 3 || el.nodeType === 8) {
			return;
		}
		
		type = getEventType(type);
		
		var events = zChain.data(el, 'events');
			
		if (!events) {
			events = zChain.data(el, 'events', {});
		}
		
		eventHandle = events.handle;
		if (!eventHandle) {
			eventHandle = events.handle = function(e) {
				return evtHandle.call(eventHandle.el, e);
			}
		}
		
		listeners = events[type];
		if (!listeners) {
			listeners = events[type] = [];
			addListener(el, type, eventHandle);
		}
		
		if (once) {
			listeners.push({one: fn});
		} else if(live){
			listeners.push({handler: fn, live: live});
		} else{
			listeners.push(fn);
		}
		
		eventHandle.el = el;
		
		function evtHandle(e) {
			var evt = fixEvent(e || window.event),
				listeners  = zChain.data(this, 'events')[evt.type];
				
			for (var i=0,fn; fn=listeners[i++];) {
				if (typeof fn == 'function') {
					// 非IE浏览器加入对mouseenter，mouseleave的支持
					if (!zChain.ie && (type=='mouseenter' || type=='mouseleave')) {
						fun(evt);
					} else {
						fn.call(el, evt);
					}
				} else if (fn.one) {
					fn.one.call(el, evt);
					remove({
						el : el,
						type : type,
						fn : fn.one
					});
					i--;
				} else if(fn.live) {
					fn.handler.call(el, evt);
				}
			}
		}
		function fun(e) {
			if (!zChain.contains(e.currentTarget, e.relatedTarget) && e.currentTarget != e.relatedTarget) {
				fn.call(e.currentTarget,e);
			}
		}
		
	}
	function remove(opt) {
		var el = opt.el, fn = opt.fn, type = opt.type;
		
		var events = zChain.data(el, 'events');
		
		if (!el || !events) return;
		
		var listeners = events[type];
		
		// 删除所有类型
		if (!type) {
			for (var t in events) {
				_remove(el, t);
			}
			return;
		}
		if (fn) {
			_each(listeners, function(i, f) {
				if ( f==fn || f.one==fn || f.live==fn ) {
					return listeners.splice( i, 1 );
				}
			});
			if (listeners.length == 0) {
				_remove(el,type);
			}
		} else {
			_remove( el, type );
		}
	
	}
	
	return {
		add: add,
		remove: remove,
		dispatch: dispatch
	};
}();

zChain.extend({
	ajax : ajax,
	event : event
});

zChain.each('click,dblclick,mouseover,mouseout,mouseenter,mouseleave,mousedown,mouseup,keydown,keyup,keypress,focus,blur'.split(','), function(name, i){
	zChain.fn[name] = function(fn, once){
		if(arguments.length == 0){
			this.fire(name);
		}else{
			this.on(name, fn, once);
		}
		return this;
	};
});

// Expose $ to the global object or as AMD module
if(typeof define === 'function' && define.amd && define.amd) {
	define('zchain', [], function() { return zChain; });
} else {
	window.zChain = window.$ = zChain;
}

})(this);
