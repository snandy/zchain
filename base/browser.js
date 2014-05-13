/**
 * 浏览器嗅探，采用传统的userAgent
 * Browser.ie(6,7,8,9,10) / browser.firefox / browser.chrome ...
 *
 * 注意：IE11+ 去掉了 msie，因此Browser.ie会返回false，IE11+提醒大家不要叫它IE
 * IE11的变化：http://www.cnblogs.com/snandy/p/3174777.html
 */
Browser = function(ua) {
    var b = {
        sogou: /se/.test(ua),
        opera: /opera/.test(ua),
        chrome: /chrome/.test(ua),
        firefox: /firefox/.test(ua),
        maxthon: /maxthon/.test(ua),
        tt: /TencentTraveler/.test(ua),
        ie: /msie/.test(ua) && !/opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua)
    }
    var mark = ''
    for (var i in b) {
        if (b[i]) {
        	mark = 'safari' == i ? 'version' : i
        	break
    	}
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    b.version = mark && reg.test(ua) ? RegExp.$1 : '0'

    var iv = parseInt(b.version, 10)
    for (var i = 6; i < 11; i++) {
        b['ie'+i] = iv === i
    }
    
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
var ie = (function() {
    var undef, v = 3
    var div = document.createElement('div')
    var all = div.getElementsByTagName('i')
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : undef
}());

// ie comments
var isIE = /*@cc_on!@*/!1;
var isIE = /*@cc_on!@*/false;

// ie不支持垂直制表符
var ie678 = !+'\v1';

// ie bug
var ie678 = !-[1,];

// ie678 parseInt实现bug
var ie678 = parseInt('08') === 0;

var ie6 = /msie 6/i.test(navigator.userAgent);
var ie6 = !!window.ActiveXObject && !window.XMLHttpRequest;
var ie6 = navigator.appVersion.indexOf('MSIE 6')>-1;

