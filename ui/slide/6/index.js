~function($) {

/*
 * 轮播图
 */
pageConfig.TPL_MSlide = {
    itemsWrap: '<ul class="banner-items slide-items">{innerHTML}</ul>',
    itemsContent: '{for item in json}{var idx=item_index-0;idx++;}<li class="{if parseInt(item_index)!=0}hide{/if}"><a target="_blank" href="${item.href}"><img src="${item.src}"></a></li>{/for}',
    controlsWrap: '<div class="banner-controls slide-controls">{innerHTML}</div>',
    controlsContent: '{for item in json}<span class="{if parseInt(item_index)==0}curr{/if}"></span>{/for}'
}

$('.banner-focus').Jslider({
    data: pageConfig.DATA_MSlide,
    auto: true,
    slideWidth: (screen.width>=1210) ? 670 : 550,
    slideHeight: 240,
    maxAmount: 8,
    slideDirection: 3,
    template:pageConfig.TPL_MSlide
}, function(object){
    pageConfig.FN_ImgError(object.get(0))
    // CSS3动画
    setInterval(function() {
        var $curr = object.find('li:visible')
        if ($curr.hasClass('trans')) return 
        object.find('li').removeClass('trans')
        object.find('li:visible').addClass('trans')
    }, 500)

})

function imgLazyLoad($el) {
    $el.find('img').each(function() {
        var $img = $(this)
        $img.attr('src', $img.attr('data-lazyload'))
    })    
}




}(jQuery);