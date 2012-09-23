/**
 * 
 * JavaScript ModelDialog v0.6
 * Copyright (c) 2011 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * 
 * new ModelDialog({
 *		 caption	  标题 '对话框标题'(默认)
 *		 template	 主体内容 ''(默认)
 *		 dialogCls	对话框className 'md-dialog'(默认)
 *		 headCls	  头部className 'md-head'(默认)
 *		 btnCloseCls  关闭按钮className 'md-close'(默认)
 *		 bodyCls	  主体className 'md-body'(默认)
 *		 shadowBg	 遮盖层背景色 'gray'(默认)
 *		 shadowOpy	遮盖层透明的 0.2(默认)
 *		 dragable	 是否可拖拽 true(默认)
 *		 dragInWin	是否仅在窗口内拖动 (true)默认  与area互斥
 *		 area		 [minX,maxX,minY,maxY] 与dragInWin互斥
 * });
 */

ModelDialog = function(window){
	
var doc = window.document,
	navigator = window.navigator;
	
var px = 'px';
var isIE = /msie/.test(navigator.userAgent.toLowerCase());

function getViewSize(){
	return {w: window['innerWidth'] || doc.documentElement.clientWidth,
			h: window['innerHeight'] || doc.documentElement.clientHeight};
}
function getFullSize(){
	var w = Math.max(doc.documentElement.clientWidth ,doc.body.clientWidth) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
	var h = Math.max(doc.documentElement.clientHeight,doc.body.clientHeight) +  Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
	w = Math.max(doc.documentElement.scrollWidth,w);
	h = Math.max(doc.documentElement.scrollHeight,h);
	return {w:w,h:h};
}

function getStyle(el,name) {
	if(window.getComputedStyle) {
		return window.getComputedStyle(el, null).getPropertyValue[name];
	}else{
		return el.currentStyle[name];
	}
}
function getWH(el, name) {
	var val = name === "width" ? el.offsetWidth : el.offsetHeight,
		which = name === "width" ? ['Left', 'Right'] : ['Top', 'Bottom'];
	// display is none
	if(val === 0) {
		return 0;
	}
	for(var i = 0, a; a = which[i++];) {
		val -= parseFloat( getStyle(el, "border" + a + "Width") ) || 0;
		val -= parseFloat( getStyle(el, "padding" + a) ) || 0;
	}
	return val + 'px';
}
function $C(tag, attr, style, html) {
	var el = doc.createElement(tag);
	if(attr) {
		for(var key in attr) {
			el[key] = attr[key];
		}
	}
	if(style) {
		for(var key in style) {
			el.style[key] = style[key];
		}
	}
	if(html) {
		el.innerHTML = html;
	}
	return el;
}
var w3c = !!window.addEventListener,
	addEvent = w3c ?
	   function(el, type, fn) {el.addEventListener(type, fn, false);} :
	   function(el, type, fn) {el.attachEvent("on" + type, fn);},
	removeEvent = w3c ?
	   function(el, type, fn) {el.removeEventListener(type, fn, false);} :
	   function(el, type, fn) {el.detachEvent("on" + type, fn);};
	   
var Dragdrop = function(window){
	
	return function(opt){
		
		var conf, defaultConf, diffX, diffY;
		function Config(opt){
			this.target = opt.target;
			this.bridge = opt.bridge;
			this.dragDiv = opt.dragDiv;
			this.dragable = opt.dragable != false;
			this.dragX = opt.dragX != false;
			this.dragY = opt.dragY != false;
			this.area  = opt.area;
			this.onDown = opt.onDown;
			this.onMove = opt.onMove;
			this.onUp = opt.onUp;
		}
		function Dragdrop(opt){
			if(!opt){return;}
			conf = new Config(opt);
			defaultConf = new Config(opt);
			
			var elDown = conf.bridge || conf.target;
			addEvent(elDown, 'mouseover', function(){
				elDown.style.cursor = 'move';
			})
			addEvent(elDown, 'mousedown', mousedown);
		}
		Dragdrop.prototype = {
			dragX : function(){
				conf.dragX = true;
				conf.dragY = false;
			},
			dragY : function(b){
				conf.dragY = true;
				conf.dragX = false;
			},
			dragAll : function(){
				conf.dragX = true;
				conf.dragY = true;
			},
			setArea : function(a){
				conf.area = a;
			},
			setBridge : function(b){
				conf.bridge = b;
			},
			setDragable : function(b){
				conf.dragable = b;
			},
			reStore : function(){
				conf = new Config(defaultConf);
				conf.target.style.top = '0px';
				conf.target.style.left = '0px';
			},
			getDragX : function(){
				return conf.dragX;
			},
			getDragY : function(){
				return conf.dragY;
			}
		}
		function mousedown(e){
			e = e || window.event;
			var el = conf.target;
			if(window.captureEvents){ //标准DOM
				e.stopPropagation();
				e.preventDefault();
				addEvent(window, "blur", mouseup);
			}else if(el.setCapture){ //IE
				el.setCapture();
				e.cancelBubble = true;
				addEvent(el, "losecapture", mouseup);
			}
			diffX = e.clientX - el.offsetLeft;
			diffY = e.clientY - el.offsetTop;
			addEvent(doc,'mousemove',mousemove);
			addEvent(doc,'mouseup',mouseup);
			
			if(conf.onDown) {
				conf.onDown();
			}
		}
		function mousemove(e){
			var el = conf.dragDiv,
			e = e || window.event,
			moveX = e.clientX - diffX,
			moveY = e.clientY - diffY;
			
			var minX, maxX, minY, maxY;
			if(conf.area){
				minX = conf.area[0];
				maxX = conf.area[1];
				minY = conf.area[2];
				maxY = conf.area[3];
				moveX < minX && (moveX = minX); // left 最小值
				moveX > maxX && (moveX = maxX); // left 最大值
				moveY < minY && (moveY = minY); // top 最小值
				moveY > maxY && (moveY = maxY); // top 最大值
			}
			if(conf.dragable){
				//设置位置，并修正margin
				moveX = moveX - (parseInt(el.style.marginLeft, 10) || 0);
				moveY = moveY - (parseInt(el.style.marginTop, 10) || 0);
				
				conf.dragX && (el.style.left = moveX + 'px');
				conf.dragY && (el.style.top =  moveY + 'px');
				if(conf.onMove){
					var obj = {moveX:moveX,moveY:moveY};
					conf.onMove(obj);
				}
			}
		}
		function mouseup(e){
			var el = conf.target;
			el.style.cursor = '';
			removeEvent(doc,'mousemove',mousemove);
			removeEvent(doc,'mouseup',mouseup);
			if(window.releaseEvents){ //标准DOM
				removeEvent(window, "blur", mouseup);
			}else if(el.releaseCapture){ //IE
				removeEvent(el, "losecapture", mouseup);
				el.releaseCapture();
			}
			if(conf.onUp) {
				conf.onUp();
			}
		}
		return new Dragdrop(opt);
		
	}
		
}(window);

function ModelDialog(opt){
	this.dialogCls = opt.dialogCls || 'md-dialog';
	this.headCls = opt.headCls || 'md-head';
	this.btnCloseCls = opt.btnCloseCls || 'md-close';
	this.bodyCls = opt.bodyCls || 'md-body';
	this.shadowBg = opt.shadowBg || 'gray';
	this.shadowOpy = opt.shadowOpy || '0.2';
	this.caption = opt.caption || "对话框标题";
	this.template = opt.template || '';
	this.dragable = opt.dragable != false;
	this.dragInWin = opt.dragInWin != false;
	this.area = opt.area;
	this.dialog = null;
	this.head = null;
	this.label = null;
	this.btnClose = null;
	this.body = null;
	this.shadow = null;
	this.dragDiv = null;
	this.init();
}
ModelDialog.prototype = {
	init : function(){
		var me = this;
		this.dialog = $C(
			'div', 
			{className: this.dialogCls},
			{
				position: 'absolute',
				zIndex: '100'
			}
		);
		this.dragDiv = $C(
			'div', null,
			{
				position: 'absolute',
				zIndex: '101',
				border: '2px dashed #BCC4D0'
			}
		);
		this.head = $C('div', {className: this.headCls});
		this.label = $C('label', null, null, this.caption);
		this.btnClose = $C('div', {className: this.btnCloseCls});
		addEvent(this.btnClose,'mousedown',function(e){
			e = e || window.event;
			if(e.stopPropagation) {
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
			me.close();
		});
		this.head.appendChild(this.label);
		this.head.appendChild(this.btnClose);
		this.body = $C('div', {className: this.bodyCls});
		this.setContent(this.template);
		var hd = $C('div', {className: 'hd'});
		var ft = $C('div', {className: 'ft'});
		var bd = $C('div', {className: 'bd'});
		
		bd.appendChild(this.head);
		bd.appendChild(this.body);
		this.dialog.appendChild(hd);
		this.dialog.appendChild(bd);
		this.dialog.appendChild(ft);
		this.createShadow();
		doc.body.appendChild(this.dragDiv);
		doc.body.appendChild(this.shadow);
		doc.body.appendChild(this.dialog);
		this.moveToCenter();
		var width = getWH(this.dialog, 'width');
		var height = getWH(this.dialog, 'height');
		this.dragDiv.style.top = parseInt(this.dialog.style.top)-2 + 'px';
		this.dragDiv.style.left = parseInt(this.dialog.style.left)-2 + 'px';
		this.dragDiv.style.width = width;
		this.dragDiv.style.height = height;
		this.dragDiv.style.display = 'none';
		// 计算拖拽范围  
		// 标准模式下：clientWidth=width+padding；offsetWidth=width+padding+border
		if(this.dragable){
			var me = this;
			if(this.dragInWin){
				var borderLength = 4;
				var maxX = getFullSize().w - this.dialog.offsetWidth-borderLength;
				var maxY = getViewSize().h - this.dialog.offsetHeight-borderLength;
				new Dragdrop({
					target: this.dialog,
					dragDiv: this.dragDiv,
					bridge: this.head,
					area: [0, maxX, 0, maxY],
					onDown: function(){
						me.dragDiv.style.display = '';
					},
					onUp: function(){
						me.animate();
					}
				});
			}
			
		}
	},
	animate : function(top, left, duration) {
		var me = this,
			dialog = me.dialog;
			
		var style1 = dialog.style,
			style2 = me.dragDiv.style;
			
		var top1 = parseFloat(style1.top),
			left1 = parseFloat(style1.left),
			top2 = parseFloat(style2.top)+2,
			left2 = parseFloat(style2.left)+2;
		
		var dis1 = top2 - top1,
			dis2 = left2 - left1;
		
		var ttop = dis1 / 10,
			tleft = dis2 / 10;
		
		var i = 1;
		
		var timer = setInterval(function() {
			dialog.style.top = (top1 + i * ttop) + 'px';
			dialog.style.left = (left1 + i * tleft) + 'px';
			i++;
			if(i>10) {
				setTimeout(function(){
					me.dragDiv.style.display = 'none';
				}, 200)
				clearInterval(timer);
			}
		}, 30);
		
	},
	destroy : function(){
		this.dialog = null;
		this.head = null;
		this.label = null;
		this.btnClose = null;
		this.body = null;
		this.shadow = null;
		this.dragDiv = null;
	},
	createShadow : function(){
		var str = 'position:absolute;left:0px;top:0px;z-index:1' + 
			';width:' + getFullSize().w + px +
			';height:' + getFullSize().h + px +
			';background:' + this.shadowBg +
			';opacity:' + this.shadowOpy +
			';filter:Alpha(Opacity=' + this.shadowOpy*100 + ');';
		var me = this;
		this.shadow = $C("div", {className: 'md-shadow'});
		this.shadow.style.cssText = str;
		addEvent(window,'resize',function(){
			if(me.shadow) {
				me.shadow.style.width = getFullSize().w + px;
				me.shadow.style.height = getFullSize().h + px;
				me.moveToCenter();
			}
		});
	},
	moveTo : function(x, y){
		this.dialog.style.left = x + px;
		this.dialog.style.top = y + px;
		this.dragDiv.style.left = x + px;
		this.dragDiv.style.top = y + px;
	},
	moveToCenter : function(){
		var size = getViewSize();
		var x = (size.w-50)/2 - (this.dialog.clientWidth-50)/2;
		var y = (size.h- 50)/2 - (this.dialog.clientHeight-50)/2 + doc.documentElement.scrollTop;
		this.moveTo(x, y);
	},
	setCaption : function(v){
		this.caption = v;
		this.label.innerHTML = v;
	},
	setContent : function(str){
		this.template = str;
		this.body.innerHTML = str;
	},
	close : function(){
		if(this.dialog && this.shadow && this.dragDiv) {
			doc.body.removeChild(this.dialog);
			doc.body.removeChild(this.shadow);
			doc.body.removeChild(this.dragDiv);
		}
		this.destroy();
	}

}

return ModelDialog;
}(this);
