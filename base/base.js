// 世界上最短的判断
function isString(obj) {
    return obj+'' === obj
}

function isBoolean(obj) {
    reutrn !!obj === obj
}

function isNumber(obj) {
    return obj === +obj
}

function evalJs(str){
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	try{
		script.appendChild( document.createTextNode(str) );
	}catch(e){
		script.text = str;
	}

	head.insertBefore(script,head.firstChild);
	head.removeChild(script);
}

/*
  isHTMLControl(window/document/div)
  isHTMLControl(new Object)
  isHTMLControl({nodeType:1})
 */
function isHtmlControl(obj) { 

	var d = document.createElement("div");
	try{
		d.appendChild(obj.cloneNode(true));
		return obj.nodeType==1 ? true : false;
	}catch(e){
		return obj==window || obj==document;
	}
}	

var makeArray = function(obj) {
	// IE9/Firefox/Safari/Chrome/Opera
	return slice.call(obj,0);
}
try{
	slice.call(document.documentElement.childNodes, 0)[0].nodeType;
}catch(e){
	// IE6/7/8
	makeArray = function(obj) {
		var res = [];
		for(var i=0,len=obj.length; i<len; i++) {
			res[i] = obj[i];
		}
		return res;

	}
}

// from seajs
function removeComments(code) {
    return code
        .replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n')
        .replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
}


// 预加载JS from <<JavaScript Patterns>>
function preload(url) {
	var obj, body
	if (/*@cc_on!@*/!1) {
		obj = new Image()
		obj.src = url 
	} else {
		obj = document.createElement('object')
		body = document.body
		obj.width = 0
		obj.height = 0
		obj.data = url
		body.appendChild(obj)
	}
}
// preload('http://code.jquery.com/jquery-1.8.0.js')

// 获取flash对象
function thisMovie(movieName) {
	var isIE = /*@cc_on!@*/!1;
	if (isIE) {
		return document.getElementById(movieName);
	} else {
		 return document[movieName];
	}	
}

// 打开窗口且居中
// http://www.extremestudio.ro/blog/open-and-center-window-with-javascript/
// http://stackoverflow.com/questions/6983552/window-open-to-center-of-screen
function open_window(url, width, height) {
   var my_window;

   //screen.width = Desktop Width
   //screen.height = Desktop Height

   var center_left = (screen.width / 2) - (width / 2);
   var center_top = (screen.height / 2) - (height / 2);
   var fes = "width="+width+", height="+height+", left="+center_left+", top="+center_top;
   
   my_window = window.open(url, "Title", fes);
   my_window.focus();
}


// 提取字符串里的单层JSON {key: value}
function pickUpJSON(str) {
	var arr,
		dest = [],
		reg = /{[^{]*}/g
		
	arr = str.match(reg)
	if (!arr.length) return dest
	
	var ast, i = 0
	while (ast=arr[i++]) {
		dest[i-1] = JSON.parse(ast)
	}
	return dest
}
// 匹配一串字符串中出现最多的单词（以空白符或标点符号+空白符来区分单词）

// 将html转成实体
function escape(html){
    var elem = document.createElement('div')
    var txt = document.createTextNode(html)
    elem.appendChild(txt)
    return elem.innerHTML;
}

function unescape(str) {
    var elem = document.createElement('div')
    elem.innerHTML = str
    return elem.innerText || elem.textContent
}
// var txt = escape('<div><a href="">a<b>b</b>c</a></div>');


var keys = Object.keys || function(obj) {
    obj = Object(obj)
    var arr = []    
    for (var a in obj) arr.push(a)
    return arr
}
var invert = function(obj) {
    obj = Object(obj)
    var result = {}
    for (var a in obj) result[obj[a]] = a
    return result
}
var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
}
entityMap.unescape = invert(entityMap.escape)
var entityReg = {
    escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
    unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
}

function escape(html) {
    if (typeof html !== 'string') return ''
    return html.replace(entityReg.escape, function(match) {
        return entityMap.escape[match]
    })
}

function unescape(str) {
    if (typeof str !== 'string') return ''
    return str.replace(entityReg.unescape, function(match) {
        return entityMap.unescape[match]
    })    
}

/*
 * 手机号分隔
 * 13581599317 -> 135 8159 9317
 */
function separateMobile(num) {
    var arr = ( '0' + num ).replace(/(\d{4})(?=\d)/g,"$1 ").split('')
    arr.shift()
    return arr.join('')
}

/*
 * 解析URL各部分的通用方法, 来自http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
 */
function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}
/*
 * 根据日期返回星期几？
 */
function getDay(year, month, day) {
    var date = new Date(year, month-1, day)
    return date.getDay()
}
/*
 * 判断两个日期是否一样
 */
function isEqual(date1, date2) {
    var arr1 = date1.split('-')
    var arr2 = date2.split('-')

    var year1  = arr1[0] - 0
    var month1 = arr[1] - 0
    var date1  = arr[2] - 0
    var year2  = arr2[0] - 0
    var month2 = arr2[1] - 0
    var date2  = arr2[2] -0

    if (year1===year2 && month1 === month2 && date1 === date2) {
        return true
    } else {
        return false
    }
}
/*
 * 获取当前日期的后一天，如 
 *    2014-04-03 返回 2014-04-04
 *    2014-04-30 返回 2014-05-01
 *    2014-12-31 返回 2015-01-01
 * 
 *  闰年
 *    2008-02-28 返回 2014-02-29
 *    2008-02-29 返回 2014-03-01
 */
function getAfterDay(str) {
    var months = [31,28,31,30,31,30,31,31,30,31,30,31]
    var arr = str.split('-')
    var year = arr[0] - 0
    var month = arr[1] - 1
    var day = arr[2] - 0

    // 闰年2月有29天
    var isRunNian = false
    if ( 1 == month && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ) {
        isRunNian = true
        months[1] = 29
    }

    var result = []
    if (month === 11 && day === 31) {
        result = [ (year+1) + '', '01', '01']
    } else {
        var days = months[month]
        if (day < days) {
            day = day + 1
            result = [year + '', (month+1) + '', day + '']
        } else {
            result = [year + '', (month+2) + '', '1']
        }
    }

    return result.join('-')
}

// 获取图片的最大尺寸， naturalWidth在FF，Chrome，Safari, Opera, IE9中已实现
function hasDimensions(img) {
  return !!((img.complete && typeof img.naturalWidth !== "undefined") || img.width);
}
// Get image's max-width:100%; in pixels
function getMaxWidth(img) {
  var maxWidth;

  // Check if naturalWidth is supported
  if (img.naturalWidth !== undefined) {
    maxWidth = img.naturalWidth;

  // Not supported, use in-memory solution as fallback
  } else {
    var image = new Image();
    image.src = img.src;
    maxWidth = image.width;
  }

  // Return the max-width
  return maxWidth;
}

// 判断一个元素是否在视图窗口中
// Determine if an element is in the visible viewport
function isInViewport(element) {
    var rect = element.getBoundingClientRect()
    var html = document.documentElement
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || html.clientHeight) &&
      rect.right <= (window.innerWidth || html.clientWidth)
    )
}

// 琪力
function inWindow(el) {
    var wHeight = $(window).height()
    var bTop = $('body').scrollTop() || $('html').scrollTop()
    var eTop = $(el).offset().top
    return wHeight + bTop > eTop && bTop < eTop
}

// 浏览器更新页面事件,避免过度渲染或者丢帧
var requestAFrame = function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        // 都不行就还用setTimeout
        function (callback) {
            //每秒60帧
            return setTimeout(callback, 1000 / 60)
        }
}()

// 取消事件的注册
var cancelAFrame = function() {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function(id) {
            clearTimeout(id)
        }
}()

