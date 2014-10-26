/**
 * 图片播放插件
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
 * 
 * $(xx).slide(opt);
 * 
 */
	
$.fn.slide = function(opt) {
	
	var picWidth = opt.picWidth,
		picHeight = opt.picHeight,
		pictures = opt.pictures,
		picLength = pictures.length,
		countOfShow = opt.countOfShow || 2,
		interval = opt.interval || 5000;
	
	// 图片容器  强制不换行以便产生scrollLeft
	var $div = $('<div>')
				.css('float', 'left')
				.css('margin', '0 10px')
				.css('overflow', 'hidden')
				.css('whiteSpace', 'nowrap');
	
	$(pictures).each(function(idx, url) {
		if(idx != 0) {
			$('<img>')
				.attr('src', url)
				.css('marginLeft', 10)
				.css('cursor', 'pointer')
				.appendTo($div);
		}else {
			$('<img>')
				.attr('src', url)
				.css('cursor', 'pointer')
				.appendTo($div);
		}
	});

	var leftArrow = $('<img style="float:left;position:relative;top:15px;cursor:pointer;" src="img/left.png">'),
		rightArrow = $('<img style="float:left;position:relative;top:15px;cursor:pointer;" src="img/right.png">');

	$div.height(picHeight + 5)
		.width(picWidth * countOfShow + 10 * (countOfShow-1));
		
	$('<div>')
		.append(leftArrow)
		.append($div)
		.append(rightArrow)
		.appendTo(this);
	
	var unit = picWidth + 10;
	var timerInterval, timerTimeout;
	
	// 初始化按钮样式
	rightArrow.css('opacity', 0.5);
	rightArrow.css('cursor', '');
	
	function goLeft() {
		if($div[0].scrollLeft == (picLength-countOfShow)*unit) {
			leftArrow.css('opacity', 0.5);
			leftArrow.css('cursor', '');
		}
		// $div[0].scrollLeft += unit;
		var slet = $div[0].scrollLeft + unit
		$div.animate({
			scrollLeft: slet
		})
		rightArrow.css('opacity', '');
		rightArrow.css('cursor', 'pointer');
	}
	
	function goRight() {
		if($div[0].scrollLeft <= 0) {
			rightArrow.css('opacity', 0.5);
			rightArrow.css('cursor', '');
		}
		// $div[0].scrollLeft -= unit;
		var slet = $div[0].scrollLeft - unit
		$div.animate({
			scrollLeft: slet
		})
		leftArrow.css('opacity', '');
		leftArrow.css('cursor', 'pointer');
	}
	
	// 左右箭头图标
	leftArrow.click(function() {
		goLeft();
		stopAutoPlay();
	});
	rightArrow.click(function() {
		goRight();
		stopAutoPlay();
	});
	
	$div.mouseover(function(){
		clearInterval(timerInterval);
	});
	$div.mouseout(autoPlay);
	
	// 鼠标滚轮操作
	var mouseScroll = $.support.boxSizing ? 'DOMMouseScroll' : 'mousewheel'; //针对不同的浏览器选择不同的事件名称
	$div.on(mouseScroll, function(e) {
		var evt = e.originalEvent;
		var wheelDelta = typeof evt.wheelDelta === 'number' ? -evt.wheelDelta : evt.detail;
		if(wheelDelta > 0) {
			leftArrow.click();
		}else {
			rightArrow.click();
		}
	});
	
	function autoPlay() {
		if(interval) {
			clearInterval(timerInterval);
		}
		timerInterval = setInterval(function() {
			if($div[0].scrollLeft == (picLength-countOfShow)*unit) {
				$div[0].scrollLeft = 0;
				return;
			}
			goLeft();
		}, interval);
	}
	
	function stopAutoPlay() {
		clearInterval(timerInterval);
		if(timerTimeout) {
			clearTimeout(timerTimeout);
		}
		timerTimeout = setTimeout(autoPlay, interval);
	}
	
	autoPlay();
}
	
	
