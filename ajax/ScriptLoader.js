function ScriptLoader(fn, scope){
	this.script = null;
	this.agent = null;
	this.fun = null;
	this.scope = scope || window;
	this.fn = fn;
	this.init();
}
ScriptLoader.prototype = {
	init : function(){
		var me = this;
		var obj = document.createElement("script");
		this.script = obj;
		obj.type = "text/javascript";
		obj.charset = "utf-8";
		if(obj.readyState){
			obj.onreadystatechange = function(){
				//脚本如果缓存状态为 complete，否则为 loaded
				if(this.readyState == "loaded" || this.readyState == "complete"){
					me.fn.apply(me.scope);
					me.dispose();
				}
			};
		}else{
			obj.onload = function(){
				me.fn.apply(me.scope);
				me.dispose();
			};
		}
	},
	dispose : function(){
		this.fn = null;
		this.scope = null;
		var parent = this.script.parentNode;
		if(parent){
			parent.removeChild(this.script);
		}
		this.script.onreadystatechange = null;
		this.script.onload = null;
		this.script = null;
	},
	load : function(url, ts){
		if(ts){
			ts = (new Date).getTime();
			url = url + '&ts=' + ts;
		}
		this.script.src = url;
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(this.script);
	}
	
};