/**
 * JavaScript ModelDialog v0.1
 * Copyright (c) 2010 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2010-09-08 
 * 
 * 简单的模态对话框
 * 
 * new ModelDialog({
 * 		caption 	标题 '对话框标题'(默认)
 * 		template 	主体内容 ''(默认)
 * 		dialogCls 	对话框className 'md-dialog'(默认)
 * 		headCls  	头部className 'md-head'(默认)
 * 		btnCloseCls 关闭按钮className 'md-close'(默认)
 * 		bodyCls 	主体className 'md-body'(默认)
 * 		shadowBg	遮盖层背景色 'gray'(默认)
 * 		shadowOpy 	遮盖层透明的 0.2(默认)
 * });
 * 
 */

ModelDialog =
function(){
	var px = 'px';
	var isIE = function(){
		return navigator.appName.indexOf("Microsoft Internet Explorer") != -1;
	}();
	function getViewSize(){
		return {w: window['innerWidth'] || document.documentElement.clientWidth,
			    h: window['innerHeight'] || document.documentElement.clientHeight}
	}
	function getFullSize(){
		var w = Math.max(document.documentElement.clientWidth ,document.body.clientWidth) + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		var h = Math.max(document.documentElement.clientHeight,document.body.clientHeight) +  Math.max(document.documentElement.scrollTop, document.body.scrollTop);
		w = Math.max(document.documentElement.scrollWidth,w);
		h = Math.max(document.documentElement.scrollHeight,h);
		return {w:w,h:h};	
	}
	function $(tag){
		return new $.prototype.init(tag);
	}
	$.prototype = {
		init : function(tag){
			this[0] = document.createElement(tag);
			return this;		
		},
		setCls : function(cls){
			this[0].className = cls;
			return this;
		},
		setSty : function(name,val){
			name=='opacity' ? 
				isIE ? 
					this[0].style.filter = 'Alpha(Opacity=' + val*100 + ')' : 
					this[0].style.opacity = val :
				this[0].style[name] = val;
			return this;
		},
		css : function(str){
			this[0].style.cssText = str;
			return this;
		},
		html : function(str){
			this[0].innerHTML = str;
			return this;
		}
	}
	$.prototype.init.prototype = $.prototype;
	
	function ModelDialog(opt){
		this.dialogCls = opt.dialogCls || 'md-dialog';
		this.headCls = opt.headCls || 'md-head';
		this.btnCloseCls = opt.btnCloseCls || 'md-close';
		this.bodyCls = opt.bodyCls || 'md-body';
		this.shadowBg = opt.shadowBg || 'gray';
		this.shadowOpy = opt.shadowOpy || '0.2';
		this.caption = opt.caption || "对话框标题";
		this.template = opt.template || '';
		this.dialog = null;
		this.head = null;
		this.label = null;
		this.btnClose = null;
		this.body = null;
		this.shadow = null;
		this.init();
	}
	ModelDialog.prototype = {
		init : function(){
			var _this = this;
			this.dialog = $('div').setCls(this.dialogCls).css('position:absolute;z-index:100;')[0];
			this.head = $('div').setCls(this.headCls)[0];
			this.label = $('label').html(this.caption)[0];
			this.btnClose = $('div').setCls(this.btnCloseCls)[0];
			this.on(this.btnClose,'click',function(){
				_this.onClose();
			});
			this.head.appendChild(this.label);
			this.head.appendChild(this.btnClose);
			this.body = $('div').setCls(this.bodyCls)[0];
			this.setContent(this.template);
			this.dialog.appendChild(this.head);
			this.dialog.appendChild(this.body);
			this.createShadow();
			document.body.appendChild(this.shadow);
			document.body.appendChild(this.dialog);
			this.moveToCenter();
		},
		destroy : function(){
			this.dialog = null;
			this.head = null;
			this.label = null;
			this.btnClose = null;
			this.body = null;
			this.shadow = null;
		},		
		createShadow : function(){		
			var str = 'position:absolute;left:0px;top:0px;z-index:1' + 
				';width:' + getFullSize().w + px +
				';height:' + getFullSize().h + px +
				';background:' + this.shadowBg +
				';opacity:' + this.shadowOpy +
				';filter:Alpha(Opacity=' + this.shadowOpy*100 + ');';
			var _this = this;	
			this.shadow = $("div").setCls('md-shadow').css(str)[0];				
			this.on(window,'resize',function(){
				_this.shadow.style.width = getFullSize().w + px;
				_this.shadow.style.height = getFullSize().h + px;
				_this.moveToCenter();	
			});			
		},
		moveTo : function(x, y){
			this.dialog.style.left = x + px;
			this.dialog.style.top = y + px;
		},
		moveToCenter : function(){
			var size = getViewSize();
			var x = (size.w-50)/2 - (this.dialog.clientWidth-50)/2;
			var y = (size.h- 50)/2 - (this.dialog.clientHeight-50)/2 + document.documentElement.scrollTop;
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
		onClose : function(){
			document.body.removeChild(this.dialog);
			document.body.removeChild(this.shadow);
			this.destroy();		
		},
		on : function(el, type, fn){
			el.addEventListener ? 
				el.addEventListener(type, fn, false) :
			el.attachEvent ?
				el.attachEvent("on" + type, fn) :
			el['on'+type] = fn;
		},
		un : function(el,type,fn){
			el.removeEventListener ?
				el.removeEventListener(type, fn, false) :
			el.detachEvent ?
				el.detachEvent("on" + type, fn) :
			el['on'+type] = null;
		}
	}
	return ModelDialog;
}();
