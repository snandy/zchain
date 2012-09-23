/**
 * JavaScript Dragdrop Library v0.2
 * Copyright (c) 2010 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2010-09-06
 * 
 * 
 * 简单拖拽
 * Dragdrop(HTMLElement); 
 * 
 * 禁止水平方向拖拽
 * Dragdrop(HTMLElement,{dragX:false}); 
 * 
 * 禁止垂直方向拖拽
 * Dragdrop(HTMLElement,{dragY:false}); 
 * 
 * 禁止拖出指定范围
 * Dragdrop(ele, {
 * 		area : [minX, maxX, minY, maxY]
 * });
 * 
 * bridge参数指定在哪个html元素按下（keydown）时拖拽
 * Dragdrop(this.dialog,{bridge:this.head});
 * 
 */

var Dragdrop = function(){
	var E = {
		on : function(el, type, fn){
			el.addEventListener ?
				el.addEventListener(type, fn, false) :
				el.attachEvent("on" + type, fn);
		},
		un : function(el,type,fn){
			el.removeEventListener ?
				el.removeEventListener(type, fn, false) :
				el.detachEvent("on" + type, fn);
		},
		evt : function(e){
			return e || window.event;
		}
	};
	return function(el,opt){
		var ele, diffX, diffY, dragX=true,dragY=true, minX, maxX, minY, maxY, bridge;
		ele = el;
		opt && opt.dragX===false && (dragX=false);
		opt && opt.dragY===false && (dragY=false);
		opt && opt.area && typeof opt.area[0]==='number' && (minX=opt.area[0]);
		opt && opt.area && typeof opt.area[1]==='number' && (maxX=opt.area[1]);
		opt && opt.area && typeof opt.area[2]==='number' && (minY=opt.area[2]);
		opt && opt.area && typeof opt.area[3]==='number' && (maxY=opt.area[3]);
		opt && opt.bridge && (bridge=opt.bridge);

		ele.style.position = 'absolute';
		bridge ?
			E.on(bridge,'mousedown',mousedown) :
			E.on(ele,'mousedown',mousedown);
	
		function mousedown(e){
			e = E.evt(e);
			ele.style.cursor = 'pointer';
			if(ele.setCapture){//IE
				E.on(ele, "losecapture", mouseup);
				ele.setCapture();
				e.cancelBubble = true; //IE
			}else if(window.captureEvents){//标准DOM
				e.stopPropagation();
				E.on(window, "blur", mouseup);
				e.preventDefault();
			}
			_x = e.clientX;
			_y = e.clientY;
			diffX = e.clientX - ele.offsetLeft;
			diffY = e.clientY - ele.offsetTop;
			E.on(document,'mousemove',mousemove);
			E.on(document,'mouseup',mouseup);
		}
		function mousemove(e){
			e = E.evt(e);
			var moveX = e.clientX - diffX,
				moveY = e.clientY - diffY;
			moveX < minX && (moveX = minX); // left 最小值
			moveX > maxX && (moveX = maxX); // left 最大值
			moveY < minY && (moveY = minY); // top 最小值
			moveY > maxY && (moveY = maxY); // top 最大值
			
			dragX && (ele.style.left = moveX + 'px');
			dragY && (ele.style.top =  moveY + 'px');
		}
		function mouseup(e){
			ele.style.cursor = 'default';			
			E.un(document,'mousemove',mousemove);
			E.un(document,'mouseup',mouseup);
			if(ele.releaseCapture){//IE
				E.un(ele, "losecapture", mouseup);
				ele.releaseCapture();
			}
			if(window.releaseEvents){//标准DOM
				E.un(window, "blur", mouseup);
			}
		}		
	}

}();
