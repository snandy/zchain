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
    var a =  document.createElement('a')
    a.href = url
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var s, ret = {}
            var seg = a.search.replace(/^\?/, '').split('&')
            var len = seg.length
            for (var i = 0; i < len; i++) {
                if (!seg[i]) continue 
                s = seg[i].split('=')
                ret[s[0]] = s[1]
            }
            return ret
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    }
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

// 计算页面的实际高度，iframe自适应会用到
function calcPageHeight() {
    var cHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    var sHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    var height  = Math.max(cHeight, sHeight)
    return height
}

// 防止函数执行太快，比如用在提交按钮等，须在指定时间后才能再次执行
function debounce(func, wait) {
    var canSwitch = true
    return function() {
        if (!canSwitch) return
        func()
        canSwitch = false
        setTimeout(function() {
            canSwitch = true
        }, wait)
    }
}

/*
 * RGB转成16进制色值， 如 "rgb(255,0,0)" 会转成 "#ff0000"
 */
function rgbToHex(str) {
    var arr = str.match(/\d+/g)
    if (!arr) return ''
    var red   = arr[0]
    var green = arr[1]
    var black = arr[2]
    return "#" + (16777216 | black | (green << 8) | (red << 16)).toString(16).slice(1)
}

/*
 * URL里的中文都encodeURIComponent下，IE低版本有时出现乱码
 * 
 * 如 http://dujia.jd.com/search?country=中国&name=冯军
 * 输出 http://dujia.jd.com/search?country=%E4%B8%AD%E5%9B%BD&name=%E5%86%AF%E5%86%9B
 */
function encodeChinese(str) {
    var regCH = /[\u4E00-\u9FA5]+/g
    var result = str.match(regCH)
    if (!result) return
    var i = 0
    var j = 0
    var len = result.length
    var chanst = []
    if (result && len) {
        while (i < len) {
            var res = result[i]
            var enc = encodeURIComponent(res)
            str = str.replace(res, enc)
            i++
        }
    }
    return str
}

