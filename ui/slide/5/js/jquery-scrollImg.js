$.fn.scrollImg = function(config, imgs) {
	
	var inTime = config.inTime || 1500,
		playInterval = config.playInterval || 5000
	
	var htmlStr    = '',
		group      = 0,
		processAry = [],
		processLen = 0,
		curr       = 0,
		currData   = [],
		interval   = null,
		len        = imgs.length
	
	var self     = $(this),
		ul       = self.find('ul'),
		btnLeft  = self.find('.pre'),
		btnRight = self.find('.next'),
		wraper   = self.find('.photo-list-wrapper')
	
	if (!len) {
		return
	}
	
	// 保证传入的数组是3的整数倍，如果不是则舍去余数
	if ( (remainder = len % 5) != 0 ) {
		len = imgs.length = imgs.length - remainder
	}
	
	// 计算有多少组
	group = len / 5
	
	// 对数据进行加工，生成一个二维数组
	processAry = function(){
		var res = [];
		for (var i=0; i<group; i++) {
			var temp = imgs.slice(i*5, (i+1)*5)
			res.push(temp)
		}
		currData = res[0]
		return res
	}()
	
	processLen = processAry.length
	
	function buildLi(o, i) {
		i++;
		var str =
			'<li class="no' + i + '">' +
				'<a href="' + o.a + '">' + 
					'<img src="' + o.s + '"/>' + 
				'</a>' +
				'<div class="txt-bg"></div>' +
				'<div class="txt">' +
					'<h2>' + o.n + '</h2>' +
					'<p>' + o.d + '</p>' +
				'</div>' +
			'</li>'
		
		return str
	}
	
	function renderUl() {
		htmlStr = $.map(currData, function(o, i) {
			return buildLi(o, i);
		}).join('')
		ul.html(htmlStr);
		wraper.fadeOut();
		wraper.fadeIn(inTime);
	}
	
	function getData(idx) {
		return processAry[idx]
	}
	
	// 初始化事件
	function initEvent() {
		self
		.delegate('li', 'mouseenter', function() {
			$(this).addClass('hover')
		})
		.delegate('li', 'mouseleave', function() {
			$(this).removeClass('hover')
		})
		.delegate('.pre', 'click', function(e) {
			e.preventDefault()
			curr--
			if (curr<0) {
				curr = processLen - 1
			}
			currData = getData(curr)
			renderUl()
		})
		.delegate('.next', 'click', function(e) {
			e.preventDefault();
			curr++;
			if (curr==processLen) {
				curr = 0
			}
			currData = getData(curr);
			renderUl();
		})
		.delegate('li, .pre, .next', 'mouseenter', function() {
			stop()
		})
		.delegate('li, .pre, .next', 'mouseleave', function() {
			play()
		})
	}
	
	// 自动播放
	function play() {
		interval = setInterval(function() {
			btnRight.click()
		}, playInterval)
	}
	
	// 停止播放
	function stop() {
		clearInterval(interval);
	}
	
	// 初始化
	function start() {
		renderUl()
		initEvent()
		play()
	}
	
	start()
	
}