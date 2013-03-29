var Browser = function(ua) {
	var b = {
		ie: /msie/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua),
		maxthon: /maxthon/.test(ua),
		sogou: /se/.test(ua),
		tt: /TencentTraveler/.test(ua)
	};
	var mark = '';
	for (var i in b) {
		if (b[i]) { mark = "safari" == i ? "version" : i; break; }
	}
	b.version = mark && RegExp("(?:" + mark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";
	b.ie6 = b.msie && parseInt(b.version, 10) == 6;
	b.ie7 = b.msie && parseInt(b.version, 10) == 7;
	b.ie8 = b.msie && parseInt(b.version, 10) == 8;
	b.ie9 = b.msie && parseInt(b.version, 10) == 9;
	return b;
}(navigator.userAgent.toLowerCase());

var domUtil = function() {
	var util = {};
	function $(selector,context) {
		var s = selector, doc = document;
		var rId = /^#[\w\-]+/,
			rCls = /^([\w\-]+)?\.([\w\-]+)/,
			rTag = /^([\w\*]+)$/,
			rAttr = /^([\w]+)?\[([\w]+-?[\w]+?)(=(\w+))?\]/;
		var arr = [];
		
		var context = 
				context === undefined ?
				document :
				typeof context === 'string' ?
				doc.getElementById(context.substr(1, context.length)) :
				context;
				
		if (rId.test(s)) {
			arr[0] = doc.getElementById( s.substr(1, s.length) );
			return arr;
		}
		
		if (context.querySelectorAll) {
			if (context.nodeType === 1) {
				var old = context.id, id = context.id = '__$$__';
				try {
					return context.querySelectorAll( '#' + id + ' ' + s );
				} catch(e){
				} finally {
					old ? context.id = old : context.removeAttribute('id');
				}
			}
			return context.querySelectorAll(s);
		}
		
		if (rCls.test(s)) {
			var ary = s.split('.'),	
				tag = ary[0], 
				cls = ary[1],
				i, len, all, els;
			if (context.getElementsByClassName) {
				els = context.getElementsByClassName(cls);
				if (tag) {
					for (i=0, len = els.length; i < len; i++) {
						els[i].tagName.toLowerCase()===tag && arr.push(els[i]);
					}
					return arr;
				} else {
					return els;
				}
			} else {
				all = context.getElementsByTagName(tag || '*');
				return filter(all, 'className', cls);
			}
		}
		
		if (rTag.test(s)) {
			return context.getElementsByTagName(s);
		}
		
		if (rAttr.test(s)) {
			var ary = rAttr.exec(s), all = context.getElementsByTagName(ary[1] || '*');
			return filter(all, ary[2], ary[4]);
		}
	
		function test(attr, val, node) {
			var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)'),
				v = attr === 'className' ? node.className : node.getAttribute(attr);
			if (v) {
				if (val) {
					if (reg.test(v)) return true;
				} else {
					return true;
				}
			}
			return false;
		}
		function filter(all, attr, val) {
			var el,
				i = 0,
				r = 0,
				res = [];
			while ( (el = all[i++]) ) {
				if ( test(attr, val, el) ) {
					res[r++] = el;
				}
			}
			return res;
		}
	}
	
	util.$ = $;
	
	return util;
}();

var editor = {};

editor.getWindow = function(id) {
	if (this.win) {
		return this.win;
	} else {
		var ifr = domUtil.$('#' + id)[0];
		return this.win = ifr.contentWindow;
	}
}
editor.init = function() {
	editor.getWindow('editorifr')
	editor.getRange()
};
/**
 * 获取Range 
 */
editor.getRange = function() {
	var range;
	this.getWindow();
	if (Browser.ie) {
		this.selection = this.win.document.selection;
		range = this.selection.createRange();
	} else {
		this.selection = this.win.getSelection();
		range = this.win.document;
	}
	return range;
};

/**
 * 获取选定的文本 
 */
editor.getSelectedText = function() {
	var txt = '', range;
	try {
		if (Browser.ie) {
			range = this.win.document.selection.createRange();
			txt = range.text;
		} else {
			txt = this.win.getSelection().toString();
		}
	} catch(e){}

	return txt;
}
