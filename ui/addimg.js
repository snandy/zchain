/**
 * 新老博客最终页图片加上“保存到相册”按钮
 * @snandy 2012-09-06
 */

(function($, exports) {

var $win = $(exports), $doc = $(exports.document), ie6 = $.browser.version == '6.0'

var dialog = function() {
	var viewSize = getViewSize()
	var $el = $(
		'<div class="poping-yuntu">' +
		'<div class="poping-yuntu-wrapper">' +
			'<div class="bf-header">' +
				'<a href="javascript://" class="btn-close"></a>' +
				'<p></p>' +
			'</div>' +
			'<div class="bf-body">' +
			'</div>' +
		'</div></div>'
	)
	var $shadow = $('<div class="poping-mask"></div>').width(viewSize.w).height(viewSize.h)
	document.body.appendChild($shadow[0])
	document.body.appendChild($el[0])
	
	function getViewSize() {
		return {
			w: $win.width(),
			h: $win.height()
		}
	}
	function bind() {
		$el.delegate('a.btn-close', 'click', function() {
			dialog.close()
		})
	}
	// handers
	function resizeHandler() {
		var size = getViewSize()
		dialog.moveCenter()
		$shadow.width(size.w).height(size.h)
	}
	function scrollHandler() {
		dialog.moveCenter()
	}

	return {
		el: $el,
		open: function() {
			$shadow.show()
			$el.show()
			this.moveCenter()
			bind()
			if (ie6) {
				$win.scroll(scrollHandler)
			}
			$win.resize(resizeHandler)
		},
		close: function() {
			$shadow.hide()
			$el.hide()
			if (ie6) {
				$win.unbind('scroll', scrollHandler)
			}
			$win.unbind('resize', resizeHandler)
		},
		moveCenter: function() {
			var size = getViewSize(), el = $el[0]
			var x = (size.w-50)/2 - (el.clientWidth-50)/2
			var y = (size.h- 50)/2 - (el.clientHeight-50)/2
			if (ie6) {
				el.style.position = 'absolute'
				y = (size.h- 50)/2 - (el.clientHeight-50)/2 + document.documentElement.scrollTop
			}
			el.style.left = x + 'px'
			el.style.top = y + 'px'
		}
	}
}()

var blog = function() {
	// 工具url区分新博客，老博客
	var isNew = exports.location.href.indexOf('i.sohu.com') != -1
	var mysohu    = exports.mysohu
	var savePhoto, title
	
	if (isNew) {
		title = $('.blog-article-box h1').first().text()
	} else {
		title = $('#entry h3').text()
	}
	savePhoto = function(src) {
		var str, $el = dialog.el
		var img = '<a href="" target="_blank"><img src=""></a>', arrImg = []
		arrImg.push(img)
		arrImg.push(img)
		arrImg.push(img)
		dialog.open()
		
		var fillImg = function(imgs, arr) {
			imgs[0].src = arr[0] || defPhoto
			imgs[1].src = arr[1] || defPhoto
			imgs[2].src = arr[2] || defPhoto
		}
		var fillNum = function(json) {
			var $p = $el.find('.bf-body .txt p')
			if (json.status) {
				$p.removeClass('error')
				if (json.data.photo_count === undefined) {
					$p.find('span').eq(0).html('已保存到相册')
				}
			} else {
				$p.addClass('error')
				$p.find('span').eq(0)
				  .css('color', 'red')
				  .html('保存已满10次，登录获5G空间永久保存')
			}
		}
		function progress() {
			var str = '<p class="progress">' +
						'<img src="http://s3.suc.itc.cn/app/tophoto/d/progress.gif">' +
					  '</p>' + 
					  '<h2 class="progress">图片正在保存到相册，请稍候。</h2>'
			$el.find('.bf-body').html(str)
		}
		function success(json) {
			var folderUrl = json.data.folder_url,
				$body = $el.find('.bf-body')
			var str = '<div class="img">' + arrImg.join('') + '</div>' +
					  '<div class="txt">' +
						'<p>' +
							'<a href="' + folderUrl + '" target="_blank">查看更多>></a>' +
							'<span>还能保存<span class="num"></span>张，登录获5G空间永久保存</span>' +
						'</p>' +
					  '</div>'
			$body.html(str)
			$body.find('.img a').attr('href', folderUrl)
			var imgs = $body.find('img')
			if (json.status) {
				var pcount = json.data.photo_count
				$body.find('.num').html(10-pcount)
			}
			fillImg(imgs, json.data.recent_photos)
			fillNum(json)
			// 4秒后自动关闭
			setTimeout(function() {
				dialog.close()
			}, 4000)
		}
		
		var url = 'http://pp.sohu.com/upload/site?callback=?', data = {url: src, desc: blog.title, from: 'sohublog'}
		progress()
		$.getJSON(url, data, success)
	}
	return {
		title: title,
		isNew: isNew,
		savePhoto: savePhoto
	}
}()

var baseUrl  = 'http://s3.suc.itc.cn/app/tophoto/d/',
	defUrl   =  baseUrl + 'btn1.png',
	defPhoto =  baseUrl + 'default_photo.jpg', 
	btnCls   = '.add-photos'
	
var mvc = function() {
	function setBG($el) {
		$el.css('background', 'url(' + defUrl + ') no-repeat transparent')
	}
	function delay(func, wait) {
		var args = Array.prototype.slice.call(arguments, 2)
		return setTimeout(function(){ return func.apply(null, args) }, wait)
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
	// 生成添加到相册按钮
	function renderView($container) {
		// constants
		var OFFSETLEFT = 125, OFFSETTOP = 38, MINWIDTH = 120, MINHEIGHT = 40
		var $imgs  = $container.find('img')
		
		function Button() {
			var style = {
				display: 'none',
				cursor: 'pointer',
				position: 'absolute',
				width: '114px',
				height: '29px'
			}
			var $btn = $('<div>').css(style).addClass(btnCls.replace('.',''))
			return $btn
		}
		// 取最近的块级父元素
		function getRecentBlockElement($el) {
			var parent = $el.parent()
			while (parent.css('display') != 'block') {
				parent = parent.parent()
			}
			return parent
		}
		function addToPhoto($img) {
			var p   = $img.position(),
				w   = $img.width(),
				h   = $img.height(),
				brow  = $.browser,
				bLeft = p.left+w-OFFSETLEFT,
				bTop  = p.top+h-OFFSETTOP,
				$btn  = Button()
			
			// 兼容老博客图片居中在ie9/chrome中的bug. 居中图片将img的display改为了block导致bug
			var shitBrowser = (brow.msie&&brow.version=='9.0') || /chrome/g.test(navigator.userAgent.toLowerCase())
			if ($img.css('text-align') == 'center' && shitBrowser) {
				var pwidth = getRecentBlockElement($img).width()
				// 图片宽度减去 按钮宽度（114），再减去偏移图片右侧10px
				var diff = w-114-10
				bLeft = (pwidth-w)/2 + diff
			}
			$btn.css({
				left: bLeft + 'px',
				top: bTop + 'px'
			}).data('img', $img).data('purl', $img.attr('src'))
			
			$container.append($btn)
			
			// 图片高度小于40或宽度小于120不展示“保存到相册”按钮
			if ( w<MINWIDTH || h<MINHEIGHT ) {return}
			
			// 图片200*300px或者300*200px
			if ( (h>=200&&w>=300) || (h>=300&&w>=200) ) {				// $img.mouseenter(function() {
					$btn.show()
					setBG($btn)
				// }).mouseleave(function(e) {
					// if (e.relatedTarget != $btn[0]) {
						// $btn.hide()
					// }
				// })
			}
		}
		// 前5张直接显示
		$imgs.slice(0,5).each(function(i, img) {
			var $img = $(img)
			img.onload = function() {
				delay(addToPhoto, 1000, $img)
				$img.data('added', true)
			}
			// IE低版本有缓存后不再触发load事件，延迟3秒（假设图片已下载完成）添加按钮
			delay(function() {
				var isAdded = $img.data('added')
				if (isAdded) {return}
				addToPhoto($img)
			}, 3000)
		})
		// 第六张以后的图片随滚动条滚动而加载
		var $imgs = $imgs.slice(5)
		var scrollFn = function() {
			var fTop, dTop, $img = $imgs.eq(0)
			if ( $img.length===0 || $img.data('added') ) {
				return
			}
			fTop = $img.offset().top
			dTop = $doc.scrollTop()
			addToPhoto($img)
			$img.data('added', true)
			$imgs.splice(0, 1)
		}
		$win.scroll(debounce(scrollFn, 100))
	}
	// 控制器
	function controller($container) {
		$container.delegate(btnCls, 'click', function(e) {
			var purl = $(this).data('purl')
			blog.savePhoto(purl)
		})
	}
	
	return {
		init: function($container) {
			renderView($container)
			controller($container)
		}
	}
}()

$.saveToPhoto = function(config) {
	var container = config.container
	if (!container) {return}	
	var $container = $(container)
	$container.css('position', 'relative')
	mvc.init($container)
}

var config
if (blog.isNew) {
	config = {container: '#blogarticlefont'}
} else {
	config = {container: '#main-content'}
}
$.saveToPhoto(config)

})(jQuery, this)
