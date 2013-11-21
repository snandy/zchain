/**
 * $.mask({
 * 	 opacity: 
 * 	 bgColor:
 *   zIndex:
 * }) 
 * 
 */
(function(global) {
	
	var $ = global.jQuery
	
	if (!$) return
	
	var	$win = $(window),
		docEl = global.document.documentElement
		
	var mask = $('<div>')
	
	function viewSize() {
		return {
			w: $win.width(),
			h: $win.height()
		}
	}
	
	function fixedie6(el) {
		el.style.position = 'absolute'
		$win.bind('scroll', function() {
			$(el).css({
				top: docEl.scrollTop
			})
		})
	}
	
	var size = viewSize()
	
	mask.css({
		position: 'fixed',
		left: 0,
		top: 0,
		width: size.w,
		height: size.h
	})
	
	
	$.viewSize = viewSize
	$.mask = function(conf) {
		conf || (conf={})
		
		var opacity = conf.opactiy || 0.2,
			bgColor = conf.bgColor || 'gray',
			zIndex  = conf.zIndex || 100
		
		mask.css({
			opacity: opacity,
			background: bgColor,
			zIndex: zIndex
		})
		
		var ie6 = /msie 6/i.test(navigator.userAgent)
		if (ie6) {
			fixedie6(mask[0])
		}
		
		$(document.body).append(mask)
	}
	
})(this)
