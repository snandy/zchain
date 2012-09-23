Ijax = function(){
	
	function request(url,opt){
		function fn(){}
		var opt = opt || {},
		success = opt.success || fn,
		failure = opt.failure || fn;
		
		var iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.onload = iframe.onreadystatechange = function(){
//			console.log(this);
			success();
		}
		iframe.setAttribute('src',url);
		document.body.appendChild(iframe);
	}
	
	return {load:request};
	
}();
