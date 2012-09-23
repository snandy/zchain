/**
 * history.js v0.1
 * Copyright (c) 2011 snandy
 * 
 * 1 使用iframe，通过document.write产生历史
 * 2 IE6/7/8/9/10/Firefox支持，Safari/Chrome/Opera不支持
 * 
 * example:
 * 
 * History.push({
 *     param : // func参数
 *     func : 回调函数
 *     scope : func执行上下文
 * });
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
        var doc = iframe.contentWindow.document,
            el  = doc.getElementById('idx');
        
        if(pushing) return;
        
        if(el) {
            idx = el.innerHTML;
            get(idx);
        }
        else { // el为null
            get('0');
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
		}, 1000);
	}
	
	function updateIframe() {
        var doc = iframe.contentWindow.document;
        try{
            doc.open();
            doc.write('<div id="idx">' + index + '</div>');
            doc.close();
        }catch(e){
            
        }
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