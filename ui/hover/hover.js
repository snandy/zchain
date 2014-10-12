/**
 *  放在项目共用js里，处理所有hover效果，鼠标置上时添加一个class，离开后移除class。
 *  设计为自执行是考虑项目中很多页面都有类似的功能，此时还有部分页面仅有这个hover效果功能，没有其它任何的js交互。
 *  此时如果为该页面写一个单独的js就不值当了，为此把配置从js文件放权到HTML文件里，通过data-widget属性去管理。
 *
 *  示例
 *  1. hover直接应用在li上，hover的class默认为"hover"
 *      <li data-widget="hover">
 *
 *  2. 应用在li上，hover的class改为curr
 *      <li data-widget="hover.curr"> 
 *
 *  3. 通过ul代理应用在li上，class为默认"hover"
 *      <ul data-widget="hover|li">
 *
 *  4. 通过ul代理应用在li上，class改为"curr"
 *      <ul data-widget="hover.curr|li">
 */
$('[data-widget^="hover"]').each(function() {
    var $elem = $(this)
    var widget = $elem.attr('data-widget')
    var arr = widget.split('|')
    var act = arr[0]
    var delegateSelector = arr[1]
    var isSingle = arr.length === 1
    var hoverClass = act === 'hover' ? act : act.split('.')[1]

    if (isSingle) {
        $elem.hover(function() {
            $elem.toggleClass(hoverClass)
        })
    } else {
        $elem.delegate(delegateSelector, 'hover', function() {
            $(this).toggleClass(hoverClass)
        })
    }
})