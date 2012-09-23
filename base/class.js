/**
 * @param {String} className
 * @param {String/Function} superCls
 * @param {Function} classImp
 */
function $class(className, superCls, classImp) {
	var p, supr
	if(superCls === '') superCls = Object
	function clazz() {
		if(typeof this.init == "function") {
			this.init.apply(this, arguments)
		}
	}
	p = clazz.prototype = new superCls()
	clazz.prototype.constructor = clazz
	clazz.prototype.className = className
	supr = superCls.prototype
	window[className] = clazz
	classImp.apply(p, [supr])
}


/**
 * 父类 Person
 */
$class('Person','',function() {
	this.init = function(n, a){
		this.name = n;
		this.age = a;
	};
	this.getName = function(){
		return this.name;
	};
	this.setName = function(name){
		this.name = name;
	}
	this.getAge = function(){
		return this.age;
	};
	this.setAge = function(a){
		this.age = a;
	};
});

$class("Man",Person, function(supr) {
	this.init = function(n, a, s) {
		supr.init.apply(this, [n,a]);
		this.school = s;
	}
	this.getSchool = function(){
		return this.school;
	};
	this.setSchool = function(s){
		this.school = s;
	};
});

var p = new Person('lily', 20);
var m = new Man('tom', 25, 'pku');

console.log(m.name); // tom 继承父类的共有属性name可以直接使用点操作符获取
console.log(m.age);  // undefined 父类的私有属性age不能直接使用点操作符获取
console.log(m.getAge()); // 25 可通过父类的共有方法getAge获取私有属性age
console.log(m.school); // undefined Man自己的私有属性仍然不能通过点操作符获取



// clone/copy
function clone(obj) { 
    var o
    if (typeof obj == "object") { 
        if (obj === null) { 
            o = null
        } else { 
            if (obj instanceof Array) { 
                o = []
                for (var i=0; i<obj.length; i++) {
                	o[i] = clone(obj[i])
                }
            } else { 
                o = {}
                for(var k in obj) { 
                    o[k] = clone(obj[k]) 
                } 
            } 
        }
         
    } else { 
        o = obj
    }
    return o
}
function clone(obj) { 
    function fn(){} 
    fn.prototype = obj
    var o = new fn()
    for (var a in o) { 
        if (typeof o[a] === "object") { 
            o[a] = clone(o[a])
        } 
    } 
    return o
}

