/**
 * $ 获取元素, 在DOM中使用频繁的
 * 
 * @param {Object} selector
 * @param {Object} context
 * 
 * 1, 通过id获取,该元素是唯一的
 *	   $('#id')
 * 
 * 2, 通过className获取
 *	$('.cls') 获取文档中所有className为cls的元素
 *	$('.cls', el)
 *	$('.cls', '#id')
 *	$('span.cls') 获取文档中所有className为cls的span元素
 *	$('span.cls', el) 获取指定元素中className为cls的元素, el为HTMLElement (不推荐)
 *	$('span.cls', '#id') 获取指定id的元素中className为cls的元素
 *	
 * 3, 通过tagName获取
 *	$('span') 获取文档中所有的span元素
 *	$('span', el) 获取指定元素中的span元素, el为HTMLElement (不推荐)
 *	$('span', '#id') 获取指定id的元素中的span元素
 * 
 * 4, 通过attribute获取
 *	$('[name]') 获取文档中具有属性name的元素
 *	$('[name]', el)
 *	$('[name]', '#id')
 *	$('[name=uname]') 获取文档中所有属性name=uname的元素
 *	$('[name=uname]', el)
 *	$('[name=uname]', '#id')
 *	$('input[name=uname]') 获取文档中所有属性name=uname的input元素
 *	$('input[name=uname]', el)
 *	$('input[name=uname]', '#id')
 */
define(function() {
	
	function test(node) {
		var v = attr == 'className' ? node.className : node.getAttribute(attr);
		if(v) {
			if(val) {
				if(reg.test(v)) return true;
			}else {
				return true;
			}
		}
		return false;
	}
	
	function filter(all, attr, val) {
		var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)');
		var i = -1, el, r = -1, res = [];
		while( (el = all[++i]) ) {
			if(test(el)) {
				res[++r] = el;
			}
		}
		return res;
	}
	
	return function (selector,context) {
		var s = selector,
			doc = document,
			regId = /^#[\w\-]+/,
			regCls = /^([\w\-]+)?\.([\w\-]+)/,
			regTag = /^([\w\*]+)$/,
			regNodeAttr = /^([\w\-]+)?\[([\w]+)(=(\w+))?\]/;
		
		var context = 
				context == undefined ?
				document :
				typeof context == 'string' ?
				doc.getElementById(context.substr(1,context.length)) :
				context;
				
		if(regId.test(s)) {
			return doc.getElementById(s.substr(1,s.length));
		}
		
		if(context.querySelectorAll) {
			if(context.nodeType == 1) {
				var old = context.id, id = context.id = '__$$__';
				try {
					return context.querySelectorAll( '#' + id + ' ' + s );
				} catch(e){
				} finally {
					old ? context.id = old : context.removeAttribute( 'id' );
				}
			}
			return context.querySelectorAll(s);
		}
		
		if(regCls.test(s)) {
			var ary = s.split('.'),
				tag = ary[0],
				cls = ary[1],
				len,
				all,
				els = [];
				if(context.getElementsByClassName) {
					var res = context.getElementsByClassName(cls);
					if(tag) {
						for(var i=0,len=res.length; i<len; i++) {
							res[i].tagName.toLowerCase()==tag && els.push(res[i]);
						}
						return els;
					}else{
						return res;
					}
				}else {
					all = context.getElementsByTagName(tag || '*');
					return filter(all, 'className', cls);	
				}
				
		}
		
		if(regTag.test(s)) {
			return context.getElementsByTagName(s);
		}
		
		if(regNodeAttr.test(s)) {
			var ary = regNodeAttr.exec(s), all = context.getElementsByTagName(ary[1] || '*');
			return filter(all, ary[2], ary[4]);	
		}
		
	}
});
