/**
 * JavaScript Observer.js v0.1
 * Copyright (c) 2010 snandy
 * 
 * 实现观察者模式工具类(单体)
 *	var obj = {};
 *	function f1(){alert(1)}
 *	function f2(){alert(2)}
 *	Observer.on(obj,'click',f1,true);
 *	Observer.on(obj,'click',f2);
 *	Observer.on(obj,'mouse',f2);
 *	Observer.fire(obj,'click');
 *	Observer.un(obj,'click');
 *	Observer.fire(obj,'mouse');
 * 
 */

Observer = function() {
	
	function isEmpty(obj) {
		for (var a in obj) {
			return false;
		}
		return true;
	}
	
	function forEach(ary, callback) {
		for (var i=0; i<ary.length;) { 
			callback(i, ary[i]) ? i=0 : i++;
		}
	}
	
	function remove(obj, type) {
		var zt = obj._ZT_;
		
		delete obj[type];
		delete zt[type];
		
		if (isEmpty(zt)) {
			delete obj._ZT_;
		}
	}
	
	function on(obj, type, fn, once) {
		var i, handler, listeners;
		
		obj._ZT_ = obj._ZT_ || {};
		listeners = obj._ZT_[type] = obj._ZT_[type] || [];
		
		if (once) {
			listeners.push({one:fn});
		} else {
			listeners.push(fn);
		}
		
		if (!listeners._LS_) {
			listeners._LS_ = function() {
				for ( i = 0; handler = listeners[i++]; ) {
					if (typeof handler == 'function') {
						handler.apply(obj, arguments);
					} else {
						handler.one.apply(obj, arguments);
						un(obj, type, handler.one);
						i--;
					}
				}
			}
			obj[type] = listeners._LS_;
		}
		
	}
	
	function un(obj, type, fn) {
		var listeners, zt = obj._ZT_;
		
		if (!zt) return;
		
		//只传参数obj
		if (!type && !fn) {
			for (var t in zt) {
				remove(obj, t);
			}
			return;
		}
		
		//传参数obj，type
		if (type && !fn && zt[type]) {
			remove(obj, type);
			return;
		}		
		
		//传参数obj，type，fn
		listeners = zt[type];
		if (listeners) {
			forEach(listeners, function(i, f) {
				if ( f==fn || f.one==fn ) {
					return listeners.splice(i, 1);
				}
			});
			if (listeners.length == 0) {
				remove(obj,type);
			}
		}
	}
	
	function fire(obj, type, args) {
		obj && obj[type] && obj[type].apply(obj, args);
	}
	
	return {
		on : on,
		un : un,
		fire : fire
	};
}();
