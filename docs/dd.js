/**
 * JavaScript Dragdrop Library
 * Copyright (c) 2010 snandy
 * 
 * 基本拖拽
 * var dd = new Dragdrop({
 * 		target 	 拖拽元素 HTMLElemnt 必选
 * 		bridge	 指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到 
 * 		dragable 是否可拖拽	(true)默认
 * 		dragX 	 true/false false水平方向不可拖拽 (true)默认
 * 		dragY	 true/false false垂直方向不可拖拽 (true)默认
 * 		area 	 [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
 * 		inwin	 true/false 仅在浏览器窗口内拖动
 * });
 * 
 * 事件
 * dragstart
 * dd.ondragstart = function() {}
 * 
 * darg
 * dd.ondrag = function() {}
 * 
 * dragend
 * ondragend = function() {}
 * 
 * demo.html
 * 
 */

-function(){
	
function DragDrop(elem, config) {
	if (elem.nodeType === 3 || elem.nodeType === 9) return
	config = config || {}
	this.target   = elem
	this.bridge   = config.bridge
	this.dragable = config.dragable != false
	this.dragX    = config.dragX != false
	this.dragY    = config.dragY != false
	this.area     = config.area
	this.inwin    = config.inwin
	this.elDown   = this.bridge || this.target
	this.init()
}
DragDrop.prototype = {
	init: function() {
		var elDown = this.bridge || this.target
		E.on(elDown, 'mouseover', {
			context: this,
			handler: this.onMouseOver
		})
		E.on(elDown, 'mousedown', {
			context: this,
			handler: this.onMouseDown
		})
	},
	onMouseOver: function() {
		this.elDown.style.cursor = 'move'
	},
	onMouseDown: function(e) {
		var el = this.target
		el.style.position = 'absolute'
		
		if(window.captureEvents) { //标准DOM
			e.stopPropagation()
			e.preventDefault()
			E.on(window, "blur", {
				context: this,
				handler: this.onMouseUp
			})
		}else if(el.setCapture) { //IE
			el.setCapture()
			e.cancelBubble = true
			E.on(el, "losecapture", {
				context: this,
				handler: this.onMouseUp
			})
		}
		
		this.diffX = e.clientX - el.offsetLeft
		this.diffY = e.clientY - el.offsetTop
		
		E.on(document, 'mousemove', {
			context: this,
			handler: this.onMouseMove
		})
		E.on(document, 'mouseup', {
			context: this,
			handler: this.onMouseUp
		})
		// dragstart event
		if (this.ondragstart) {
			this.ondragstart()
		}
	},
	onMouseMove: function(e) {
		var el = this.target, minX, maxX, minY, maxY, area,
			moveX = e.clientX - this.diffX,
			moveY = e.clientY - this.diffY
		
		if (this.area) {
			area = this.area
			minX = area[0]
			maxX = area[1]
			minY = area[2]
			maxY = area[3]
			moveX < minX && (moveX = minX) // left 最小值
			moveX > maxX && (moveX = maxX) // left 最大值
			moveY < minY && (moveY = minY) // top 最小值
			moveY > maxY && (moveY = maxY) // top 最大值
		}
		if (this.dragable) {
			//设置位置，并修正margin
			moveX = moveX - (parseInt(el.style.marginLeft, 10) || 0)
			moveY = moveY - (parseInt(el.style.marginTop, 10) || 0)
			this.dragX && (el.style.left = moveX + 'px')
			this.dragY && (el.style.top =  moveY + 'px')
			this.moveX = moveX
			this.moveY = moveY
			// drag event
			if (this.ondrag) {
				this.ondrag()
			}
		}

	},
	onMouseUp: function() {
		var el = this.target
		el.style.cursor = ''
		E.un(document, 'mousemove', this.onMouseMove)
		E.un(document, 'mouseup', this.onMouseUp)
		this.moveX = this.moveY = undefined
		
		if (window.releaseEvents) { //标准DOM
			E.un(window, 'blur', this.onMouseUp)
		} else if(el.releaseCapture) { //IE
			E.un(el, 'losecapture', this.onMouseUp)
			el.releaseCapture()
		}
		// dragend evnet
		if (this.ondragend) {
			this.ondragend()
		}
	},
	setX: function() {
		this.dragX = true
		this.dragY = false
	},
	setY: function(b) {
		this.dragY = true
		this.dragX = false
	},
	dragAll: function() {
		this.dragX = true
		this.dragY = true
	},
	setArea: function(a) {
		this.area = a
	},
	setBridge: function(b) {
		this.bridge = b
	},
	setDragable: function(b) {
		this.dragable = b
	},
	reStore: function() {
		this.dragAll()
		this.target.style.top = '0px'
		this.target.style.left = '0px'
	},
	getX: function() {
		return this.dragX
	},
	getY: function() {
		return this.dragY
	}
}

// Expose E to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
	define('DragDrop', [], function () { return DragDrop } )
} else {
	window.DragDrop = DragDrop
}

}()
