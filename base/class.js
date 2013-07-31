~function(global, undefined) {

var U = {}
var toString = Object.prototype.toString

// Iterator
function forEach(obj, iterator, context) {
    if ( obj.length === +obj.length ) {
        for (var i=0; i<obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context, obj[k], k, obj) === true) return
        }
    }
}

// U.isArray, U.isBoolean, ...
forEach(['Array', 'Boolean', 'Function', 'Object', 'String', 'Number'], function(name) {
    U['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

// initialize namespace
function namespace(classPath, globalNamespace) {
    if ( !U.isString(classPath) ) throw new Error('classPath must be a string')
    globalNamespace = U.isObject(globalNamespace) ? globalNamespace : global
    var arr = classPath.split('.')
    var namespace = globalNamespace
    var className = arr.pop()

    // initialize namespace
    while (arr.length) {
        var name = arr.shift()
        var obj = namespace[name]
        if (!obj) {
            namespace[name] = obj = {}
        }
        namespace = obj
    }

    var clazz = namespace[className]
    if ( U.isFunction(clazz) ) throw new Error(className + ' is already defined')
    namespace[className] = undefined
    return {
        namespace: namespace,
        className: className
    }
}

// define a class
function Class(classPath, superClass, classImp) {
    if (!classImp) {
        classImp = superClass
        superClass = Object
    }
    function Constructor() {
        if ( U.isFunction(this.init) ) {
            this.init.apply(this, arguments)
        }
    }
    var proto = Constructor.prototype = new superClass()
    Constructor.prototype.constructor = classImp
    var supr = superClass.prototype
    classImp.call(proto, supr)
    
    var obj = namespace(classPath, Class.globalNamespace)
    obj.namespace[obj.className] = Constructor
}

// defaults
// Class.globalNamespace = global

// Expose IO to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('IO', [], function() { return Class } )
} else {
    // global.namespace = namespace
    global.Class = Class
}

}(this);