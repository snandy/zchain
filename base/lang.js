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


grunt.registerTask('mytask', '一个最简单的任务演示，根据参数打印不同的输出.', function(arg1, arg2) {
    if (arguments.length === 0) {
        grunt.log.writeln('任务' + this.name + ", 没有传参数");
    } else if (arguments.length === 1) {
        grunt.log.writeln('任务' + this.name + ", 有一个参数是" + arg1);
    } else {
        grunt.log.writeln('任务' + this.name + ", 有两个参数分别是" + arg1 + ", " + arg2);
    }
});