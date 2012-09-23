/**
 * JavaScript JSONP Library v0.2
 * Copyright (c) 2011 snandy
 * Blog: http://www.cnblogs.com/snandy
 * QQ群: 34580561
 * Date: 2011-04-26
 * 
 * 增加data属性，请求参数
 * 增加scope属性，可以让回调函数在指定的上下文中执行
 * 
 * 接口
 * Sjax.load(url, {
 * 	  data		// 请求参数 (键值对字符串或js对象)
 * 	  success 	// 成功后回调函数
 *    scope 	// 回调函数执行上下文
 *    timestamp // 是否加时间戳
 * });
 * 
 * 示例
 * Sjax.load('servlet/json', {
 *    success : function(){alert('request succ.');},
 *    scope : {},
 *    timestamp : true
 * });
 * 
 */

Sjax =
function(win){
		
	var isIE = /*@cc_on!@*/!1,
		doc = win.document,
		head = doc.getElementsByTagName('head')[0];
		
	function _serialize(obj){
		var a = [], key, val;
		for(key in obj){
			val = obj[key];
			if(val.constructor == Array){
				for(var i=0,len=val.length;i<len;i++){
					a.push(key + '=' + encodeURIComponent(val[i]));
				}				
			}else{
				a.push(key + '=' + encodeURIComponent(val));
			}				
		}
		return a.join('&');
	}
	function request(url, opt){
		var data = opt.data || {},
			success = opt.success || function(){},
			scope = opt.scope || win,
			timestamp = opt.timestamp;
		
		if(data && typeof data == 'object'){
			data = _serialize(data);
		}
		
		var script = doc.createElement('script');
		
		function callback(){
			if(typeof jsonp != 'undefined'){
				success(jsonp);
			}else{
				alert('warning: jsonp did not return.');
			}
			// Handle memory leak in IE
			script.onload = script.onreadystatechange = null;
			if( head && script.parentNode ){
				head.removeChild(script);
			}
		}
		if(isIE){
			script.onreadystatechange = function(){
				var readyState = this.readyState;
				if(readyState == 'loaded' || readyState == 'complete'){
					callback();
				}
			}
		}else{
			script.onload = function(){
				callback();
			}
		}
		if(data){
			url += '?' + data;
		}
		if(timestamp){
			if(data){
				url += '&ts=';
			}else{
				url += '?ts='
			}
			url += (new Date).getTime();
		}		
		script.src = url;
		head.insertBefore(script, head.firstChild);
	}
	return {
		load : request
	};
}(this);