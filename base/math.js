// 去除给定整数的余数
function floor(num, integer) {
	return num - num % integer
}

// ------------------------------------------------------------------------------------------------------------------

/* 
 * Number.prototype.toFixed 修复
 * @param num {number} 浮点数/小数
 * @param precision {number} 保留的小数点位数
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 */
function toFixed(num, digits) {
	var times = Math.pow(10, digits)
	// 为什么是0.5，这是一个很微妙的数字
	var des = num * times + 0.5
	des = parseInt(des, 10) / times
	return des + ''
}

// 问题如下

// firefox/chrome
1.335.toFixed(2) // 1.33  错误
1.3335.toFixed(3) // 1.333 错误

// IE
1.335.toFixed(2) // 1.34  正确
1.3335.toFixed(3) // 1.334 正确


// 修复后所有浏览器表现一致

toFixed(1.335) // 1.34
toFixed(1.3335) // 1.334

// ------------------------------------------------------------------------------------------------------------------

/**
 * floatObj 包含加减乘除四个方法，能确保浮点数运算不丢失精度
 *
 * 我们知道计算机编程语言里浮点数计算会存在精度丢失问题（或称舍入误差），其根本原因是二进制和实现位数限制有些数无法有限表示
 * 以下是十进制小数对应的二进制表示
 *      0.1 >> 0.0001 1001 1001 1001…（1001无限循环）
 *      0.2 >> 0.0011 0011 0011 0011…（0011无限循环）
 * 计算机里每种数据类型的存储是一个有限宽度，比如 JavaScript 使用 64 位存储数字类型，因此超出的会舍去。舍去的部分就是精度丢失的部分。
 *
 * ** method **
 *  add / subtract / multiply /divide
 *
 * ** explame **
 *  0.1 + 0.2 == 0.30000000000000004 （多了 0.00000000000004）
 *  0.2 + 0.4 == 0.6000000000000001  （多了 0.0000000000001）
 *  19.9 * 100 == 1989.9999999999998 （少了 0.0000000000002）
 *
 * floatObj.add(0.1, 0.2) >> 0.3
 * floatObj.multiply(19.9, 100) >> 1990
 *
 */
var floatObj = function() {
   
    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }
   
    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0}
        if (isInteger(floatNum)) {
            ret.num = floatNum
            return ret
        }
        var strfi  = floatNum + ''
        var dotPos = strfi.indexOf('.')
        var len    = strfi.substr(dotPos+1).length
        var times  = Math.pow(10, len)
        var intNum = parseInt(floatNum * times + 0.5, 10)
        ret.times  = times
        ret.num    = intNum
        return ret
    }
   
    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param digits {number} 精度，保留的小数点数，比如 2, 即保留为两位小数
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, digits, op) {
        var o1 = toInteger(a)
        var o2 = toInteger(b)
        var n1 = o1.num
        var n2 = o2.num
        var t1 = o1.times
        var t2 = o2.times
        var max = t1 > t2 ? t1 : t2
        var result = null
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case 'multiply':
            	result = (n1 * n2) / (t1 * t2)
                return result
            case 'divide':
            	result = (n1 / n2) * (t2 / t1)
                return result
        }
    }
   
    // 加减乘除的四个接口
    function add(a, b, digits) {
        return operation(a, b, digits, 'add')
    }
    function subtract(a, b, digits) {
        return operation(a, b, digits, 'subtract')
    }
    function multiply(a, b, digits) {
        return operation(a, b, digits, 'multiply')
    }
    function divide(a, b, digits) {
        return operation(a, b, digits, 'divide')
    }
   
    // exports
    return {
        add: add,
        subtract: subtract,
        multiply: multiply,
        divide: divide
    }
}();


// 一、 十进制与二进制之间的转换 
// （1） 十进制转换为二进制，分为整数部分和小数部分 
// ① 整数部分 
// 方法：除2取余法，即每次将整数部分除以2，余数为该位权上的数，而商继续除以2，余数又为上一个位权上的数，这个步骤一直持续下去，直到商为0为止，最后读数时候，从最后一个余数读起，一直到最前面的一个余数。下面举例： 
// 例：将十进制的168转换为二进制 

// 得出结果 将十进制的168转换为二进制，（10101000）2 
// 分析:第一步，将168除以2,商84,余数为0。 
// 第二步，将商84除以2，商42余数为0。 
// 第三步，将商42除以2，商21余数为0。 
// 第四步，将商21除以2，商10余数为1。 
// 第五步，将商10除以2，商5余数为0。 
// 第六步，将商5除以2，商2余数为1。 
// 第七步，将商2除以2，商1余数为0。 
// 第八步，将商1除以2，商0余数为1。 
// 第九步，读数，因为最后一位是经过多次除以2才得到的，因此它是最高位，读数字从最后的余数向前读，即10101000 

// （2） 小数部分 
// 方法：乘2取整法，即将小数部分乘以2，然后取整数部分，剩下的小数部分继续乘以2，然后取整数部分，剩下的小数部分又乘以2，一直取到小数部分 
// 为零为止。如果永远不能为零，就同十进制数的四舍五入一样，按照要求保留多少位小数时，就根据后面一位是0还是1，取舍，如果是零，舍掉，如果是1，向入一位。换句话说就是0舍1入。读数要从前面的整数读到后面的整数，下面举例： 
// 例1：将0.125换算为二进制 

// 得出结果：将0.125换算为二进制（0.001）2 
// 分析：第一步，将0.125乘以2，得0.25,则整数部分为0,小数部分为0.25; 
// 第二步, 将小数部分0.25乘以2,得0.5,则整数部分为0,小数部分为0.5; 
// 第三步, 将小数部分0.5乘以2,得1.0,则整数部分为1,小数部分为0.0; 
// 第四步,读数,从第一位读起,读到最后一位,即为0.001。 


// 例2,将0.45转换为二进制（保留到小数点第四位） 


// 大家从上面步骤可以看出，当第五次做乘法时候，得到的结果是0.4，那么小数部分继续乘以2，得0.8，0.8又乘以2的，到1.6这样一直乘下去，最后不可能得到小数部分为零，因此，这个时候只好学习十进制的方法进行四舍五入了，但是二进制只有0和1两个，于是就出现0舍1入。这个也是计算机在转换中会产生误差，但是由于保留位数很多，精度很高，所以可以忽略不计。 
// 那么，我们可以得出结果将0.45转换为二进制约等于0.0111 
// 上面介绍的方法是十进制转换为为二进制的方法，需要大家注意的是： 
// 1） 十进制转换为二进制，需要分成整数和小数两个部分分别转换 
// 2） 当转换整数时，用的除2取余法，而转换小数时候，用的是乘2取整法 
// 3） 注意他们的读数方向 
// 因此，我们从上面的方法，我们可以得出十进制数168.125转换为二进制为10101000.001,或者十进制数转换为二进制数约等于10101000.0111。 

// （3） 二进制转换为十进制 不分整数和小数部分 
// 方法：按权相加法，即将二进制每位上的数乘以权，然后相加之和即是十进制数。例 
// 将二进制数101.101转换为十进制数。 

// 得出结果：（101.101）2=(5.625)10 
// 大家在做二进制转换成十进制需要注意的是 
// 1） 要知道二进制每位的权值 
// 2） 要能求出每位的值 