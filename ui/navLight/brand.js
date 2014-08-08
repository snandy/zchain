~function($) {

var $win = $(window)
var $doc = $(document)
var $content = $('.content-wrap')
var jph = $.jph


/**
 * 点击分类浮层后锚点滚动，然后向下滚动20px左右
 */

$content.find('ul.b1').delegate('a', 'click', function() {
    setTimeout(function() {
        var top = $win.scrollTop()
        $win.scrollTop(top-50)
    }, 400)
})

/**
 *
 * 开团提醒 - 图片滚动
 */
var $mscroll = $('#mscroll-list')
$mscroll.imgScroll({
    visible: 3,
    step: 3,
    showNavItem: true,
    autoPlay: true,
    autoPlayTime: 5000,
    next: '#mscroll-ctrl-next',
    prev: '#mscroll-ctrl-prev',
}, function(index, tatol, all, view) {
    view.each(function() {
        var $self = $(this).find('img')
        $self.attr('src', $self.attr('data-lazyload'))
    })
})
if (jph.browser.ie6 || jph.browser.ie7) {
    var $ctrlNext = $('#mscroll').find('#mscroll-ctrl-next')
    if ($ctrlNext.css('display') != 'none') {
        $mscroll.css({
            'top': '27px'
        })
    }
}

// 分类浮层
$content.find('.category').topSuction({fixCls: 'catefixed'})
$content.navLight({lightCls: 'cate-hover'})


/**
 * 即将开团
 */
$mscroll.shopingRemind()


}(jQuery)