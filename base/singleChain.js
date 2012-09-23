/**
 * chain 最易读版
 * @param {Object} obj
 */

function chain(obj){
	function fun(){
		if (arguments.length == 0){
			return fun.obj;
		}
		var methodName = arguments[0], methodArgs = [].slice.call(arguments,1);
		fun.obj[methodName].apply(fun.obj,methodArgs);
		return fun;
	}
	fun.obj = obj;
	return fun;
}
/**
 * chain 易读版
 * @param {Object} obj
 */
function chain(obj){
	return function(){
		var Self = arguments.callee; Self.obj = obj;
		if(arguments.length==0){
			return Self.obj;
		} 	
		var methodName = arguments[0], methodArgs = [].slice.call(arguments,1);
		Self.obj[methodName].apply(Self.obj,methodArgs);
		return Self;
	}
}
/**
 * chain 精简版
 * @param {Object} obj
 */
function chain(obj){
	return function(){
		var Self = arguments.callee; Self.obj = obj;
		if(arguments.length==0){
			return Self.obj;
		} 
		Self.obj[arguments[0]].apply(Self.obj,[].slice.call(arguments,1));
		return Self;
	}
}

