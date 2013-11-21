/**
 * $(selector).center(conf)
 * 
 * conf: {
 * 	 position: 'absolute' 随页面滚动条拖动而发生位置改变
 *   position: 'fixed' 不随页面滚动条拖动而发生位置改变
 * }
 * 
 */
(function(global) {
	
	var $ = global.jQuery
	
	if (!$) return
	
	var	$win = $(window),
		doc = global.document,
		docEl = doc.documentElement
	
	function viewSize() {
		return {
			w: $win.width(),
			h: $win.height()
		}
	}
	
	function fixedie6(el) {
		el.style.position = 'absolute'
		$win.bind('scroll', function() {
			$(el).center()
		})
	}
	
	$.fn.center = function(conf) {
		conf || (conf = {})
		var position = conf.position || 'absolute', zIndex = conf.zIndex || 9999
		this.css({
			display: 'block',
			position: position,
			zIndex: zIndex
		})
		
		var el = this[0], ie6 = /msie 6/i.test(navigator.userAgent)
		
		// ie6 don't support position 'fixed'
		if (position === 'fixed' && ie6) {
			fixedie6(el)
		}
		
		var x, y, size
		size = viewSize()
		x = (size.w)/2 - (el.clientWidth)/2 
		y = (size.h)/2 - (el.clientHeight)/2 + docEl.scrollTop
		this.css({
			left: x,
			top: y
		})
	}
	
})(this)
