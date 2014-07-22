
/**
 * 转盘控制器类
 */
var LuckyRoller = function() {

//添加命名空间
function addNamespace(doc, prefix, urn) {
    if (!doc.namespaces[prefix]) {
        //第三个参数是定义该命名空间下所有元素的默认行为为VML
        doc.namespaces.add(prefix, urn, '#default#VML')
    }
}
//添加VML所需的命名空间
function addNamespaces(doc) {
    addNamespace(doc, 'jd_vml_', 'urn:schemas-microsoft-com:vml')
}

//只有在浏览器不支持canvas时才执行此段代码
if (!document.createElement('canvas').getContext) {
    addNamespaces(document)
    document.createElement('canvas') //创建一个canvas元素使IE对其认可
    var supportVML = true //做标记,是否使用VML
}

//检查是否可以使用canvas
var useCanvas = !supportVML

//角度到弧度
function angleToRadian(angle) {
    return angle * Math.PI / 180
}

//获取时间
function performanceNow() {
    //如果支持HRT(High Resolution Time,高精度时间)就用HRT
    if (window.performance && window.performance.now) {
        return window.performance.now() //纳秒级别
    } else {
        return new Date() //毫秒级别
    }
}

//浏览器更新页面事件,避免过度渲染或者丢帧
var requestAFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        // 都不行就还用setTimeout
        function (callback) {
            //每秒60帧
            return setTimeout(callback, 1000 / 60)
        }
}()

//取消事件的注册
var cancelAFrame = function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function(id) {
            clearTimeout(id)
        }
}()

//超简单的代理方法...主要也是效率的考虑...
function bind(func, context) {
    return function () {
        func.call(context);
    }
}

var Clazz = function (option) {
    this.option = $.extend(true, {
        canvas: null, //canvas元素选择器
        width: 350, //宽度
        height: 150, //高度
        plate: '', //盘子图片地址
        prizes: [], //奖级配置
        angle: 0, //初始化角度
        arrow: null,  // 箭头图片,{x:235,y:0,width:30,height:260,image:'img/arrow.png'}
        button: null, // 按钮图片,{x:235,y:0,width:30,height:260,image:'img/arrow.png',click:function}
        roller: 'plate', // plate or arrow 是盘子转还是箭头转
        angularSpeed: 1000, // 角速度:角度/秒
        startDuration: 2000, // 起步阶段时长,单位毫秒
        stopDuration: 10000, // 结束阶段时长,单位毫秒
        safeAngle: 10, // 安全边界角度,避免转盘停止在两个奖临界的地方
        onRolling: null, // 转盘开始旋转时的回调
        onStop: null // 当转盘停止转动时候的回调
    }, option)

    //确保必要属性存在
    if (!this.option.canvas || !this.option.plate) {
        return null
    }
    //获取转盘根元素
    this.$canvas = $(this.option.canvas)
    if (this.$canvas.length == 0) {
        return null
    }
    //如果是盘子转则需要修理一下中奖的区域
    if (this.option.roller == 'plate') {
        this.fixRange()
    }
    // 盘子图片实例
    this._image = null
    // 当前的状态: stop,停止; start,旋转的起步阶段; rolling&waitting,旋转中并等待中奖结果; rolling, 减速旋转中;
    this._rolling = 'stop'
    // this._angle为当前旋转的角度
    this._angle = this.option.angle
    //角速度
    this._angularSpeed = 0
    // 中奖结果
    this._prize = null
    // 箭头图片实例
    this._arrow = null
    // 按钮图片实例
    this._button = null
    // 绘图事件id
    this._requestId = 0

    // 初始化
    this.init()
};
Clazz.prototype = {
    init: useCanvas ? function() {
        var option = this.option
        var oArrow = option.arrow
        var oBtn = option.button

        // 获得canvas元素
        this.canvas = this.$canvas[0]
        // 获得上下文
        this.context = this.canvas.getContext('2d')
        var context = this.context
        // 获得宽高
        var w = option.width
        var h = option.height
        
        // 此值代表画布每列上有多少个像素
        this.canvas.width = w
        // 此值代表画布每行上有多少个像素
        this.canvas.height = h
        
        // 根据旋转对象的不同,创建不同的渲染方法,这么做是为了效率的考量
        this.innerRender = option.roller != 'plate' ? function() {
            //先画盘子作为底图
            context.drawImage(this._image, 0, 0, w, h, 0, 0, w, h)
            //根据旋转的角度画箭头
            this.rotate(this._arrow, oArrow.width, oArrow.height, oArrow.x, oArrow.y)
        } : function() {
            // 底图是按角度旋转过的盘子
            this.rotate(this._image, w, h, 0, 0)
            // 如果需要则绘制箭头
            if (this._arrow) {
                context.drawImage(this._arrow, 0, 0, oArrow.width, oArrow.height, oArrow.x, oArrow.y, oArrow.width, oArrow.height)
            }
        }

        //初始化箭头图片实例
        if (oArrow) {
            this.loadImage('_arrow', oArrow)
        }
        //初始化按钮图片实例
        if (oBtn) {
            this.loadImage('_button', oBtn)
        }
        //初始化盘子图片实例
        this.loadImage('_image', {
            image: option.plate,
            width: w,
            height: h
        })
    } : function() {
        //vml: 初始化方法
        //不需要什么额外的对象初始化
        //直接组间转盘即可
        this.buildRoller()
    },
    checkImageComplete: function() {
        //当所有图片都加载完成后,组建转盘
        if (this.option.arrow && !this._arrow) return
        if (this.option.button && !this._button) return
        if (!this._image) return
        this.buildRoller()
    },
    rotate: function(i, iw, ih, ix, iy) {
        //此方法只有canvas模式时会调用
        //主要用于图片的旋转
        var context = this.context
        var width = this.option.width 
        var height = this.option.height
        context.save()
        this.context.translate(width/2, height/2)
        context.rotate(angleToRadian(this._angle % 360))
        this.context.translate(-width/2, -height/2)
        context.drawImage(i, 0, 0, iw, ih, ix, iy, iw, ih)
        context.restore()
    },
    loadImage: function(imageName, option) {
        var img = new Image()
        var self = this
        //绑定事件
        img.onload = function () {
            self[imageName] = img //对图片实例赋值
            self.checkImageComplete() //检查所有图片是否已经加载完毕
        };
        img.src = option.image
        img.width = option.width
        img.height = option.height
    },
    /*
     * 如果旋转的是转盘,则需要修改一下奖区
     * 比如2等奖的区域是30-90度
     * 盘子就必须转到270-330度的时候才正好可以将奖区的图片内容对准0度的位置
     */    
    fixRange: function() {
        var prizes = this.option.prizes
        for (var i in prizes) {
            var p = prizes[i]
            var t = p.range[0]
            p.range[0] = 360 - p.range[1]
            p.range[1] = 360 - t
        }
    },
    buildRoller: useCanvas ? function() {
        var option = this.option
        var oBtn = option.button

        //canvas:组装转盘
        if (oBtn && typeof oBtn.click == 'function') {
            //如果设置了按钮图片并且绑定了按钮点击事件,则初始化按钮
            var canvas = this.canvas
            var click = oBtn.click
            //保存按钮的位置和大小
            var buttonRect = {
                x: oBtn.x,
                y: oBtn.y,
                w: oBtn.width,
                h: oBtn.height
            }
            //判断鼠标是否在按钮区域内的方法
            var inRect = function(e) {
                var rect = canvas.getBoundingClientRect();//获取根元素的位置和大小
                //获得按钮左上角点和右下角点在页面上实际坐标
                rect = {
                    x1: rect.left + buttonRect.x,
                    y1: rect.top + buttonRect.y,
                    x2: rect.left + buttonRect.x + buttonRect.w,
                    y2: rect.top + buttonRect.y + buttonRect.h
                }
                var scrollTop = -$(window).scrollTop()
                var dRect = {
                    left: 0,
                    top: scrollTop
                }
                //将鼠标在窗口中的坐标转成在页面中的坐标
                var x = e.pageX + dRect.left
                var y = e.pageY + dRect.top
                //判断是否在按钮区域内
                if (rect.x1 <= x && rect.x2 >= x && rect.y1 <= y && rect.y2 >= y) {
                    return true
                }
                return false
            };
            //绑定鼠标移动事件和点击事件
            $(canvas).bind('mousemove',function (e) {
                if (inRect(e)) {
                    //如果鼠标在按钮范围内就修改鼠标样式
                    canvas.style.cursor = 'pointer'
                } else if (canvas.style.cursor == 'pointer') {
                    canvas.style.cursor = ''
                }
            }).click(function (e) {
                // 如果鼠标点击事件发生在按钮区域内就触发事件
                if (inRect(e)) {
                    click()
                }
            });
        }
        this.render()

    } : function() {
        /*
         * vml组装转盘的时候就非常简单了
         * 只要按拼html标签的方式
         * 把对应的vml标签都拼好就可以了
         */
        var option = this.option
        var w = option.width
        var h = option.height
        var oArrow = this.option.arrow
        var oBtn = this.option.button

        var html = [];
        //外围div
        html.push('<div style="position:relative;width:', w, 'px;height:', h, 'px;overflow:hidden;">')
        //图形组
        html.push('<jd_vml_:group style="position:absolute;width:', w, 'px;height:', h, 'px;" coordsize="', w, ',', h, '" coordorigin="0,0">')
        //创建几个图片元素,元素位置靠后的显示在上方
        //盘子图片
        html.push('<jd_vml_:image style="width:', w, 'px;height:', h, 'px" coordsize="', w, ',', h, '"  src="', option.plate, '"></jd_vml_:image>')
        //有箭头就放入箭头
        if (oArrow) {
            html.push('<jd_vml_:image style="position:absolute;left:', oArrow.x, 'px;top:', oArrow.y, 'px;width:', oArrow.width, 'px;height:', oArrow.height, 'px" coordsize="', oArrow.width, ',', oArrow.height, '"  src="', oArrow.image, '"></jd_vml_:image>')
        }
        //有按钮就放入按钮
        if (oBtn) {
            html.push('<jd_vml_:image style="position:absolute;left:', oBtn.x, 'px;top:', oBtn.y, 'px;width:', oBtn.width, 'px;height:', oBtn.height, 'px" coordsize="', oBtn.width, ',', oBtn.height, '"  src="', oBtn.image, '"></jd_vml_:image>')
        }
        html.push('</jd_vml_:group></div>')

        var ele = this.$canvas[0]
        ele.innerHTML = html.join('')

        //确定旋转时需要操控的对象
        if (option.roller != 'plate') {
            this._image = ele.firstChild.firstChild.childNodes[1]
        } else {
            this._image = ele.firstChild.firstChild.firstChild
        }
        if (oBtn && typeof oBtn.click == 'function') {
            // 如果有按钮则设定按钮的行为
            // 处理起来比canvas容易了很多
            // 查找按钮元素
            var elBtn = ele.firstChild.firstChild.childNodes[oArrow ? 2 : 1]
            elBtn.style.cursor = 'pointer'
            elBtn.onclick = oBtn.click
        }
        this.render()
    },
    render: useCanvas ? function() {
        var context = this.context
        var oBtn = this.option.button
        //重置上一次执行时间
        this._prevTime = performanceNow()
        //初始化时提前创建好的渲染方法
        this.innerRender()
        // 有按钮就画按钮
        if (this._button) {
            context.drawImage(this._button, 0, 0, oBtn.width, oBtn.height, oBtn.x, oBtn.y, oBtn.width, oBtn.height)
        }
    } : function() {
        // 重置上一次执行时间
        this._prevTime = performanceNow()
        // 直接旋转图片
        this._image.Rotation = this._angle % 360
    },
    prize: function(prizeId) {
        if (prizeId && this._rolling != 'rolling') {
            //不可以在rolling状态的时候设置奖品
            for (var idx in this.option.prizes) {
                var p = this.option.prizes[idx]
                if (p.id != prizeId) continue
                //找到奖品的区域信息,并保存它
                this._prize = p
                break
            }
        } else {
            return this._prize
        }
    },
    /*
     * 获得转盘是否正在旋转
     */
    isRolling: function() {
        return this._rolling != 'stop'
    },
    rolling: function() {
        //让转盘启动
        if (this.isRolling()) return
        //初始化一些信息
        this._prize = null //奖品返回清空
        this._rolling = 'start' //更新转盘状态
        this._angle = this._angle % 360 //减小转盘角度
        this._angularSpeed = 0 //角速度
        this._startTime = performanceNow() //开始时间
        this._prevTime = this._startTime //上一次执行时间
        this._goalAngle = -100 //目标角度

        if (typeof this.option.onRolling == 'function') {
            //触发回调函数
            var result = this.option.onRolling(this)
            //返回false就不继续执行了
            if (typeof result == 'boolean' && !result) return
        }
        // 创建开始旋转阶段的代理方法引用
        this._refStartRolling = bind(this.startRolling, this)
        // 创建旋转中的代理方法引用
        this._refRolling = bind(this.__rolling, this)
        // 开始旋转
        this.startRolling()
    },
    __rolling: function() {
        var option = this.option
        //旋转中执行的方法
        var v0 = this._angularSpeed //角速度
        if (this._rolling == 'rolling&waiting') {
            //旋转中,并等待奖品的设置
            this._angle += v0 * (performanceNow() - this._prevTime) / 1000 //匀速旋转
            if (this._prize) {
                //如果设置了奖品
                this._rolling = 'rolling' //更新状态
                // 得到奖区
                var under = this._prize.range[0], over = this._prize.range[1] 
                // 安全角度
                var safe = this.option.safeAngle
                // 随机停止角度
                var stopAngle = Math.floor(Math.random() * ((over - safe) - (under + safe) + 1) + under + safe)
                // 当前角度
                var currAngle = this._angle % 360
                // 重新记录开始角度
                this._startAngle = this._angle
                // 目标角度
                this._goalAngle = stopAngle
                // 计算目标角度,这个角度就是转盘停止的角度
                this._goal = (stopAngle - currAngle) + this._angle + Math.floor(option.angularSpeed * option.stopDuration / 1000 / 2 / 360) * 360
                // 到停止时需要转过多少度
                this._changeAngle = this._goal - this._startAngle
                // 重新记录开始时间
                this._startTime = performanceNow()
            }
        } else if (this._rolling == 'rolling') {
            //拿到奖品开始减速
            var duration = option.stopDuration //停止旋转阶段持续时间
            var timeStamp = performanceNow() - this._startTime //已经经历的时间
            // 如果还未转满时间就继续转
            if (timeStamp < duration && this._angle < this._goal) {
                this._angle = -(Math.pow((timeStamp / duration - 1), 2) - 1) * this._changeAngle + this._startAngle //quad 缓动计算角度
            } else {
                //让角度达到目标角度
                this._angle = this._goal 
                this.render()
                this.stop()
                return
            }
        }
        this.render()
        // 绑定延时事件,准备下一次渲染
        this._requestId = requestAFrame(this._refRolling)
    },
    startRolling: function() {
        var option = this.option
        //转盘启动阶段

        // 当前时间
        var now = performanceNow()
        // 已经经历的时间
        var timeStamp = now - this._startTime
        var vt = -(Math.pow((timeStamp / option.startDuration - 1), 4) - 1) * option.angularSpeed
        // 缓动计算角度，如果时间够了,或者角速度已经够了就变换状态
        if (timeStamp >= option.startDuration || vt >= option.angularSpeed) {
            this._startTime = performanceNow() //重置开始时间
            this._angularSpeed = option.angularSpeed //角速度
            this._rolling = 'rolling&waiting' //改变状态
            this.__rolling() //调用旋转中方法
            return
        }
        // 更新叫速度
        this._angularSpeed = vt
        // 更新角度
        this._angle += vt * (now - this._prevTime) / 1000
        this.render()
        //绑定延时事件,准备下一次渲染
        this._requestId = requestAFrame(this._refStartRolling)
    },
    /*
     * 停止滚动
     */
    stop: function() {
        var option = this.option
        if (this._rolling != 'stop') {
            // 旋转才停止
            this._rolling = 'stop'
            // 取消延迟方法
            if (this._requestId) {
                cancelAFrame(this._requestId)
            }
            var prizeId = 'error' //默认错误
            if (Math.abs(this._angle - this._goal) <= option.safeAngle && this._goalAngle >= this._prize.range[0] && this._goalAngle <= this._prize.range[1]) {
                // 验证转盘当前角度是否合法,避免出现转盘位置出现错误,更新奖品
                prizeId = this._prize.id
            }
            if (typeof option.onStop == 'function') {
                option.onStop(prizeId)
            }
        }
    }
};

return Clazz

}();