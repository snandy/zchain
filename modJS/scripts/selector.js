/**
 * css选择器，根据2\8原则，这里只实现最常用的三种
 * 注：当结果集只有一个元素时将直接返回该元素
 *
 * @param {Object} selector
 * @param {Object} context
 *
 * 1, 通过className获取
 * ('.cls')
 * ('.cls', el)
 * ('.cls', 'id')
 * ('span.cls')
 * ('span.cls', el)
 * ('span.cls', 'id')
 *
 * 2, 通过tagName获取
 * ('span')
 * ('span', el)
 * ('span', 'id')
 *
 * 3, 通过attribute获取
 * ('[name]')
 * ('[name]', el)
 * ('[name]', 'id')
 * ('[name=uname]')
 * ('[name=uname]', el)
 * ('[name=uname]', 'id')
 * ('input[name=uname]')
 * ('input[name=uname]', el)
 * ('input[name=uname]', 'id')
 */
define(function() {

	// TODO: Integarate the third-party selector (Sizzle.js, http://sizzlejs.com/)

	var undefined,
		doc = window.document,
		RegExp = window.RegExp;

	function query(selector, context) {
		var regCls = /^([-\w]+)?\.([-\w]+)/,
			regTag = /^([\w\*]+)$/,
			regNodeAttr = /^([-\w]+)?\[([\w]+)(=(\w+))?\]/,
			context = context === undefined ? doc : 
				typeof context === 'string' ? doc.getElementById(context) : context;

		if(context.querySelectorAll) {
			if(context.nodeType == 1) {
				var old = context.id, id = context.id = '__$$__';
				try {
					return context.querySelectorAll( '#' + id + ' ' + selector );
				} catch(e){
				} finally {
					old ? context.id = old : context.removeAttribute( 'id' );
				}
			}
			return context.querySelectorAll(selector);
		}
		
		if (regCls.test(selector)) {
			var ary = selector.split('.'),
				tag = ary[0],
				cls = ary[1],
				len, all, els = [];
			if (context.getElementsByClassName) {
				var res = context.getElementsByClassName(cls);
				if (tag) {
					for (var i = 0, len = res.length; i < len; i++) {
						res[i].tagName.toLowerCase() == tag && els.push(res[i]);
					}
				}
				return res;
			} else {
				all = context.getElementsByTagName(tag || '*');
				return filter(all, 'className', cls);
			}
		}

		if (regTag.test(selector)) {
			return context.getElementsByTagName(selector);
		}
		
		if (regNodeAttr.test(selector)) {
			var ary = regNodeAttr.exec(selector),
				all = context.getElementsByTagName(ary[1] || '*');
			return filter(all, ary[2], ary[4]);
		}

	};
	
	function filter(all, attr, val) {
		var i = -1, el, r = -1, res = [], reg = new RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)');
		while ((el = all[++i])) {
			if (test(el)) { res[++r] = el; }
		}
		return res;
	}
	
	function test(node) {
		var v = attr == 'className' ? node.className : node.getAttribute(attr);
		if (v) {
			if (val) {
				if (reg.test(v)) return true;
			} else {
				return true;
			}
		}
		return false;
	}
	
	// public api & alias
	query.$ = function(id) {return typeof id == 'string' ? doc.getElementById(id) : id;};
	query.$$ = query;
	query.get = function(selector, context) {
		return query(selector, context)[0] || null;
	};
	
	return query;
});
