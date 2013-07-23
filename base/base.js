/*
 */
function isFunction( obj ) {
	return Object.prototype.toString.call(obj) === "[object Function]";
}

function isArray( obj ) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

function isPlainObject( obj ) {
	if(!obj || obj===window || obj===document || obj===document.body ) 
		return false;
	return 'isPrototypeOf' in obj && Object.prototype.toString.call(obj)==='[object Object]';
}

function isEmptyObject( obj ) {
	for ( var name in obj ) {
		return false;
	}
	return true;
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

// 把数组中指定位置的元素放到第一个位置
function toFirst(arr, index) {
	index = arr.splice(index, 1);
	arr.unshift(index[0]);
	return arr;
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