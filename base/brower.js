/**
 * 浏览器嗅探，采用传统的userAgent
 * 
 */
B = function(ua){
    var b = {
        ie: /msie/.test(ua) && !/opera/.test(ua),
        opera: /opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua),
        firefox: /firefox/.test(ua),
        chrome: /chrome/.test(ua),
        maxthon: /maxthon/.test(ua),
        sogou: /se/.test(ua),
        tt: /TencentTraveler/.test(ua)
    }
    var mark = ''
    for (var i in b) {
        if (b[i]) {
        	mark = 'safari' == i ? 'version' : i;
        	break;
    	}
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    b.version = mark && reg.test(ua) ? RegExp.$1 : '0'
    b.ie6  = b.ie && parseInt(b.version, 10) == 6
    b.ie7  = b.ie && parseInt(b.version, 10) == 7
    b.ie8  = b.ie && parseInt(b.version, 10) == 8
    b.ie9  = b.ie && parseInt(b.version, 10) == 9
    b.ie10 = b.ie && parseInt(b.version, 10) == 10
    return b
}(navigator.userAgent.toLowerCase());

// ie detector

// ---------------------------------------------------------- 
// A short snippet for detecting versions of IE in JavaScript 
// without resorting to user-agent sniffing 
// ---------------------------------------------------------- 
// If you're not in IE (or IE version is less than 5) then: 
//     ie === undefined 
// If you're in IE (>=5) then you can determine which version: 
//     ie === 7; // IE7 
// Thus, to detect IE: 
//     if (ie) {} 
// And to detect the version: 
//     ie === 6 // IE6 
//     ie > 7 // IE8, IE9 ... 
//     ie < 9 // Anything less than IE9 
// ---------------------------------------------------------- 
var ie = (function(){
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : undef;
}());

// ie comments
var isIE = /*@cc_on!@*/!1;
var isIE = /*@cc_on!@*/false;
g
// ie不支持垂直制表符
var ie678 = !+'\v1';

// ie bug
var ie678 = !-[1,];

var ie6 = /msie 6/i.test(navigator.userAgent);
var ie6 = !!window.ActiveXObject && !window.XMLHttpRequest;
var ie6 = navigator.appVersion.indexOf('MSIE 6')>-1;

