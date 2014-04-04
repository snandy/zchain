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
                for (var k in obj) {
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
        if (typeof o[a] === 'object') { 
            o[a] = clone(o[a])
        }
    }
    return o
}

/*
 * JS instanceof 的大概实现
 */
function instance_of(obj, Clazz) {
    // 取Clazz的显示原型
    var pro = Clazz.prototype
    // 取obj的隐式原型
    var _p = obj.__proto__ 
    while (true) {
        if (_p === null) return false
        // 这里重点：当p严格等于 L 时，返回 true 
        if (pro === _p) return true
        // 不断的取__proto__
        _p = _p.__proto__
    }
}

/*
 * JS getPrototypeOf
 */
function getPrototypeOf(obj) {
    var __proto = obj.__proto
    if (__proto || __proto === null) {
        return __proto
    } else if (obj.constructor) {
        return obj.constructor.prototype
    } else {
        return Object.prototype
    }
}


