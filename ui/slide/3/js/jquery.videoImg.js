jQuery.fn.videoImg = function(config, imgs) {
	
	if(!imgs.length) {
		return;
	}
	var unit = 108;
	var len  = imgs.length;
	
	// 一次显示的图片数量， 默认8张
	var shows = config.shows || 8;
	// 是否自动播放
	var autoPlay = config.autoPlay || false;
	// 自动播放时间间隔，默认为1500ms
	var autoPlayTime = config.autoPlayTime || 1500;
	// 点击左右按钮移动图片的数量，默认为1张
	var moveCount = config.moveCount || 2;
	// 移动时动画持续时间，越短速度越快
	var duration = config.duration || 600;
	
	var self = this;
	
	var buildLi = function(o) {
		var str = '<li>'                                                               +
					 '<div class="pic">'                                               +
					 	'<a href="' + o.link + '" target="_blank">'                    +
					 	'<img src="' + o.src + '"/>'                                   +
					 	'</a>'                                                         +
					 '</div>'                                                          +
					 '<p>'                                                             +
						'<a target="_blank" href="' + o.link + '">' + o.title + '</a>' +
					 '</p>'                                                            +
				  '</li>';
		
		return str;
	};
	
	var init = function() {
		var arr = [];
		for (var i=0; i<len; i++) {
			arr.push(buildLi(imgs[i]));
		}
		self.find('ul').html(arr.join(''));

		
	};
	
	init();

	var $ul = self.find('ul');	
	var	leftBtn = self.find('.s-btn').first(),
		rightBtn = self.find('.s-btn').last();
	
	var intLeft, intRight, direction;

	function handerLeft() {
		if (len!=imgs.length) {
			len += moveCount;
			$ul.animate({
				left: '+=' + unit * moveCount
			}, duration);
			rightBtn.removeClass('s-btn-right-forbid');
		} else {

			leftBtn.addClass('s-btn-left-forbid');
		}		
	}	

	function handerRight() {
		if (len>shows) {
			len-=moveCount;
			$ul.animate({
				left: '-=' + unit * moveCount
			}, duration);
			leftBtn.removeClass('s-btn-left-forbid');

		} else {
			rightBtn.addClass('s-btn-right-forbid');
		}
	}
	
	// 点击移动
	leftBtn.click(function() {
		stopPlay();
		handerLeft();
		play();
		
	});
	rightBtn.click(function() {
		stopPlay();
		handerRight();
		play();
	});
	
	// 鼠标置上时停止自动播放，离开时恢复
	$ul.hover(stopPlay, play);
	
	function play() {
		if (direction==='left') {
			goLeft();
		} else if(direction==='right') {
			goRight();
		}
	}
	
	function goLeft() {
		direction = 'left';
		intLeft = setInterval(function() {
			if (len === imgs.length) {
				clearInterval(intLeft);
				goRight();
				return;
			}
			handerLeft();
			
		}, autoPlayTime);
	}

	function goRight() {
		direction = 'right';
		intRight = setInterval(function() {
			if(len === shows) {
				clearInterval(intRight);
				goLeft();
				return;
			}
			handerRight();
			
		}, autoPlayTime);
	}

	function stopPlay() {
		clearInterval(intLeft);
		clearInterval(intRight);
	}
	
	if (autoPlay) {
		goRight();
	}
	
}
