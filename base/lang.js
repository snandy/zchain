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

