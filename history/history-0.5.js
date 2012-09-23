/**
 * history.js v0.5
 * Copyright (c) 2011 snandy
 * 
 * 1 通过修改history.pushState产生历史，popstate事件处理后退
 * 2 Firefox/Safari/Chrome/Opera最新版本均支持, 所有IE不支持
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

History = function() {
	
var 
   // 存储历史记录
   list = [],
   
   // 历史记录索引
   index = 1,
   
   func, scope;
	
function push(data) {
    if(typeof data !== 'object') return;
    
    if(typeof data.param == undefined || typeof data.func !== 'function') return;
    
    func = data.func;
    scope = data.scope;
    
    history.pushState(null, null, '#' + index);
    index++;
}

// window.onpopstate = function(e) {
    // if(e.state) {
        // var state = e.state,
            // param = state.param;
        // if(param) {
            // func.call(scope, param);
        // }
    // }
    // else{
        // if(func){
            // func.call(scope, 0);
        // }
//         
    // }
//     
// }
window.onhashchange = function() {
    var state = e.state,
    param = state.param;
    if(param) {
        func.call(scope, param);
    }
}

return {
	push : push
};
}();