/*
 * 事件节流
 */
$.debounce = function(func, wait, immediate) {
    var timeout
    return function() {
        var context = this, args = arguments
        later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

/*
 * 事件节流
 */
$.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result
    var whenDone = $.debounce(function() {
        more = throttling = false
    }, wait)
    return function() {
        context = this, args = arguments
        var later = function() {
            timeout = null
            if (more) func.apply(context, args)
            whenDone()
        }
        if (!timeout) timeout = setTimeout(later, wait)
        
        if (throttling) {
            more = true
        } else {
            result = func.apply(context, args)
        }
        whenDone()
        throttling = true
        return result
    }
}

/*
 * 标题吸顶
 */
$.fn.topSuction = function(option) {
    option = option || {}
    var fixCls = option.fixCls || 'fixed'
    var fixedFunc = option.fixedFunc
    var resetFunc = option.resetFunc

    var $self = this
    var $win  = $(window)
    if (!$self.length) return

    var offset = $self.offset()
    var fTop   = offset.top
    var fLeft  = offset.left

    // 缓存下
    $self.data('def', offset)
    $win.resize(function() {
        $self.data('def', $self.offset())
    })

    $win.scroll(function() {
        var dTop = $(document).scrollTop()
        if (fTop < dTop) {
            $self.addClass(fixCls)
            if (fixedFunc) {
                fixedFunc.call($self, fTop)
            }
        } else {
            $self.removeClass(fixCls)
            if (resetFunc) {
                resetFunc.call($self, fTop)
            }
        }
    })
};

/*
 * 导航高亮组件
 * option
 *   nav 导航选择器
 *   content 内容模块选择器
 *   diffTop 距离顶部的误差值
 *   diffBottom 距离底部的误差值
 *   lightCls 高亮的class
 * 
 */
$.fn.navLight = function(option, callback) {
    option = option || {}
    var nav = option.nav || '[data-widget=nav]'
    var content = option.content || '[data-widget=content]'
    var diffTop = option.diffTop || 200
    var diffBottom = option.diffBottom || 500
    var lightCls = option.lightCls || 'curr'

    var $self = $(this)
    var $nav = $self.find(nav)
    var $content = $self.find(content)

    // 记录每个分类的位置
    var contentPosi = $content.map(function(idx, elem) {
        var $cont = $(elem)
        var top = $cont.offset().top
        var height = $cont.height()
        return {
            area: [top-diffTop, top+diffBottom],
            jq: $cont
        }
    })

    var $win = $(window)
    var $doc = $(document)
    var currentCate = null

    var handler = $.throttle(function(e) {
        var dTop = $doc.scrollTop()
        highLight(dTop)
    }, 100)
    
    function highLight(docTop) {
        contentPosi.each(function(idx, obj) {
            var area = obj.area
            if (area[0] < docTop && area[1] > docTop) {
                $nav.removeClass(lightCls)
                $nav.eq(idx).addClass(lightCls)
                if (callback) {
                    callback($nav, $content)
                }
            }
        })
    }

    $win.scroll(handler)
};