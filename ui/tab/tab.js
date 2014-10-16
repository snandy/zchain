/**
 * 页签组件 
 * $().tab({
 *   type:           // 默认静态，结构打在页面上
 *   autoPlay:       // 是否自动切换，默认false
 *   eventType:      // 默认mouseover，鼠标移动到上面时切换，可选click
 *   currClass:      // 默认curr
 *   source:         // 
 *   hookKey:        // tab的css属性选择器的key，默认为 data-widget
 *   hookItemVal:    // tab的css属性选择器的key，默认为 tab-item
 *   hookContentVal: // tab content的css属性选择器的key，默认为 tab-content
 *   stay:           // 自动切换的时间间隔
 *   delay:          // 切换时延迟的时间
 *   index:          // 指定当前的tab, autoPlay必须为true
 * })
 *
 */
$.fn.tab = function(option, callback) {
    if (!this.length) return

    if (typeof option === 'function') {
        callback = option
        option = {}
    }

    var settings = $.extend({
        type: 'static',
        autoPlay: false,
        eventType: 'mouseover',
        currClass: 'curr',
        source: 'data-tag',
        hookKey:'data-widget',
        hookItemVal: 'tab-item',
        hookContentVal: 'tab-content',
        stay: 5000,
        delay: 100,
        index: 0
    }, option || {})

    // some alias
    var hookKey = settings.hookKey
    var autoPlay = settings.autoPlay
    var currClass = settings.currClass
    var settingsSource = settings.source

    // some timer
    var mainTimer, subTimer

    // DOM elements
    var items = this.find('['+hookKey+'='+settings.hookItemVal+']')
    var contents = this.find('['+hookKey+'='+settings.hookContentVal+']')
    var isUrl = settingsSource.toLowerCase().match(/http:\/\/|\d|\.aspx|\.ascx|\.asp|\.php|\.html\.htm|.shtml|.js/g)

    // tab 与 tab content 长度不一致时 直接返回
    if (items.length != contents.length) return false

    // 初始化
    var init = function(index, tag) {
        subTimer = setTimeout(function() {
            var i = settings.index
            items.eq(i).removeClass(currClass);
            contents.eq(i).hide()
            if (tag) {
                settings.index++
                if (settings.index == items.length) {
                    settings.index = 0
                }
            } else {
                settings.index = index
            }
            settings.type = (items.eq(settings.index).attr(settingsSource) != null) ? 'dynamic' : 'static'
            rander()
        }, settings.delay)
    }

    // 自动切换
    var autoRun = function() {
        mainTimer = setInterval(function() {
            init(settings.index, true)
        }, settings.stay)
    }

    // 渲染每一帧
    var rander = function() {
        var i = settings.index
        var item = items.eq(i)
        var content = contents.eq(i)

        item.addClass(currClass)
        content.show()

        switch (settings.type) {
            default:
            case 'static':
                var source = ''
                break;
            case 'dynamic':
                var source = (!isUrl) ? item.attr(settingsSource) : settingsSource
                item.removeAttr(settingsSource)
                break;
        }
        if (callback) {
            callback(source, content, i)
        }
    }

    items.each(function(i) {
        $(this).bind(settings.eventType, function() {
            clearTimeout(subTimer)
            clearInterval(mainTimer)
            init(i, false)
        }).bind('mouseleave', function() {
            if (autoPlay) {
                autoRun()
            }
        })
    })

    if (settings.type == 'dynamic') {
        init(settings.index, false)
    }

    // 自动播放
    if (autoPlay) {
        autoRun()
    }
}