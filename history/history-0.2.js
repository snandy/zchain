/**
 * history.js v0.2
 * Copyright (c) 2011 snandy
 * 
 * 1 使用iframe，通过修改iframe.src产生历史
 * 2 IE6/7/8/9/10/Firefox/Safari/Chrome/Opera 都支持
 *  
 * History.push({
 *     param : // func参数
 *     func : 回调函数
 *     scope : func执行上下文
 * });
 * 
 */

History = function() {
	
var 
   iframe,
   
   // 存储历史记录
   list = [],
   
   // 历史记录索引
   index = 0,
   
   pushing;

iframe = document.createElement('iframe');
iframe.style.display = 'none';
iframe.onload = function() {
    if(pushing) return;
    var url= this.contentWindow.location.href;
    if(url.indexOf('?')>-1) {
        var idx = url.substr(url.indexOf('?')+1);
        get(idx);
    }

}
document.body.appendChild(iframe);
	
function push(data) {
    if(typeof data !== 'object') return;
    
    if(typeof data.param == undefined || typeof data.func !== 'function') return;
    
    list[index] = data;
    updateIframe();
    pushing = true;
    index++;
    
    setTimeout(function(){
        pushing = false;
    }, 100);
}

function updateIframe() {
    iframe.src = 'blank.html?' + index;
}

function get(idx) {
    var item, param, func, scope;
    if(idx != index) {
        item = list[idx];
        if(item) {
            param = item.param;
            func  = item.func;
            scope = item.scope;
            func.call(scope, param);
        }
    }
    
}

return {
	push : push
};
}();