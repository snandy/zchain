/**
 * JavaScript Dragdrop Library v0.4
 * Copyright (c) 2010 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2010-09-06
 * 
 * 
 * 基本拖拽
 * new Dragdrop({
 * 		target 	 拖拽元素 HTMLElemnt 必选
 * 		bridge	 指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到 
 * 		dragable 是否可拖拽	(true)默认
 * 		dragX 	 true/false false水平方向不可拖拽 (true)默认
 * 		dragY	 true/false false垂直方向不可拖拽 (true)默认
 * 		area 	 [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
 * 		callback 移动过程中的回调函数
 * });
 * 
 * demo
 * 		dragdrop_0.4.html
 */

Dragdrop = function(window) {
	
	var doc = window.document, w3c = !!window.addEventListener, 
	
		addEvent = w3c ?
			function(el, type, fn) {el.addEventListener(type, fn, false)} :
			function(el, type, fn) {el.attachEvent("on" + type, fn)},
		
		removeEvent = w3c ?
			function(el, type, fn) {el.removeEventListener(type, fn, false)} :
			function(el, type, fn) {el.detachEvent("on" + type, fn)}
	 
	return function(opt) {
		
		var conf, defaultConf, diffX, diffY
		function Config(opt) {
			this.target   = opt.target
			this.bridge   = opt.bridge
			this.dragable = opt.dragable != false
			this.dragX    = opt.dragX != false
			this.dragY    = opt.dragY != false
			this.area     = opt.area
			this.callback = opt.callback
		}
		function Dragdrop(opt) {
			if(!opt) return
			
			conf = new Config(opt)
			defaultConf = new Config(opt)
			
			var elDown = conf.bridge || conf.target
			addEvent(elDown, 'mouseover', function() {
				this.style.cursor = 'move'
			})
			addEvent(elDown, 'mousedown', mousedown)
		}
		Dragdrop.prototype = {
			dragX: function() {
				conf.dragX = true
				conf.dragY = false
			},
			dragY: function(b) {
				conf.dragY = true
				conf.dragX = false
			},
			dragAll: function() {
				conf.dragX = true
				conf.dragY = true
			},
			setArea: function(a) {
				conf.area = a
			},
			setBridge: function(b) {
				conf.bridge = b
			},
			setDragable: function(b) {
				conf.dragable = b
			},
			reStore: function() {
				conf = new Config(defaultConf)
				conf.target.style.top = '0px'
				conf.target.style.left = '0px'
			},
			getDragX: function() {
				return conf.dragX
			},
			getDragY: function() {
				return conf.dragY
			}
		}
		function mousedown(e) {
			var el = conf.target
			el.style.position = 'absolute'
			
			if(window.captureEvents){ //标准DOM
				e.stopPropagation()
				e.preventDefault()
				addEvent(window, "blur", mouseup)
			}else if(el.setCapture){ //IE
				el.setCapture()
				e.cancelBubble = true
				addEvent(el, "losecapture", mouseup)
			}
			diffX = e.clientX - el.offsetLeft
			diffY = e.clientY - el.offsetTop
			addEvent(doc,'mousemove',mousemove)
			addEvent(doc,'mouseup',mouseup)
		}
		function mousemove(e) {
			var el = conf.target, minX, maxX, minY, maxY
			moveX = e.clientX - diffX
			moveY = e.clientY - diffY
			
			if (conf.area) {
				minX = conf.area[0]
				maxX = conf.area[1]
				minY = conf.area[2]
				maxY = conf.area[3]
				moveX < minX && (moveX = minX) // left 最小值
				moveX > maxX && (moveX = maxX) // left 最大值
				moveY < minY && (moveY = minY) // top 最小值
				moveY > maxY && (moveY = maxY) // top 最大值
			}
			if (conf.dragable) {
				//设置位置，并修正margin
				moveX = moveX - (parseInt(el.style.marginLeft, 10) || 0)
				moveY = moveY - (parseInt(el.style.marginTop, 10) || 0)
				conf.dragX && (el.style.left = moveX + 'px')
				conf.dragY && (el.style.top =  moveY + 'px')
				if (conf.callback) {
					var obj = {moveX:moveX,moveY:moveY}
					conf.callback.call(conf,obj)
				}
			}
		}
		function mouseup(e) {
			var el = conf.target
			el.style.cursor = ''
			removeEvent(doc,'mousemove',mousemove)
			removeEvent(doc,'mouseup',mouseup)
			if (window.releaseEvents) { //标准DOM
				removeEvent(window, 'blur', mouseup)
			} else if(el.releaseCapture) { //IE
				removeEvent(el, 'losecapture', mouseup)
				el.releaseCapture()
			}
		}
		
		return new Dragdrop(opt);
	}
		
}(this);
