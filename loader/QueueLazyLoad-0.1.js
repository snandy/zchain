/**
 * JavaScript QueueLoad Library v0.2
 * Copyright (c) 2011 snandy
 * Blog: http://www.cnblogs.com/snandy
 * QQ群: 34580561
 * Date: 2011-04-26
 * 
 * 1, JS文件顺序载入
 * 2, 每个文件载入后有一次回调机会
 * 3, hash对象存储已经加载过的JS，避免重复加载
 * 
 * 接口
 * QueueLazyLoad.js([
 *         {
 *             url   // JS路径
 *             fn      // 回调函数
 *             scope // 回调函数执行上下文，默认为window
 *         },
 *         ...
 * ]);
 * 
 * 示例
 * var libs = [
 *         {url:'http://files.cnblogs.com/snandy/a.js', fn: function(){alert('a.js is loaded.');}},
 *         {url:'http://files.cnblogs.com/snandy/b.js', fn: function(){alert('b.js is loaded.');}},
 *         {url:'http://files.cnblogs.com/snandy/c.js', fn: function(){alert('c.js is loaded.');}}
 * ];
 * QueueLazyLoad.js(libs);
 * 
 */

QueueLazyLoad = function(win){
    var index = 0,
        hash  = {},
        doc   = win.document,
        isIE  = /*@cc_on!@*/!1,
        head  = doc.getElementsByTagName('head')[0];

    function load(libs){
        var lib = libs[index++];
        if(!lib || !lib.url){
            index = 0;
            return;
        }
        if(hash[lib.url]){
            alert('warning: ' + lib.url + ' has loaded!');
            return;
        }
        
        var src = lib.url,
            fn = lib.fn || function(){},
            scope = lib.scope || win;
            
        var script = doc.createElement('script');
            script.src = src;
        
        function callback(){
            hash[src] = true;
            fn.call(scope);
            load(libs);
        }
        // IE9/10中同时支持onload和onreadystatechange事件
        // http://www.cnblogs.com/snandy/archive/2011/04/26/2029537.html
        if(isIE){
            script.onreadystatechange = function(){
                //脚本如果缓存状态为 complete，否则为 loaded
                var readyState = this.readyState;
                if(readyState == "loaded" || readyState == "complete"){
                    callback()
                }
            }
        }else{
            script.onload = function(){
                callback();
            };
        }
        head.appendChild(script);
    }
    
    return {
        js : load
    };
}(this);
