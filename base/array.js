var A = function(){

function isArray( obj ){
    return Object.prototype.toString.call(obj) === "[object Array]";
}
/**
 * 找出数组中某元素的下标
 * @param {Object} ary 数组
 * @param {Object} obj 数组元素
 * @param {Object} from 指定从数组的哪个位置开始找
 */
function indexOf( ary, obj, from ){
    if(ary.indexOf) {
        return isNaN(from) ? ary.indexOf(obj) : ary.indexOf(obj, from);
    }else {
        var len = ary.length;
        from = isNaN(from) ? 0
            : from < 0 ? Math.ceil(from) + len : Math.floor(from);
        
        for( ; from < len; from++ ) { 
            if( ary[from] === obj ) return from; 
        }
        return -1;
    }        
}

/**
 * 找出数组中某一个对象最后一次出现的下标
 * @param {Object} ary
 * @param {Object} obj
 * @param {Object} from
 */
function lastIndexOf( ary, obj, from ){
    if(ary.lastIndexOf) {
        return isNaN(from) ? ary.lastIndexOf(obj) : ary.lastIndexOf(obj, from);
    }else {
        var len = ary.length;
        from = isNaN(from) || from >= len - 1 ? len - 1
            : from < 0 ? Math.ceil(from) + len : Math.floor(from);
        
        for( ; from > -1; from-- ) { 
            if ( ary[from] === obj ) return from; 
        }
        return -1;
    }        
}

/**
 * 对数组的每个元素调用一个函数fn，该函数会传入三个参数：数组元素，下标，数组自身
 * @param {Object} ary
 * @param {Object} fn
 */
function forEach( ary, fn ){
    if(ary.forEach) {
        ary.forEach(fn);
    }else{
        var i=0,len=ary.length;
        for(;i<len;i++){
            fn(ary[i],i,ary);
        }
    }
}
/**
 * 对数组的每个元素调用一个函数，只当此所有调用元素的函数都返回true时它才返回true
 * fn会传入三个参数：数组元素，下标，数组自身
 * @param {Object} ary
 * @param {Object} fn
 */
function every( ary, fn ){
    if(ary.every){
        return ary.every(fn);
    }else{
        var i=0,len=ary.length;
        for(;i<len;i++){
            if(!fn(ary[i],i,ary)) return false;
        }
        return true;
    }
}

/**
 * 对数组的每个元素调用一个函数，只要此函数中的其中一个返回true时它就返回true
 * fn会传入三个参数：数组元素，下标，数组自身
 * @param {Object} ary
 * @param {Object} fn
 */
function some( ary, fn ){
    if(ary.some){
        return ary.some(fn);
    }else{
        var i=0,len=ary.length;
        for(;i<len;i++){
            if(fn(ary[i],i,ary)) return true;
        }
        return false;
    }
}

/**
 * 通过规则fn来过滤数组ary，不会改变ary自身，返回过滤后的
 * fn会传入三个参数：数组元素，下标，数组自身
 * @param {Object} ary
 * @param {Object} fn
 */
function filter( ary, fn ){
    if(ary.filter){
        return ary.filter(fn);
    }else{
        var i=0,len=ary.length,a=[];
        for(;i<len;i++){
            if(fn(ary[i],i,ary))
                a.push(ary[i]);
        }
        return a;
    }
}

/**
 * 
 * @param {Object} ary
 * @param {Object} fn
 */
function map ( ary, fn ){
    
}
/**
 * 迭代对象或数组
 * @param {Object} obj
 * @param {Object} fn
 * fn拥有两个参数：第一个为对象的成员或数组的索引，第二个为对应的值
 * 如果需要退出 each 循环可在回调函数内部返回 false，其它返回值将被忽略
 */
function each( obj, fn ){
    var name, i = 0, len = obj.length;        
    if ( obj.constructor === Array ) {
        for ( var val = obj[0]; i<len && fn.call( val, i, val ) !== false; 
            val = obj[++i] ) {}
    } else {
        for ( name in obj ) {
            if ( fn.call( obj[ name ], name, obj[ name ] ) === false ) {
                break;
            }
        }
    }
}

/**
 * 将一个数组中的每个元素进行fn调用，fn的返回值作为新数组元素，返回新数组
 * fn拥有两个参数：第一个为数组的索引，第二个为对应的值
 * @param {Object} ary
 * @param {Object} fn
 */
function mapp( ary, fn){
    var ret = [], val;    
    for ( var i=0, len=ary.length; i<len; i++ ) {
        val = fn( i, ary[i] );
        if ( val != null ) {
            ret.push( val );
        }
    }
    return ret;    
}
/**
 * 使用过滤函数过滤数组元素。
 * @param {Object} ary
 * @param {Object} fn
 */
function grep( ary, fn ){
    var ret = [];
    for ( var i=0, len=ary.length; i<len; i++ ) {
        if ( fn( i, ary[i] ) ) {
            ret.push( ary[ i ] );
        }
    }
    return ret;    
}
// 删除数组元素
function remove(arr, item, rule) {
    for (var i = 0; i < arr.length; i++) {
        if (rule(arr[i], item)) {
            arr.splice(i, 1)
            return arr
        }
    }
}
var arr = [{a:1}, {a:2}, {a:3}, {a:4}]
remove(arr, {a:2}, function(obj, item) {
    return obj.a === item.a
})

/**
 * 数组去重
 * var arr = [1,2,3,1,4,5,0,1,0, false, false];
 * var o = arr.distinct();
 *    console.log(o)
 */

Array.prototype.distinct = function(){
    var newArray=[];
    var provisionalTable = {};
    for (var i = 0, item; (item=this[i]) != null; i++) {
        if (!provisionalTable[item]) {
            newArray.push(item);
            provisionalTable[item] = 1;
        }
    }
    return newArray;
}


return {
    isArray : isArray,
    indexOf : indexOf,
    lastIndexOf : lastIndexOf,
    forEach : forEach,
    every : every,
    filter : filter,
    some : some,
    each : each,
    mapp  : mapp,
    grep : grep
}
    
}();
