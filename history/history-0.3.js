/**
 * history.js v0.3
 * Copyright (c) 2011 snandy
 * 
 * 1 使用iframe，通过修改iframe.src产生历史，回调写在iframe对应的html页面中
 * 2 IE6/7/8/9/10/Firefox/Safari/Chrome/Opera 都支持
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
  var iframe,
     
      list = [], // 存储历史记录
     
      index = 0; // 历史记录索引

  iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.onload = function() {

  }
  document.body.appendChild(iframe);
      
  function push(data) {
      if(typeof data !== 'object') return;
      
      if(typeof data.param == undefined || typeof data.func !== 'function') return;
      
      list[index] = data;
      updateIframe();
      pushing = true;
      index++;
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
      push : push,
      get : get
  };
  
}();