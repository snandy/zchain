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
 * JS instanceof 的伪代码实现
 */
function instance_of(L, R) {// L 表示左表达式，R 表示右表达式
    var O = R.prototype // 取 R 的显示原型
    // 取 L 的隐式原型
    L = L.__proto__ 
    while (true) { 
        if (L === null) return false
        // 这里重点：当 O 严格等于 L 时，返回 true 
        if (O === L) return true
        // 不断的取__proto__
        L = L.__proto__
    } 
 }
