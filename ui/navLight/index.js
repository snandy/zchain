~function($) {

var $win = $(window)
var $doc = $(document)
var jph  = $.jph

/** 
 * 广告轮播图
 */
~function() {
    var city = $('.city h2').text()
    var isTaiyuan = city === '太原' ? true : false
    var adTag = isTaiyuan ? 'taiyuanmiaozhen' : 'miaozhen'
    // var adHeight = isTaiyuan ? 320 : 220

    pageConfig.TPL_MSlide = {
        itemsWrap: '<ul class="slide-items">{innerHTML}</ul>',
        itemsContent: '{for item in json}{var idx=item_index-0;idx++;}<li clstag="tuan|keycount|firstpage|' + adTag + '${idx}" style="{if parseInt(item_index)!=0}display:none;{/if}"><div class="bannerli-img"><a target="_blank" href="${item.href}"><img width="690" height="220" src="${item.src}"></a></div></li>{/for}',
        controlsWrap: '<div class="slide-controls">{innerHTML}</div>',
        controlsContent: '{for item in json}<span class="{if parseInt(item_index)==0}curr{/if}">${parseInt(item_index)+1}</span> {/for}'
    }    
    var currShadow = null
    var shadows = null

    $('#slide .sub1').Jslider({
         data: pageConfig.DATA_MSlide,
         auto: true,
         slideWidth: (screen.width>=1210) ? 670: 550,
         slideHeight: 220,
         maxAmount: 6,
         stay: 5000,
         slideDirection: 3,
         template:pageConfig.TPL_MSlide
    }, function(object){
         pageConfig.FN_ImgError(object.get(0))
         var $elem = $('#minbanerbg .opc-bg')
         $.each(pageConfig.DATA_MSlide, function(i, it) {
            $elem.append('<img width="1920" class="opc-img hide" src="' + it.src2 + '">')
         })
         shadows = $elem.find('.opc-img')
         currShadow = shadows.eq(0).removeClass('hide')

    }, function(i) {
         currShadow.addClass('hide')
         currShadow = shadows.eq(i).removeClass('hide')
    })

    // 滚动图
    $('.bascroll-list').imgScroll({
        visible: 3,
        step: 3,
        showNavItem: true,
        autoPlay: true,
        autoPlayTime: 5000,
        next: '.bascroll .right',
        prev: '.bascroll .left'
    }, function(index, tatol, all, view) {
        view.each(function() {
            var $self = $(this).find('img')
            $self.attr('src', $self.attr('data-lazyload'))
        })
    })

    // 修复ul的宽度，去掉头尾li的border宽度
    // width = li * num - (num-2)
    var $ul = $('.bascroll-list ul')
    var $li = $ul.find('li')
    var ulWidth = $ul.width()
    $ul.width(ulWidth + $li.length)

}()

/**
 * 初始化该页面交互
 */
var $content = $('.content')
var $rootmenu = $('.rootmenu')

/**
 * 各分类图片hover效果
 */
$content.addHover('li.fore1,li.fore2')
$content.addHover('li.fore3,li.fore4,li.fore5', 'current')


var $narrowMenu = $('.narrow-menu')
/**
 * 分类浮层 窄版
 */
// $narrowMenu.floatCate(function($cate) {
//     $cate.css('margin-top', 0)
// }, function($cate) {
//     $cate.css('margin-top', '20px')
// }, 'ie6_narrow_catefixed')

/**
 * 修复锚点点击后位置错误
 */
// $narrowMenu.delegate('li a', 'click', function() {
//     setTimeout(function() {
//         var top = $win.scrollTop()
//         $win.scrollTop(top-50)
//     }, 400)  
// })


/**
 *
 * 今日推荐 - 图片滚动
 */
var $mscroll = $('#mscroll-list')

// 滚动图
$mscroll.imgScroll({
    visible: 3,
    step: 3,
    showNavItem: true,
    autoPlay: true,
    autoPlayTime: 5000,
    next: '#mscroll-ctrl-next',
    prev: '#mscroll-ctrl-prev'
}, function(index, tatol, all, view) {
    view.each(function() {
        var $self = $(this).find('img')
        $self.attr('src', $self.attr('data-lazyload'))
    })
})


/**
 * 生活惠 - 二级侧滑菜单
 * 
 */
var $cate2014 = $rootmenu.find('.category-2014')
// 只有定位到非“全国”时才有侧滑菜单
var isQuanGuo = $('#showCity').text() === '全国'
if (!isQuanGuo) {
    $cate2014.find('li').hover(function() {
        $(this).addClass('hover')
    }, function() {
        $(this).removeClass('hover')
    }).delegate('.close', 'click', function() {
        $(this).closest('li').removeClass('hover')
    })
}


$('.rootmenu').topSuction({
    fixCls: 'dog-menu'
})
$('#minbanerbg').navLight({lightCls: 'cate-hover'})

}(jQuery)
