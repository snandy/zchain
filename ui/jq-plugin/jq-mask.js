/**
 * $.mask({
 * 	 opacity: 
 * 	 bgColor:
 *   zIndex:
 * }) 
 * 
 */
(function(win) {
	
	var $ = win.jQuery
	
	if (!$) return
	
	var	$win = $(window)
	var docEl = win.document.documentElement
	var ie6 = /msie 6/i.test(navigator.userAgent)
	
	function viewSize() {
		return {
			w: $win.width(),
			h: $win.height()
		}
	}
	
	function fixedie6($el) {
        $el.css('position', 'absolute')
		$win.bind('scroll', function() {
			$el.css({
				top: docEl.scrollTop
			})
		})
	}
	
	$.mask = function(conf) {
		conf || (conf={})
		
        // some options
		var opacity = conf.opactiy || 0.2
		var bgColor = conf.bgColor || 'gray'
		var zIndex  = conf.zIndex  || 100

        // create DOM & add styles
        var $mask = $('<div>')
        var size = viewSize()
        $mask.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: size.w,
            height: size.h,
            opacity: opacity,
            background: bgColor,
            zIndex: zIndex
        })
		
		if (ie6) {
			fixedie6($mask)
		}
		
        // append to body
		$(document.body).append($mask)
	}
	
})(this)
