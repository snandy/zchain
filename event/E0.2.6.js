/**
 * Event v0.2.6
 * 1,解决IE fn中丢失this
 * 2,统一了事件对象作为fn的第一个参数
 * 3,解决事件对象的兼容性问题，如阻止默认行为，停止冒泡等统一使用w3c标准方式
 * 4,remove方法新增删除元素type类型的所有监听器(参数传el，type)
 * 5,remvoe方法新增删除元素所有的监听器(参数传el)
 * 6,增加_find方法，解决fn只能添加el[type]一次 
 * 7,解决了同一个事件的handlers执行顺序问题(IE无序，FF/Safari/Chrome中顺序)
 * 
 *
 */
var E = {

	uid : 0,

	add : function(el, type, fn) {
		
		el.listeners = el.listeners || {};
		el.listeners[type] = el.listeners[type] || {};
		var func;
		

		//相同同el，type，fn只能添加一次
		if(this._find(el,type,fn)) return false; 

		el.listeners[type][this.uid++] = fn;

		el.wraper = el.wraper || {};
		
		if(!el.wraper[type]){
			el.wraper[type] = function(e){

				var evt = e || window.event;
				evt.stopPropagation = evt.stopPropagation || function(){ this.cancelBubble = true; };
				evt.preventDefault = evt.preventDefault || function(){ this.returnValue = false;};			

				if(!evt.target) evt.target = evt.srcElement;
				if(!evt.currentTarget) evt.currentTarget = el;			

				for(var i in el.listeners[type]){
					el.listeners[type][i].call(el,evt);
				}

			}

			if(el.addEventListener){
				el.addEventListener(type, el.wraper[type], false);
			}else if(el.attachEvent){
				el.attachEvent('on' + type,  el.wraper[type]);
			}
		}


	},
	_find : function(el, type, fn) {

		var listeners = el.listeners && el.listeners[type];

		for(var i in listeners){
			if( listeners[i]==fn ){
				return {lis:listeners,uid:i};
			}
		}
		return false;

	},
	_remove : function(el, type) {

		if(el.removeEventListener){
			if( el && !type ){
				for(var i in el.wraper)
					el.removeEventListener(i, el.wraper[i], false);
			}else if( el && type ){
				el.removeEventListener(type, el.wraper[type], false);
			}
			
		}else if(el.detachEvent){
			if( el && !type ){
				for(var i in el.wraper)
					el.detachEvent('on' + i, el.wraper[i]);
			}else if( el && type ){
				el.detachEvent('on' + type, el.wraper[type]);
			}
			
		}
	},
	remove : function(el,type,fn) {

		//只传参数el
		if(!type && !fn){
			this._remove(el);
			delete el.listeners;
			delete el.wraper;
			return;
		}

		//传参数el，type
		if(type && !fn){
			this._remove(el,type);
			delete el.listeners[type];
			delete el.wraper[type];
			return;
		}
		
		//传参数el，type，fn
		var ob = this._find(el, type, fn);			
		ob && delete ob.lis[ob.uid]
		
	}
};
