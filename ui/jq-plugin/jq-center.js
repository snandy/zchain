/**
 * $(selector).center(conf)
 * 
 * conf: {
 *        
 * }
 * 
 */
(function(win) {
	
	var $ = win.jQuery
	
	if (!$) return
	
	var	$win = $(win)
	var doc = win.document
	var docEl = doc.documentElement
	var ie6 = /msie 6/i.test(navigator.userAgent)

	function viewSize() {
		return {
			w: $win.width(),
			h: $win.height()
		}
	}
	
	function fixedie6($el, y) {
        $el.css({
            position: 'absolute',
            top: y + docEl.scrollTop
        })
		$win.bind('scroll', function() {
            $el.css('top', y + docEl.scrollTop)
		})
	}
	
	$.fn.center = function(conf) {
		conf || (conf = {})
        var el = this[0]
        var zIndex = conf.zIndex || 9999
		var position = conf.position || 'absolute'
        var size = size = viewSize()
		
		var x = (size.w)/2 - (el.clientWidth)/2 
		var y = (size.h)/2 - (el.clientHeight)/2
		this.css({
            display: 'block',
            position: 'fixed',
            zIndex: zIndex,            
			left: x,
			top: y
		})

        // ie6 don't support position 'fixed'
        if (ie6) {
            fixedie6(this, y)
        }
	}
	
})(this)
