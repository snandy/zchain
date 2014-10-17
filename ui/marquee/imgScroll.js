/**
 * 图片滚动插件
 * 
 */
$.fn.imgScroll = function(options, callback) {
    // 默认参数
    var defaults = {
        // 可见图片个数
        visible: 1,
        // 按钮-下一张，默认为元素选择器字符串，也可以是jQuery对象
        next: '#next',
        // 按钮-上一张，默认为元素选择器字符串，也可以是jQuery对象
        prev: '#prev',
        // 滚动速度
        speed: 300,
        // 每次滚动图片个数
        step: 1,
        // 是否自动播放
        autoPlay: false,
        // 自动播放时间
        autoPlayTime: 5000,
        // 无法(不足以)滚动时是否显示控制按钮
        showControl: false,
        // 每个滚动元素宽度，默认取li的outerWidth
        width: null,
        // 每个滚动元素宽度，默认取li的outerHeight
        height: null,
        // 是否显示滚动当前状态(1,2,3,4,...)
        navItems: false,
        // 包围元素的class，默认为'scroll-nav-wrap'
        navItmesWrapClass: 'scroll-nav-wrap',
        // 当前项目高亮class
        navItemActivedClass: 'cur',
        // nav是否可点击
        navCanClick: false,

        end: function() {}
    };

    // 继承 初始化参数 - 替代默认参数
    var settings = $.extend(defaults, options)

    function init($that) {
        var $ul = $that.find('ul').eq(0),
            nextFrame, $lis = $ul.children('li'),
            len = $lis.length,
            liWidth = null,
            liHeight = null,

            $btnNext = typeof settings.next == 'string' ? $(settings.next) : settings.next,
            $btnPrev = typeof settings.prev == 'string' ? $(settings.prev) : settings.prev,

            current = 0,
            step = settings.step,
            visible = settings.visible,
            total = Math.ceil((len - visible) / step) + 1,

            nav = settings.navItems,
            navWrap = settings.navItmesWrapClass,
            $navWrap = $('.' + navWrap),
            navHasWrap = $navWrap.length > 0,
            navClass = settings.navItemActivedClass,
            navCanClick = settings.navCanClick,

            last = false,
            first = true,

            intervalTimer = null

        /*
         * 重置下样式
         */
        function resetStyles() {
            var $firstLi = $lis.first()
            // 重置每个滚动列表项样式
            if ($firstLi.css('float') !== 'left') {
                $lis.css('float', 'left')
            }

            // 重新设置滚动列表项高宽
            var outerWidth = $firstLi.outerWidth(true)
            var outerHeight = $firstLi.outerHeight()
            liWidth = settings.width || outerWidth
            liHeight = settings.height || outerHeight

            // 重置最外层可视区域元素样式
            var position = $that.css('position')
            $that.css({
                'position': position == 'static' ? 'relative' : position,
                'width': liWidth * visible - outerWidth + $firstLi.outerWidth(false),
                'height': liHeight,
                'overflow': 'hidden'
            })

            // 重置滚动内容区元素样式
            $ul.css({
                'position': 'absolute',
                'width': liWidth * len,
                'height': liHeight,
                'top': 0,
                'left': 0
            })
        }

        /*
         * 重新初始化参数
         */
        function reInitSettings() {
            len = settings.data.length
            $lis = $ul.children('li')
            total = Math.ceil((len - visible) / step) + 1
        }

        /*
         * isPrev 是否向前滚动
         */
        function switchTo(isPrev) {
            // 是否正在动画中
            if ($ul.is(':animated')) return false

            if (first && isPrev) {
                current = total-1
            }
            if (last && !isPrev) {
                current = 0;
            }

            // 滚动下一帧位移量
            nextFrame = {
                // left: current >= (total - 1) ? -(len - visible) * liWidth : -current * step * liWidth
                left: -current * step * liWidth
            }

            // 滚动完成一帧回调
            function onEnd() {
                if (len - current * step <= visible) {
                    last = true
                } else {
                    last = false
                }

                if (current <= 0) {
                    first = true
                } else {
                    first = false
                }

                // 显示导航数字
                if (nav) {
                    setCurrent(current)
                }

                // 每次可视区li的总集合
                var allLi = $lis.slice(current * step, current * step + visible)
                // 每次滚动到可视区li的集合
                var viewLi = $lis.slice(current * step + visible - step, current * step + visible)
                // 每次滚动后回调参数
                if (typeof callback == 'function') {
                    /*
                     * current 当前滚动到第几页
                     * total 一共有多少页
                     * 可视区域内的滚动li jQuery对象集合
                     */
                    callback.apply($that, [current, total, allLi, viewLi])
                }
            }

            // 是否动画滚动
            if(!!settings.speed) {
                $ul.animate(nextFrame, settings.speed, onEnd)
            } else {
                $ul.css(nextFrame)
                onEnd()
            }
        }

        /*
         * 显示数字分页1,2,3,4,5,6...
         * nav 数字导航外层div的class
         * 数字导航当前页高亮class
         */
        function addNavItem(navWrap, actived) {
            var navPage = navHasWrap ? $navWrap : $('<div class="' + navWrap + '"></div>')
            for (var i = 0; i < total; i++) {
                var page = i+1
                var $li = $('<li>').attr('title', page)
                if (i === 0) {
                    $li.addClass(actived)
                }
                navPage.append($li)
            }
            if(!navHasWrap) {
                $that.after(navPage)
            }
        }

        // 设置当前状态的数字导航与分页
        function setCurrent(i) {
            if (nav) {
                $navWrap.find('li').removeClass(navClass).eq(i).addClass(navClass)
            }
        }

        function play() {
            intervalTimer = setInterval(function() {
                current++
                switchTo(false)
            }, settings.autoPlayTime)
        }

        function stop() {
            clearInterval(intervalTimer)
        }

        function bindEvent() {
            $btnPrev.unbind('click').bind('click', function() {
                current--
                switchTo(true)
            })
            $btnNext.unbind('click').bind('click', function() {
                current++
                switchTo(false)
            })
            if (settings.autoPlay) {
                $btnPrev.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                });
                $btnNext.mouseover(function() {
                    stop() 
                }).mouseout(function() {
                    play()
                });
                $ul.find('li').mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })        
                play()
            }
            if (nav && navCanClick) {
                $navWrap.delegate('li', 'click', function() {
                    var idx = $(this).attr('title') - 1
                    var isPrev = idx < current ? true : false
                    current = idx   
                    switchTo(isPrev)
                }).mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                })
            }            
        }

        // 初始化滚动
        if (len > visible && visible >= step) {
            // 可以滚动
            resetStyles()
            bindEvent()
            if (nav) {
                addNavItem(navWrap, navClass)
            }
        } else {
            // 无法滚动
            if (settings.showControl) {
                $btnNext.add($btnPrev).show()
            } else {
                $btnNext.add($btnPrev).hide()
            }
        }
    }

    // 实例化每个滚动对象
    return this.each(function() {
        var $that = $(this)
        init($that)
    })
};