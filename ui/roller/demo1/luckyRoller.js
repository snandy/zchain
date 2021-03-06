
/**
 * 转盘控制器类
 */
var LuckyRoller = function(window) {

var doc = window.document
// 默认使用canvas
var useCanvas = true

// 添加命名空间
function addNamespace(doc, prefix, urn) {
    if (!doc.namespaces[prefix]) {
        //第三个参数是定义该命名空间下所有元素的默认行为为VML
        doc.namespaces.add(prefix, urn, '#default#VML')
    }
}
// 添加VML所需的命名空间
function addNamespaces(doc) {
    addNamespace(doc, 'jd_vml_', 'urn:schemas-microsoft-com:vml')
}

//只有在浏览器不支持canvas时才执行此段代码
if (!doc.createElement('canvas').getContext) {
    addNamespaces(doc)
    doc.createElement('canvas') //创建一个canvas元素使IE对其认可
    useCanvas = false
}

// 角度到弧度
function angleToRadian(angle) {
    return angle * Math.PI / 180
}

// 获取时间, 如果支持HRT(High Resolution Time,高精度时间)就用HRT
function performanceNow() {
    if (window.performance && window.performance.now) {
        return window.performance.now() //纳秒级别
    } else {
        return new Date() //毫秒级别
    }
}

// 浏览器更新页面事件,避免过度渲染或者丢帧
var requestAFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        // 都不行就还用setTimeout，每秒60帧
        function (callback) {
            return setTimeout(callback, 1000 / 60)
        }
}()

// 取消事件的注册
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
        chassisSrc: '', //盘子图片地址
        prizes: [], //奖级配置
        angle: 0, //初始化角度
        button: null, // 按钮图片,{x:235,y:0,width:30,height:260,image:'img/arrow.png',click:function}
        angularSpeed: 1000, // 角速度:角度/秒
        startDuration: 2000, // 起步阶段时长,单位毫秒
        stopDuration: 10000, // 结束阶段时长,单位毫秒
        safeAngle: 10, // 安全边界角度,避免转盘停止在两个奖临界的地方
        onRolling: null, // 转盘开始旋转时的回调
        onStop: null // 当转盘停止转动时候的回调
    }, option)

    // 确保必要属性存在
    if (!this.option.canvas || !this.option.chassisSrc) {
        return null
    }
    // 获取转盘根元素
    this.$canvas = $(this.option.canvas)
    if (this.$canvas.length == 0) {
        return null
    }
    // 如果是盘子转则需要修理一下中奖的区域
    this.fixRange()
    // 底盘图片实例
    this.elChassis = null
    // 按钮图片实例
    this.elButton = null    
    // 当前的状态: stop, 停止; start, 旋转的起步阶段; rolling&waitting, 旋转中并等待中奖结果; rolling, 减速旋转中
    this.status = 'stop'
    // this.angle为当前旋转的角度
    this.angle = this.option.angle
    // 角速度
    this.angularSpeed = 0
    // 中奖结果
    this.prize = null

    // 绘图事件id
    this.requestId = 0
    // 初始化
    this.init()
};
Clazz.prototype = {
    init: useCanvas ? function() {
        var option = this.option
        var oBtn = option.button

        // 获得canvas元素
        this.canvas = this.$canvas[0]
        // 获得上下文
        this.context = this.canvas.getContext('2d')
        var context = this.context
        // 获得宽高
        var wi = option.width
        var he = option.height
        
        // 此值代表画布每列上有多少个像素
        this.canvas.width = wi
        // 此值代表画布每行上有多少个像素
        this.canvas.height = he
        
        //初始化按钮图片实例
        if (oBtn) {
            this.loadImage('elButton', oBtn)
        }
        //初始化盘子图片实例
        this.loadImage('elChassis', {
            src: option.chassisSrc,
            width: wi,
            height: he
        })
    } : function() {
        // vml: 初始化方法,不需要什么额外的对象初始化,直接组间转盘即可
        this.buildRoller()
    },
    checkImageComplete: function() {
        //当所有图片都加载完成后,组建转盘
        if (!this.elChassis) return
        if (this.option.button && !this.elButton) return
        this.buildRoller()
    },
    rotate: function(el, iw, ih, ix, iy) {
        // 此方法只有canvas模式时会调用,主要用于图片的旋转
        var context = this.context
        var width = this.option.width 
        var height = this.option.height
        context.save()
        context.translate(width/2, height/2)
        context.rotate(angleToRadian(this.angle % 360))
        context.translate(-width/2, -height/2)
        context.drawImage(el, 0, 0, iw, ih, ix, iy, iw, ih)
        context.restore()
    },
    loadImage: function(imageName, option) {
        var img = new Image()
        var self = this
        // 检查所有图片是否已经加载完毕
        img.onload = function() {
            self[imageName] = img            
            self.checkImageComplete()
        }
        img.src = option.src
        img.width = option.width
        img.height = option.height
    },
    /*
     * 如果旋转的是转盘,则需要修改一下奖区
     * 比如2等奖的区域是30-90度，盘子就必须转到270-330度的时候才正好可以将奖区的图片内容对准0度的位置
     */    
    fixRange: function() {
        var prizes = this.option.prizes
        for (var i = 0; i < prizes.length; i++) {
            var p = prizes[i]
            var t = p.range[0]
            p.range[0] = 360 - p.range[1]
            p.range[1] = 360 - t
        }
    },
    buildRoller: useCanvas ? function() {
        var option = this.option
        var oBtn = option.button

        // canvas:组装转盘
        // 如果设置了按钮图片并且绑定了按钮点击事件,则初始化按钮
        var canvas = this.canvas
        var click = oBtn.click
        //保存按钮的位置和大小
        var buttonRect = {
            x: oBtn.x,
            y: oBtn.y,
            w: oBtn.width,
            h: oBtn.height
        }
        // 判断鼠标是否在按钮区域内的方法
        var inRect = function(e) {
            var rect = canvas.getBoundingClientRect()
            // 获得按钮左上角点和右下角点在页面上实际坐标
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
            // 将鼠标在窗口中的坐标转成在页面中的坐标
            var x = e.pageX + dRect.left
            var y = e.pageY + dRect.top
            // 判断是否在按钮区域内
            if (rect.x1 <= x && rect.x2 >= x && rect.y1 <= y && rect.y2 >= y) {
                return true
            }
            return false
        }
        // 绑定鼠标移动事件和点击事件
        this.$canvas.bind('mousemove', function(e) {
            canvas.style.cursor = inRect(e) ? 'pointer' : ''
        }).click(function (e) {
            if ( inRect(e) ) click()
        })

        // 渲染
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
        var oBtn = option.button

        var arr = []
        //外围div
        arr.push('<div style="position:relative;width:', w, 'px;height:', h, 'px;overflow:hidden;">')
        //图形组
        arr.push('<jd_vml_:group style="position:absolute;width:', w, 'px;height:', h, 'px;" coordsize="', w, ',', h, '" coordorigin="0,0">')
        //创建几个图片元素,元素位置靠后的显示在上方
        //盘子图片
        arr.push('<jd_vml_:image style="width:', w, 'px;height:', h, 'px" coordsize="', w, ',', h, '"  src="', option.chassisSrc, '"></jd_vml_:image>')
        //有按钮就放入按钮
        if (oBtn) {
            arr.push('<jd_vml_:image style="position:absolute;left:', oBtn.x, 'px;top:', oBtn.y, 'px;width:', oBtn.width, 'px;height:', oBtn.height, 'px" coordsize="', oBtn.width, ',', oBtn.height, '"  src="', oBtn.src, '"></jd_vml_:image>')
        }
        arr.push('</jd_vml_:group></div>')

        this.$canvas.html(arr.join(''))

        // 确定旋转时需要操控的对象
        this.elChassis = $canvas[0].firstChild.firstChild.firstChild

        if (oBtn && typeof oBtn.click == 'function') {
            // 如果有按钮则设定按钮的行为, 处理起来比canvas容易了很多
            var elBtn = $canvas[0].firstChild.firstChild.childNodes[1]
            elBtn.style.cursor = 'pointer'
            elBtn.onclick = oBtn.click
        }

        // 渲染
        this.render()
    },
    render: useCanvas ? function() {
        var option = this.option
        var context = this.context
        var oBtn = option.button
        // 重置上一次执行时间
        this.prevTime = performanceNow()
        //初始化时提前创建好的渲染方法
        this.rotate(this.elChassis, option.width, option.height, 0, 0)
        // 有按钮就画按钮
        if (this.elButton) {
            context.drawImage(this.elButton, 0, 0, oBtn.width, oBtn.height, oBtn.x, oBtn.y, oBtn.width, oBtn.height)
        }
    } : function() {
        // 重置上一次执行时间
        this.prevTime = performanceNow()
        // 直接旋转图片
        this.elChassis.Rotation = this.angle % 360
    },
    winPrize: function(prizeId) {
        var prizes = this.option.prizes
        if (prizeId && this.status != 'rolling') {
            // 不可以在rolling状态的时候设置奖品
            for (var i = 0; i < prizes.length; i++) {
                var p = prizes[i]
                if (p.id != prizeId) continue
                // 找到奖品的区域信息,并保存它
                this.prize = p
                break
            }
        }
    },
    /*
     * 获得转盘是否正在旋转
     */
    isRolling: function() {
        return this.status != 'stop'
    },
    /*
     * 开始转动
     */    
    start: function() {
        // 让转盘启动
        if (this.isRolling()) return
        // 初始化一些信息
        this.prize = null // 奖品返回清空
        this.status = 'start' // 更新转盘状态
        this.angle = this.angle % 360 // 减小转盘角度
        this.angularSpeed = 0 // 角速度
        this.startTime = performanceNow() // 开始时间
        this.prevTime = this.startTime // 上一次执行时间
        this.goalAngle = -100 // 目标角度

        if (typeof this.option.onRolling == 'function') {
            // 触发回调函数
            var result = this.option.onRolling(this)
            // 返回false就不继续执行了
            if (typeof result == 'boolean' && !result) return
        }
        // 创建开始旋转阶段的代理方法引用
        this.refPreRolling = bind(this.preRolling, this)
        // 创建旋转中的代理方法引用
        this.refRolling = bind(this.rolling, this)
        // 开始旋转
        this.preRolling()
    },
    preRolling: function() {
        var option = this.option
        var startDuration = option.startDuration
        var angularSpeed = option.angularSpeed
        //转盘启动阶段

        var now = performanceNow()
        // 已经经历的时间
        var diffTime = now - this.startTime
        console.log(now)
        console.log('Time' + count++ + ': ' + diffTime)
        var vt = -(Math.pow((diffTime / startDuration - 1), 4) - 1) * angularSpeed
        // 缓动计算角度，如果时间够了,或者角速度已经够了就变换状态
        if (diffTime >= startDuration || vt >= angularSpeed) {
            // 重置开始时间
            this.startTime = performanceNow()
            // 角速度
            this.angularSpeed = angularSpeed
            // 改变状态
            this.status = 'rolling&waiting'
            // 调用旋转中方法
            this.rolling()
            console.log('roll')
            return
        }
        // 更新角速度
        this.angularSpeed = vt
        // 更新角度
        this.angle += vt * (now - this.prevTime) / 1000
        console.log('angle: ' + this.angle)
        this.render()
        // 绑定延时事件,准备下一次渲染
        this.requestId = requestAFrame(this.refPreRolling)
    },
    rolling: function() {
        var option = this.option
        // 旋转中执行的方法
        var v0 = this.angularSpeed //角速度
        if (this.status == 'rolling&waiting') {
            // 旋转中,并等待奖品的设置, 匀速旋转
            this.angle += v0 * (performanceNow() - this.prevTime) / 1000
            if (this.prize) {
                //如果设置了奖品, 更新状态
                this.status = 'rolling'
                // 得到奖区
                var under = this.prize.range[0]
                var over = this.prize.range[1]
                // 安全角度
                var safe = option.safeAngle
                // 随机停止角度
                var stopAngle = Math.floor(Math.random() * ((over - safe) - (under + safe) + 1) + under + safe)
                // 当前角度
                var currAngle = this.angle % 360
                // 重新记录开始角度
                this.startAngle = this.angle
                // 目标角度
                this.goalAngle = stopAngle
                // 计算目标角度, 这个角度就是转盘停止的角度
                this._goal = (stopAngle - currAngle) + this.angle + Math.floor(option.angularSpeed * option.stopDuration / 1000 / 2 / 360) * 360
                // 到停止时需要转过多少度
                this.changeAngle = this._goal - this.startAngle
                // 重新记录开始时间
                this.startTime = performanceNow()
            }
        } else if (this.status == 'rolling') {
            // 拿到奖品开始减速
            var duration = option.stopDuration // 停止旋转阶段持续时间
            var diffTime = performanceNow() - this.startTime // 已经经历的时间
            // 如果还未转满时间就继续转
            if (diffTime < duration && this.angle < this._goal) {
                // quad 缓动计算角度
                this.angle = -(Math.pow((diffTime / duration - 1), 2) - 1) * this.changeAngle + this.startAngle 
            } else {
                // 让角度达到目标角度
                this.angle = this._goal 
                this.render()
                this.stop()
                return
            }
        }
        // console.log(count++)
        // 渲染
        this.render()
        // 绑定延时事件,准备下一次渲染
        this.requestId = requestAFrame(this.refRolling)
    },
    /*
     * 停止滚动
     */
    stop: function() {
        var option = this.option
        if (this.status != 'stop') {
            // 旋转才停止
            this.status = 'stop'
            // 取消延迟方法
            if (this.requestId) {
                cancelAFrame(this.requestId)
            }
            // 默认错误
            var prizeId = 'error'
            // 验证转盘当前角度是否合法,避免出现转盘位置出现错误,更新奖品
            if (Math.abs(this.angle - this._goal) <= option.safeAngle && this.goalAngle >= this.prize.range[0] && this.goalAngle <= this.prize.range[1]) {
                prizeId = this.prize.id
            }
            if (typeof option.onStop == 'function') {
                option.onStop(prizeId)
            }
        }
    }
}

var count = 0
return Clazz

}(this);