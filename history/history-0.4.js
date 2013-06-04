/**
 * history.js v0.4
 * Copyright (c) 2011 snandy
 * 
 * 1 通过修改location.hash产生历史，hashchange事件处理后退
 * 2 IE8/9/10/Firefox/Safari/Chrome/Opera支持, IE6/7不支持hashchange事件
 * 
 * example : 
 * 
 * History.push({
 *     param : // func参数
 *     func : 回调函数
 *     scope : func执行上下文
 * });
 * 
 */

historyManager = function() {
	
    var list = [], // 存储历史记录
       
        index = 0; // 历史记录索引
    	
    function push(data) {
        if(typeof data !== 'object') return;
        
        if(typeof data.param == undefined || typeof data.func !== 'function') return;
        
        list[index] = data;
        updateHash();
        index++;
    }

    function updateHash() {
        location.hash = index;
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

    window.onhashchange = function() {
        get(location.hash.replace(/#/, ''));
    }

    return {
    	push : push
    };
}();