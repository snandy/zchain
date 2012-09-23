/**
 * 测试IE8+ xhr的timeout属性
 * Blog: http://snandy.javaeye.com/
 * QQ群: 34580561
 * Date: 2010-08-17
 * 
 * 
 * 执行基本ajax请求,返回XMLHttpRequest
 * Ajax.request(url,{
 * 		async 	是否异步 true(默认)
 * 		method 	请求方式 POST or GET(默认)
 * 		data 	请求参数 (键值对字符串)
 * 		timeout 超时时间
 * 		success 请求成功后响应函数，参数为xhr
 * 		failure 请求失败后响应函数，参数为xhr
 * });
 *
 */
Ajax = 
function(){
	function request(url,opt){
		function fn(){}
		var async   = opt.async 	|| true,
			method  = opt.method 	|| 'GET',
			data    = opt.data 		|| null,
			timeout = opt.timeout	|| 0,
			success = opt.success 	|| fn,
			failure = opt.failure 	|| fn;
			method  = method.toUpperCase();

		if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
			data = null;
        }
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				try{
					var s = xhr.status;
					if(s>= 200 && s < 300){
						success(xhr);
					}else{
						failure(xhr);
					}
				}catch(e){}
			}else{}
		};
		xhr.open(method,url,async);
		xhr.timeout = timeout;
		xhr.ontimeout = function(){
			alert('request timeout');
		}
		if(method == 'POST'){
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
		}
		xhr.send(data);
		return xhr;	
	}
	return {request:request};	
}();

//Ajax.request('../servlet/Ajax',{
//	timeout : 1000,
//	success : function(){},
//	failure : function(){}
//});