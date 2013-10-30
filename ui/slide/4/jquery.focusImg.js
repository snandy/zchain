(function($) {
	
$.fn.focusImg = function(config, imgs) {
	var IMG_COUNT = 3,
		IMG_UNIT  = 84;

	var imgShow,
		imgThum,
		showLis,
		thumLis,
		currShowLi,
		currThumLi;
	
	// 动画等配置参数
	var	len       = imgs.length,
		fadeNum   = config.fadeNum || 800,
		autoNum   = config.autoNum || 2000,
		effectNum = config.effectNum || 400;

	var timer, idx = 0, remainder;
	
	if (!len) {
		return;
	}
	
	// 保证传入的数组是3的整数倍，如果不是则舍去余数
	if (remainder=len%IMG_COUNT != 0) {
		len = imgs.length = imgs.length - remainder;
	}
	
	// dom元素
	self     = $(this);
	imgShow  = self.find('.img-show ul');
	imgThum  = self.find('.img-thum ul');
	btnRight = self.find('.btn-f-right');
	
	// 生成单个大图
	function buildShow(o, i) {
		var li = '<li' + (i!=0 ? ' style="display:none"' : '') + '>' +
					'<a href="' + o.h + '" target="_blank">' +
						'<img src="' + o.b + '"/>' +
					'</a>' +
					'<span class="con">' +
						'<a href="' + o.h + '" target="_blank">' + o.t + '</a>' +
					'</span>' +
					'<span class="bg"></span>' +
				 '</li>';
		return li;
	}

	// 生成单个小图
	function buildThum(o, i) {
		var li = '<li' + ' data-idx="' + i + '">' +
					'<div class="pic' + (i==0 ? ' cur"' : '"') + '>' +
						'<a href="' + o.h + '" target="_blank">' +
							'<img src="' + o.s + '"/>' +
						'</a>' +
					'</div>' +
					'<div class="txt">' +
						'<a href="' + o.h + '" target="_blank">' + o.t + '</a>' +
					'</div>' +
				 '</li>';
		return li;
	}

	// 恢复到初始状态
	function setDefaultStatus() {
		idx = 0;
		switchPic(true);
		imgThum.animate({
			left: 0
		}, effectNum);
	}
	
	// 设置为选定图片
	function setActive(li) {
		if (currThumLi[0] == li[0]) {
			return;
		}
		idx = li.attr('data-idx');
		change();
	}
	
	// 根据idx切换图片
	function change() {
		var show = showLis.eq(idx);
		var thum = thumLis.eq(idx);
		
		if (currShowLi) {
			currShowLi.fadeOut(300);
		}
		if (currThumLi) {
			currThumLi.find('.pic').removeClass('cur');
		}
		show.fadeIn(fadeNum);
		thum.find('.pic').addClass('cur');
		currShowLi = show;
		currThumLi = thum;
	}
	
	// 核心函数，图片切换
	function switchPic(isLeft) {
		change();
		if (isLeft) {
			moveLeft(idx);
		} else {
			moveRight(idx);	
		}
	}
	
	// 向右移动
	function moveRight(idx) {
		var kk = idx + 1;
		if (kk!=1 && kk%IMG_COUNT == 0) {
			imgThum.animate({
				left: '+=' + IMG_UNIT * IMG_COUNT
			}, effectNum);
		}
	}
	
	// 向左移动
	function moveLeft(idx) {
		var kk = idx + 1;
		if (kk!=1 && kk%IMG_COUNT == 1) {
			imgThum.animate({
				left: '-=' + IMG_UNIT * IMG_COUNT
			}, effectNum);
		}
	}
	
	// 自动播放焦点图
	function play() {
		timer = setInterval(function() {
			if (idx==len-1) {
				setDefaultStatus();
			} else {
				btnRight.click();
			}
		}, autoNum);
	}
	// 停止播放焦点图
	function stop() {
		clearInterval(timer);
	}

	// 生成焦点图html片段结构，添加事件
	function initilize() {
		$(imgs).each(function(i, it) {
			imgShow.append(buildShow(it, i));
			imgThum.append(buildThum(it, i));
		});
		self
			.delegate('.btn-f-left', 'click', function() {
				idx--;
				if (idx==-1) {
					idx = 0;
					return;
				}
				switchPic(false);
			})
			.delegate('.btn-f-right', 'click', function() {
				idx++;
				if (idx==len) {
					idx = len-1;
					return;
				}
				switchPic(true);
			})
			.delegate('li, .btn-f-left, .btn-f-right', 'mouseenter', function() {
				stop();
			})
			.delegate('li, .btn-f-left, .btn-f-right', 'mouseleave', function() {
				play();
			})
			.delegate('.img-thum li', 'mouseenter', function() {
				setActive($(this));
			});

		showLis = imgShow.children();
		thumLis = imgThum.children();
		currShowLi = showLis.first();
		currThumLi = thumLis.first();

		setDefaultStatus();
		play();
	}

	initilize();
	
};

})(jQuery);
