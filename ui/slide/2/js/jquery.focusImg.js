$.fn.focusImg = function(config, imgs) {
	var cur,
		lis,
		curr,
		html,
		timer,
		wrap,
		fittLi,
		thumNum,
		self = $(this),
		speed = config.speed || 5000,
		width = config.width;
		height = config.height;
		showTitle = config.showTitle || false;
		
	if(!imgs.length) {
		return;
	}
		
	html = '<div class="big-pics">' +
			'<div class="big-pic"><ul></ul></div>' +
			'<div class="fi-tts"><p class="tt-bg"></p><div class="fi-tt"><ul><li></li></ul></div></div>' +
			'<div class="thum-nums"><div class="thum-num"></div></div>' +
			'</div>';
	
	wrap = $(html);
	if (width) {
		wrap.width(width);
	}
	if (height) {
		wrap.height(height);
	}
	fittLi = wrap.find('.fi-tt li');
	thumNum = wrap.find('.thum-num');
	
	function changePic(i) {
		var obj   = imgs[i],
			link  = obj.l,
			src   = obj.p,
			title = obj.t;
			
		if (typeof curr != 'undefined') {
			lis.eq(curr).hide();
		}
		lis.eq(i).fadeIn(1000);
		curr = i;
		fittLi.html('<h3><a target="_blank" href="' +  link + '">' + title + '</a></h3>');
	}
	
	function initilize() {
		var $ul = wrap.find('.big-pic ul');
		$(imgs).each(function(i, it) {
			$ul.append('<li style="display:none"><a target="_blank" href="' + it.l + '"><img src="' + it.p + '"/></a>');
			thumNum.append('<span>' + (i+1) + '</span>');
			if (i===0) {
				cur = thumNum.find('span').addClass('cur');
			}
		});
		lis = $ul.find('li');
		
		// init first pic
		changePic(0);
		self.append(wrap);
		addEvent();
		play();
	}

	// auto play
	function play() {
		timer = setInterval(function() {
			var next = cur.next();
			if (!next[0]) {
				next = thumNum.find('span').first();
			}
			cur.removeClass('cur');
			next.addClass('cur');
			changePic(next[0].innerHTML - 1);
			cur = next;
		}, speed);
	}
	
	function stopPlay() {
		clearInterval(timer);
	}
	
	function addEvent() {
		wrap.parent().hover(stopPlay, play);
		
		thumNum.delegate('span', 'click', function(e) {
			e.preventDefault();
			cur.removeClass('cur');
			cur = jQuery(this).addClass('cur');
			changePic(cur[0].innerHTML - 1)
		});
	}
	
	// append to the element
	initilize();
	
};
