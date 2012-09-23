/*******************************************************************************************************
 *
 * 对请求超时进行处理，调用了xhr的abort方法
 * 
 * 如果超时了，failure的第二个参数会是“request timeout”
 *
 *******************************************************************************************************/

/**
 * JavaScript Ajax Library v0.5
 * Copyright (c) 2010 snandy
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2010-08-02
 * 
 * 1,执行基本ajax请求,返回XMLHttpRequest
 * Ajax.request(url,{
 * 		async 	是否异步 true(默认)
 * 		method 	请求方式 POST or GET(默认)
 * 		type 	数据格式 text(默认) or xml or json
 * 		encode 	请求的编码 UTF-8(默认)
 * 		timeout 请求超时时间 0(默认)
 * 		data 	请求参数 (字符串或json)
 * 		success 请求成功后响应函数 参数为text,json,xml数据
 * 		failure 请求失败后响应函数 参数为xmlHttp, msg, exp
 * });
 * 
 * 2,执行ajax请求,返回纯文本
 * Ajax.text(url,{
 * 		...
 * });
 * 
 * 3,执行ajax请求,返回JSON
 * Ajax.json(url,{
 * 		...
 * });
 * 
 * 4,执行ajax请求,返回XML
 * Ajax.xml(url,{
 * 		...
 * });
 */

Ajax =
function(){
	function request(url,opt){
		function fn(){}
		opt = opt || {};
		var async   = opt.async !== false,
			method  = opt.method 	|| 'GET',
			type    = opt.type 		|| 'text',
			encode  = opt.encode 	|| 'UTF-8',
			timeout = opt.timeout 	|| 0,
			data    = opt.data 		|| null,
			success = opt.success 	|| fn,
			failure = opt.failure 	|| fn;
			method  = method.toUpperCase();
		if(data && typeof data == 'object'){
			data = _serialize(data);
		}
		if(method == 'GET' && data){
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
		}	
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		if(!xhr){return;}
		var isTimeout = false, timer;
		if(timeout>0){
			timer = setTimeout(function(){
				xhr.abort();
				isTimeout = true;
			},timeout);
		}
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && !isTimeout){
				_onStateChange(xhr, type, success, failure);
				clearTimeout(timer);
			}else{}
		};
		xhr.open(method,url,async);
		if(method == 'POST'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
		}
		xhr.send(data);
		return xhr;
	}
	function _serialize(obj){
		var a = [];
		for(var k in obj){
			var val = obj[k];
			if(val.constructor == Array){
				for(var i=0,len=val.length;i<len;i++){
					a.push(k + '=' + encodeURIComponent(val[i]));
				}
			}else{
				a.push(k + '=' + encodeURIComponent(val));
			}
		}
		return a.join('&');
	}
	function _onStateChange(xhr,type,success,failure){
		var s = xhr.status, result;

		if(s>= 200 && s < 300){
			switch(type){
				case 'text':
					result = xhr.responseText;
					break;
				case 'json':
					result = function(str){
						return (new Function('return ' + str))();
					}(xhr.responseText);
					break;
				case 'xml':
					result = xhr.responseXML;
					break;
			}
			success(result);
		}else if(s===0){
			failure(xhr,'request timeout');	
		}else{
			failure(xhr,xhr.status);
		}
		xhr = null;
	}
	return (function(){
		var Ajax = {request:request}, types = ['text','json','xml'];
		for(var i=0,len=types.length;i<len;i++){
			Ajax[types[i]] = function(i){
				return function(url,opt){
					opt = opt || {};
					opt.type = types[i];
					return request(url,opt);
				}
			}(i);
		}
		return Ajax;
	})();
}();

//Ajax.text('../servlet/Ajax',{
//	timeout : 2000,
//	success : function(result){},
//	failure : function(xhr,msg){
//		alert(msg);
//	}
//});