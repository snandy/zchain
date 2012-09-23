// sohu博客时尚二级页
~function($) {$(function() {
	
	// hideArr 是后台写在页面上得图片数据数组类型，如果该变量不存在则直接返回
	if (!window.hideArr) return
	
	// 要求必须是8的整数，否则去掉余数
	hideArr.length = floor(hideArr.length)
	
	// 瀑布流实现
	
	var $win = $(window),
		$doc = $(document),
		$foot = $('#foot'),
		wheight = $win.height()
	
	// 取得4列div	
	var columns = $('.column-list'), pagination = $('.show-eco')
	
	// 去掉整除8后的余数
	function floor(num) {
		return num - num%8
	}
	
	// 按列高度从低到高排序
	function sortCols() {
		var cols = columns.toArray()
		cols.sort(function(a, b) {
			return $(a).height() - $(b).height()
		})
		return cols
	}
	
	// 每次取2行，8张图片数据, 按imgheight从高到底排序，转成jq对象存放于新数组中
	function renderLi(num) {
		var arr = []
		while(num) {
			num--
			arr.push(hideArr.shift())
		}
		arr = arr.sort(function(a, b) {
			return parseInt(b.height, 10) - parseInt(a.height, 10)
		})
		arr = $.map(arr, function(data, i) {
			return joinOneImg(data)
		})
		return arr
	}
	
	// 拼凑一张图片的html
	function joinOneImg(obj) {
		if (!obj) return
		var url = obj.url || '', 
			image = obj.image || '', 
			title = obj.title || '',
			forward = obj.forward || '',
			comment = obj.comment || '',
			blogerurl = obj.blogerurl || '',
			icon = obj.icon || '',
			nick = obj.nick || ''
			
		var str = '<li style="display:none">' +
			'<div class="pic-wrap">' +
				'<a target="_blank" href="' + url + '">' +
					'<img src="' + image + '">' +
				'</a>' +
			'</div>' +
			'<div class="share-content">' + 
				'<a target="_blank" href="' + url + '">' + title + '</a>' +
			'</div>' +
			'<div class="data-block">' + 
				'<span class="forward">' +
					'<a href="' + url + '">转发 <strong>' + forward + '</strong></a>' +
				'</span>' +
				'<span class="comment">' +
					'<a href="' + url + '">评论 <strong>' + comment + '</strong></a>' +
				'</span>' +
			'</div>' +
			'<div class="user-block">' + 
				'<div class="user-pho">' +
					'<a target="_blank" href="' + blogerurl + '">' + 
						'<img src="' + icon + '"/>' +
					'</a>' +
				'</div>' +
				'<h4><a target="_blank" href="' + blogerurl + '">' + nick + '</a></h4>' +
			'</div>' + '</li>'
			
		return $(str)
	}
	
	// 把最高的图片放在最低的列中，为提高粒度剩下的16张开始每次取4张添加以保证各列高度均匀
	function render(uls) {
		var arr
		if (hideArr.length > 16) {
			arr = renderLi(8)
			uls[0].append(arr[0]).append(arr[1])
			uls[1].append(arr[2]).append(arr[3])
			uls[2].append(arr[4]).append(arr[5])
			uls[3].append(arr[6]).append(arr[7])
		} else {
			arr = renderLi(4)
			uls[0].append(arr[0])
			uls[1].append(arr[1])
			uls[2].append(arr[2])
			uls[3].append(arr[3])
		}
		// 图片淡出
		$(arr).each(function(i, li) {
			li.fadeIn(1000)
		})
	}
	
	// 防止弹跳，避免scroll时频繁调用
	function debounce(fn, wait) {
		var timer
		return function() {
			var later = function() {
				timer = null
				fn(arguments)
			}
			clearTimeout(timer)
			timer = setTimeout(later, wait)
		}
	}
	
	function scrollFn() {
		// 数据取完后直接返回
		if (hideArr.length === 0) {
			pagination.show()
			return
		}
		
		var diff = $.browser.msie ? 300 : 350
		var ftop = $foot.offset().top
		var dTop = $doc.scrollTop()
		var cols = sortCols()
		
		var uls = $.map(cols, function(div, i) {
			return $(div).find('ul')
		})
		// 拖动到最后一行图片时
		if (ftop - dTop < wheight+diff) {
			render(uls)
		}
	}
	
	// 添加事件
	columns.delegate('li', 'mouseenter', function() {
		$(this).addClass('hover')
			.find('.data-block').show()
	}).delegate('li', 'mouseleave', function() {
		$(this).removeClass('hover')
			.find('.data-block').hide()
	})
	$win.scroll(debounce(scrollFn, 100))

})}(jQuery)
