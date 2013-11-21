/**
 * $(selector).floatFixed(fixedFunc, resetFunc, cls)
 * 
 * fixedFunc 固定后的回调
 * resetFunc 恢复初始状态的回调
 * cls       className 一般为position:fixed,top:0
 */
$.fn.floatFixed = function(fixedFunc, resetFunc, cls) {
    var $self = $(this)
    if (!$self.length) return

    var $win = $(window)
    var $doc = $(document)
    var fixedCls = cls
    var fTop = $self.offset().top
    $win.scroll(function() {
        var dTop = $doc.scrollTop()
        if (fTop < dTop) {
            if (fixedCls) {
                $self.addClass(fixedCls)    
            } else {
                $self.css({
                    position: 'fixed',
                    top: '0'
                })
            }
            // 固定后的回调
            if (fixedFunc) {
                fixedFunc($self)
            }
        } else {
            if (fixedCls) {
                $self.removeClass(cls)
            } else {
                $self.css({
                    position: 'static'
                })                
            }
            // 恢复正常布局后的回调
            if (resetFunc) {
                resetFunc($self)
            }
        }
    })
}