/**
 * SlideShow 图片播放组件
 * 
 * example:
 * 
 * var opt = {
 * 	  picWidth:
 * 	  picHeight:
 *    pictures:
 *    picLength:
 *    countOfShow:
 *    interval:
 * }
 * var ss = new SlideShow(el, opt);
 */

SlideShow = function() {

// 特性检测
var support = function() {
    
    var div, a;
    div = document.createElement( 'div' );
    div.innerHTML = '<a href="#" style="opacity:.45;float:left;">a</a>';
    
    a = div.getElementsByTagName('a')[0];
    
    return {
        opacity : /^0.45$/.test(a.style.opacity),
        cssFloat : !!a.style.cssFloat,
        firefox: /Firefox/.test(navigator.userAgent)
    };
    
}();

// util method
var w3c = !!document.addEventListener,
	
	$C = function(tag) {
		return document.createElement(tag);
	},
	
	setStyle = function(el, obj) {
		var origkey;
		for(var key in obj) {
			if(key=='float') {
				origkey = support.cssFloat ? 'cssFloat' : 'styleFloat';
				el.style[origkey] = obj[key];
				
			}else if(key=='opacity') {
				var val = obj[key];
				if(support.opacity) {
					el.style.opacity = (val === 1 ? '' : '' + val);
				}else {
					el.style.filter = 'alpha(opacity=' + val * 100 + ')';
					el.style.zoom = 1;
				}
				
			}else {
				el.style[key] = obj[key];
			}
			
		}
	},
	
	addListener = w3c ?
		function(el, t, fn) { el.addEventListener(t, fn, false); } :
		function(el, t, fn) { el.attachEvent('on' + t, fn); },
		
	triggerClick = function(el) {
		if(el.click) {
			el.click();
		}else{
			try{
				var evt = document.createEvent('Event');
				evt.initEvent('click',true,true);
				el.dispatchEvent(evt);
			}catch(e){alert(e)};
		}
	};

function SlideShow(el, opt) {
	// 目标div
	this.target = el || document.body;
	// 图片宽度
	this.picWidth = opt.picWidth || 0;
	// 图片高度
	this.picHeight = opt.picHeight || 0;
	// 图片url
	this.pictures = opt.pictures || [];
	// 图片数量
	this.picLength = pictures.length;
	// 显示图片的数量
	this.countOfShow = opt.countOfShow || 2;
	// 自动播放时间间隔
	this.interval = opt.interval || 5000;
	
	this.timerTimeout = this.timerInterval = null;
	
	this.unit = this.picWidth + 10;
	
	this.init();
}
SlideShow.prototype = {
	init: function() {
		var picContainer = this.picContainer = $C('div');
		setStyle(picContainer, {
			'float': 'left',
			marginLeft: '10px',
			marginRight: '10px',
			overflow: 'hidden',
			whiteSpace: 'nowrap',
			height: (this.picHeight + 5) + 'px',
			width: ( this.picWidth * this.countOfShow + 10 * (this.countOfShow-1) ) + 'px'
		});
		
		var leftArrow = this.leftArrow = $C('img');
		setStyle(leftArrow, {
			'float': 'left',
			cursor: 'pointer',
			position: 'relative',
			top: '15px'
		});
		var rightArrow = this.rightArrow = leftArrow.cloneNode(false);
		leftArrow.src = 'img/left.png';
		rightArrow.src = 'img/right.png';
		
		for(var i=0; i<this.picLength; i++) {
			var img = $C('img');
			img.src = this.pictures[i];
			img.style.cursor = 'pointer';
			if(i!=0) {
				img.style.marginLeft = '10px';
			}
			picContainer.appendChild(img);
		}
		
		var tempDiv = $C('div');
		tempDiv.appendChild(leftArrow);
		tempDiv.appendChild(picContainer);
		tempDiv.appendChild(rightArrow);
		this.target.appendChild(tempDiv);
		
		// 初始化按钮样式
		setStyle(rightArrow, {
			opacity: 0.5,
			cursor: ''
		});
		
		var me = this;
		
		// 左右方向箭头添加事件
		addListener(leftArrow, 'click', function() {
			me.goLeft();
			me.stopAutoPlay();
		});
		addListener(rightArrow, 'click', function() {
			me.goRight();
			me.stopAutoPlay();
		});
		
		// 鼠标滚轮事件
		var mouseScroll = support.firefox ? 'DOMMouseScroll' : 'mousewheel';
		addListener(picContainer, mouseScroll, function(evt) {
			var wheelDelta = typeof evt.wheelDelta === 'number' ? -evt.wheelDelta : evt.detail;
			if(wheelDelta > 0) {
				triggerClick(leftArrow);
			}else {
				triggerClick(rightArrow);
			}
		});
		
		// 鼠标放上时停止播放，离开后播放
		addListener(picContainer, 'mouseover', function(){
			clearInterval(me.timerInterval);
		});
		addListener(picContainer, 'mouseout', function(){
			me.autoPlay();
		});
		
		this.autoPlay();
	},
	goLeft: function() {
		var picContainer = this.picContainer,
			leftArrow = this.leftArrow,
			rightArrow = this.rightArrow;
		
		if(picContainer.scrollLeft == (this.picLength-this.countOfShow)*this.unit) {
			setStyle(leftArrow, {
				opacity: 0.5,
				cursor: ''
			});
		}
		picContainer.scrollLeft += this.unit;
		setStyle(rightArrow, {
			opacity: '',
			cursor: 'pointer'
		});
	},
	goRight: function() {
		var picContainer = this.picContainer,
			leftArrow = this.leftArrow,
			rightArrow = this.rightArrow;
			
		if(picContainer.scrollLeft <= 0) {
			setStyle(rightArrow, {
				opacity: 0.5,
				cursor: ''
			});
		}
		picContainer.scrollLeft -= this.unit;
		setStyle(leftArrow, {
			opacity: '',
			cursor: 'pointer'
		});
	},
	autoPlay: function() {
		var me = this,
			picContainer = this.picContainer;
			
		if(this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		this.timerInterval = setInterval(function() {
			if(picContainer.scrollLeft == (me.picLength-me.countOfShow)*me.unit) {
				picContainer.scrollLeft = 0;
				return;
			}
			me.goLeft();
		}, this.interval);
	},
	stopAutoPlay: function () {
		var me = this;
		clearInterval(this.timerInterval);
		if(this.timerTimeout) {
			clearTimeout(this.timerTimeout);
		}
		this.timerTimeout = setTimeout(function(){
			me.autoPlay();
		}, this.interval);
	}
};

return SlideShow;

}();

