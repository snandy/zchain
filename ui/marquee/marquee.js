/*
 *  marquee
 */

$.fn.marquee = function(option, callback) {
    if (typeof option == 'function') {
        callback = option
        option = {}
    }
    var s = $.extend({
        deriction: 'up',
        speed: 10,
        auto: false,
        width: null,
        height: null,
        step: 1,
        control: false,
        _front: null,
        _back: null,
        _stop: null,
        _continue: null,
        wrapstyle: '',
        stay: 5000,
        delay: 20,
        dom: 'ul>li'.split('>'),
        tag: false,
        convert: false,
        btn: null,
        disabled: 'disabled',
        pos: {
            object: null,
            clone: null
        }
    }, option || {})

    // some alias
    var deriction = s.deriction

    // DOM
    var clone     = null
    var $elem     = this.find(s.dom[0])
    var $subElem  = this.find(s.dom[1])
    var $front    = $(s._front)
    var $back     = $(s._back)
    var $stop     = $(s._stop)
    var $continue = $(s._continue)

    // some timer
    var mainTimer, subTimer

    if (deriction == 'up' || deriction == 'down') {
        var height = $elem.eq(0).outerHeight()
        var step = s.step * $subElem.eq(0).outerHeight()
        $elem.css({
            width: s.width + 'px',
            overflow: 'hidden'
        })
    }
    if (deriction == 'left' || deriction == 'right') {
        var width = $subElem.length * $subElem.eq(0).outerWidth()
        $elem.css({
            width: width + 'px',
            overflow: 'hidden'
        })
        var step = s.step * $subElem.eq(0).outerWidth()
    }
    var init = function() {
        var wrap = '<div style="position:relative;overflow:hidden;z-index:1;width:' + s.width + 'px;height:' + s.height + 'px;' + s.wrapstyle + '"></div>'
        $elem.css({
            position: 'absolute',
            left: 0,
            top: 0
        }).wrap(wrap)
        s.pos.object = 0
        clone = $elem.clone()
        $elem.after(clone)
        switch (deriction) {
            case 'up':
                $elem.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                clone.css({
                    marginLeft: 0,
                    marginTop: height + 'px'
                });
                s.pos.clone = height;
                break;
            case 'down':
                $elem.css({
                    marginLeft: 0,
                    marginTop: 0
                });
                clone.css({
                    marginLeft: 0,
                    marginTop: -height + 'px'
                });
                s.pos.clone = -height;
                break;
            case 'left':
                $elem.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                clone.css({
                    marginTop: 0,
                    marginLeft: width + 'px'
                });
                s.pos.clone = width;
                break;
            case 'right':
                $elem.css({
                    marginTop: 0,
                    marginLeft: 0
                });
                clone.css({
                    marginTop: 0,
                    marginLeft: -width + 'px'
                });
                s.pos.clone = -width;
                break;
        }
        if (s.auto) {
            initMainTimer()
            $elem.hover(function() {
                clear(mainTimer)
            }, function() {
                initMainTimer()
            })
            clone.hover(function() {
                clear(mainTimer)
            }, function() {
                initMainTimer()
            })
        };
        if (callback) {
            callback()
        };
        if (s.control) {
            initControls()
        }
    };
    var initMainTimer = function(delay) {
        clear(mainTimer)
        s.stay = delay ? delay : s.stay
        mainTimer = setInterval(function() {
            initSubTimer()
        }, s.stay)
    }
    var initSubTimer = function() {
        clear(subTimer)
        subTimer = setInterval(function() {
            roll()
        }, s.delay)
    }
    var clear = function(timer) {
        if (timer != null) {
            clearInterval(timer)
        }
    }
    var disControl = function(A) {
        if (A) {
            $front.unbind('click')
            $back.unbind('click')
            $stop.unbind('click')
            $continue.unbind('click')
        } else {
            initControls()
        }
    };
    var initControls = function() {
        $front.click(function() {
            $front.addClass(s.disabled);
            disControl(true);
            clear(mainTimer);
            s.convert = true;
            s.btn = 'front';
            initSubTimer();
            if (!s.auto) {
                s.tag = true
            }
            convert()
        })
        $back.click(function() {
            $back.addClass(s.disabled);
            disControl(true);
            clear(mainTimer);
            s.convert = true;
            s.btn = 'back';
            initSubTimer();
            if (!s.auto) {
                s.tag = true
            }
            convert()
        })
        $stop.click(function() {
            clear(mainTimer)
        })
        $continue.click(function() {
            initMainTimer()
        })
    }
    var convert = function() {
        if (s.tag && s.convert) {
            s.convert = false;
            if (s.btn == 'front') {
                if (deriction == 'down') {
                    deriction = 'up'
                };
                if (deriction == 'right') {
                    deriction = 'left'
                }
            };
            if (s.btn == 'back') {
                if (deriction == 'up') {
                    deriction = 'down'
                };
                if (deriction == 'left') {
                    deriction = 'right'
                }
            };
            if (s.auto) {
                initMainTimer()
            } else {
                initMainTimer(4 * s.delay)
            }
        }
    }
    var setPos = function(y1, y2, x) {
        if (x) {
            clear(subTimer);
            s.pos.object = y1;
            s.pos.clone = y2;
            s.tag = true
        } else {
            s.tag = false
        }
        if (s.tag) {
            if (s.convert) {
                convert()
            } else {
                if (!s.auto) {
                    clear(mainTimer)
                }
            }
        }
        if (deriction == 'up' || deriction == 'down') {
            $elem.css({
                marginTop: y1 + 'px'
            });
            clone.css({
                marginTop: y2 + 'px'
            })
        }
        if (deriction == 'left' || deriction == 'right') {
            $elem.css({
                marginLeft: y1 + 'px'
            });
            clone.css({
                marginLeft: y2 + 'px'
            })
        }
    }
    var roll = function() {
        var ul = $elem[0]
        var cl = clone[0]
        var y_object = (deriction == 'up' || deriction == 'down') ? parseInt(ul.style.marginTop) : parseInt(ul.style.marginLeft)
        var y_clone = (deriction == 'up' || deriction == 'down') ? parseInt(cl.style.marginTop) : parseInt(cl.style.marginLeft)
        var y_add = Math.max(Math.abs(y_object - s.pos.object), Math.abs(y_clone - s.pos.clone))
        var y_ceil = Math.ceil((step - y_add) / s.speed)
        switch (deriction) {
            case 'up':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $front.removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -height) {
                        y_object = y_clone + height;
                        s.pos.object = y_object
                    }
                    if (y_clone <= -height) {
                        y_clone = y_object + height;
                        s.pos.clone = y_clone
                    }
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case 'down':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $back.removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object >= height) {
                        y_object = y_clone - height;
                        s.pos.object = y_object
                    }
                    if (y_clone >= height) {
                        y_clone = y_object - height;
                        s.pos.clone = y_clone
                    }
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break;
            case 'left':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $front.removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object <= -width) {
                        y_object = y_clone + width;
                        s.pos.object = y_object
                    }
                    if (y_clone <= -width) {
                        y_clone = y_object + width;
                        s.pos.clone = y_clone
                    }
                    setPos((y_object - y_ceil), (y_clone - y_ceil))
                };
                break;
            case 'right':
                if (y_add == step) {
                    setPos(y_object, y_clone, true);
                    $back.removeClass(s.disabled);
                    disControl(false)
                } else {
                    if (y_object >= width) {
                        y_object = y_clone - width;
                        s.pos.object = y_object
                    }
                    if (y_clone >= width) {
                        y_clone = y_object - width;
                        s.pos.clone = y_clone
                    }
                    setPos((y_object + y_ceil), (y_clone + y_ceil))
                };
                break
        }
    }
    if (deriction == 'up' || deriction == 'down') {
        if (height >= s.height && height >= s.step) {
            init()
        }
    }
    if (deriction == 'left' || deriction == 'right') {
        if (width >= s.width && width >= s.step) {
            init()
        }
    }
}
