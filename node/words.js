/**
 * 统计文件中某个字/词出现的次数
 * 
 * keywords (Array) ['\"string\"', '\"boolean\"', '\"number\"']
 * file     (String) 文件路径
 * callback (Function) 回调函数 把统计结果作为参数给它
 * 
 * 统计结果结构，默认会按多到少排序
 * {
 * 	word: num
 * }
 * 
 */

var fs  = require('fs'); 

function readFile(file) {
	return fs.readFileSync(file, 'utf8');
}

function buildRe(keywords) {
	var rObj = {};
	
	if (keywords.constructor !== Array) {
		return;
	}
	
	keywords.forEach(function(it) {
		rObj[it] = RegExp(''+it, 'g');
	});
	
	return rObj;
}

function count(rObj, source, callback, sortType) {
	var r,
		num,
		type,
		rarr,
		func,
		result = [];
	
	var subCount = function(arr) {
		var i, re, num, resu;
		i = num = 0;
		
		for (i; i<arr.length; i++) {
			re = arr[i];
			while( (resu=re.exec(source)) != null ) {
				num++;
			}
		}
		
		return num;
	};
	
	for (type in rObj) {
		rarr = rObj[type];
		
		if (rarr.constructor !== Array) {
			rarr = [rarr];
		}
		
		num = subCount(rarr);
		result.push({type: type, num: num});
	}
	
	// sort 0:次数顺序   1:次数倒序
	if (typeof sortType !== 'undefined') {
		if (sortType===0) {
			func = function(a, b) {
				return a.num - b.num;
			};
		} else if (sortType===1) {
			func = function(a, b) {
				return b.num - a.num;
			};
		}
		result.sort(func);
	}
	
	callback(result);
	
}

exports.count = function(keywords, file, callback, sortType) {
	var rObj = keywords.constructor === Array ? buildRe(keywords) : keywords;
	var source = readFile(file);
	count(rObj, source, callback, sortType);
}


