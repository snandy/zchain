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

/*
 * 简单的解决浮点数精度丢失问题
 *
 * **该算法存在缺陷，不能使用**
 *
 * @param {num} 计算后小数
 * @param {precision} 精度，如 2 即保留 2 位小数
 */
function formatFloat(num, precision) {
	var str = num + ''
	str = str.substr(0, 2) + str.substr(2, precision)
	return parseFloat(str)
}

// 如
// 0.1 + 0.2 != 0.3
// 0.2 + 0.4 != 0.6
// 3.14 * 5 != 15.7

// 解决方式
formatFloat(0.1 + 0.2, 2)
formatFloat(0.2 + 0.4, 2)
formatFloat(3.14 * 5, 2)

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
		var ret = {times: 0, num: 0}
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
		var max = o1.times > o2.times ? o1.times : o2.times
		var result = null
		switch (op) {
			case 'add': 
				result = o1.num + o2.num
				break
			case 'subtract':
				result = o1.num - o2.num
				break
			case 'multiply':
				result = o1.num * o2.num
				break
			case 'divide':
				result = o1.num / o2.num
				break
		}
		return result / max
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