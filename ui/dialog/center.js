/**
 * center(selector, conf) 
 * 
 * selector: elelemt or css selector
 * conf: {
 * 	 position: 'absolute' 随页面滚动条拖动而发生位置改变
 * 	 position: 'fixed' 不随页面滚动条拖动而发生位置改变
 * }
 * 
 */

(function($) {
	var exports = this,
		$ = this.jQuery,
		doc = this.document,
		body = doc.body,
		docEl = doc.documentElement
	
	var px = 'px', ie6 = /msie 6/i.test(navigator.userAgent)
	
	function viewSize() {
		return {
			w: exports['innerWidth'] || docEl.clientWidth,
			h: exports['innerHeight'] || docEl.clientHeight
		}
	}

	function setPos(el, x, y) {
		el.style.left = x + px
		el.style.top = y + px
	}
	
	function fixedie6(el) {
		el.style.position = 'absolute'
		exports.attachEvent('onscroll', function() {
			center(el)
		})
	}
	
	function center(selector, conf) {
		conf || (conf = {})
		var position = conf.position || 'absolute'
		// jQuery或简易$
		$ || (
		$ = function(s) {
			return doc.getElementById(s)
		})
		
		var el = typeof selector === 'string' ? $(selector) : selector
		el.style.position = position
		el.style.display = 'block'
		
		// ie6 don't support position 'fixed'
		if (position === 'fixed' && ie6) {
			fixedie6(el)
		}
		
		var x, y, size, scrollTop
		size = viewSize()
        // Chrome / Safari 在两种文档模式下均使用 document.body.scrollTop获取
        scrollTop = docEl.scrollTop || document.body.scrollTop
		x = (size.w)/2 - (el.clientWidth)/2
		y = (size.h)/2 - (el.clientHeight)/2 + scrollTop
		setPos(el, x, y)
	}
	
	
	exports.center = center
	
	
}).call(this)
