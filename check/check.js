function isEmpty(obj) {
	if (obj.length === 0) {
		return true;
	} else {
		return false;
	}
}

function isSame(obj1, obj2) {
	if ( obj1 === obj2 ) {
		return true;
	} else {
		return false;
	}

}

function isOnelength(obj, len) {
	if (obj.length == len) {
		 return true;
	} else {
		return false;
	}
}

function inOneArea(obj, len1, len2) {
	if (obj.length < len1 || obj.length>len2) {
		return false;
	} else {
		return true;
	}
}

function isEmail(obj) {
	var str ="^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|mobi|EDU|int|INT)$";
	var reg = RegExp(str);
	if (obj.search(reg) == -1) {
		return false;
	} else {
		return true;
	}
}
function isNumber(obj) {
	var re = /^[1-9][0-9]*$/;
	if ( !re.test(obj)) {
		return false;
	} else {
		return true;
	}
}
/**
 *  小写字母 
 */
function isLowercase(obj) {
	var reg = /[a-z]/g;
	return reg.test(obj);
}
function isChinese(obj) {
	var boo = true;
	for (var i=0; i<obj.length; i++) {
		if (obj.charCodeAt(i)<=255) {
			boo = false;
		}
	}
	return boo;
}
function isChinese2(obj) {
	var text = "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ,/()!@$%&\#*~.;'_-";
	var boo = false;
	for (var i=0; i<=obj.length-1; i++) {
		var char1 = obj.charAt(i);
		var index = text.indexOf(char1); 
		if (!(index==-1)) {	
			boo = false;
			break;
		} else {
			boo = true;
		}
	}
	return boo;

}
function isChinese3(o) {
	for (var i=0, len=o.length; i<len; i++) {
		if (o.charCodeAt(i)<=255) {
			continue;
		} else {
			return true;
		}
	}
	return false;
}
function isChinese4(o) {
	var re = /[\u4E00-\u9FA5]/;
	return re.test(o);
}
function isMoney(obj) {
	var re1 = /^[0-9]+.?[0-9]*$/;
	var re2 = /^[1-9]+[0-9]*]*$/;
	if (!re1.test(obj)) {
		return false;
	} else {
		if (re2.test(obj) || obj == '0') {
			obj.value += '.00';
			return true;
		} else if (obj.lastIndexOf(".") == obj.length-2 ) {
			obj += '0';
			return true;
		} else if (obj.lastIndexOf(".") == obj.length-3) {
			return true;
		} else {
			return false;
		}
	}
}
function isDate(obj) {
	var a = obj.match(/^(\d{0,4})-(\d{0,2})-(\d{0,2})$/); 
	if (a == null) {
		return false;
	}
	if (a[2]>=13 || a[3]>=32 || a[4]>=24) {
		return false;
	} else {
		return true;
	} 
}

function isTime(obj) {
	var a = obj.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) {
		return false;
	}
	if (a[1]>=24 || a[3]>=60 || a[4]>=60) {
		return false;
	} else {
		return true;
	}
}

function isDateTime(obj) {
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/; 
	var r = obj.match(reg); 
	if (r==null) {
		return false;
	}
	var d = new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]); 
	if (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]) {
		return true;
	} else {
		return false;
	}
}

function isTel(obj) {
	var re = /^[1-9]+[0-9]*]*$/;
	var boo = isOnelength(obj, 11);
	if ( !re.test(obj) || !boo ) {
		return false;
	} else {
		return true;
	}
}

function isMobile(obj) {
	var re = /^[1-9]+[0-9]*]*$/;
	var boo = isOnelength(obj, 11);
	if ( !re.test(obj) || !boo ) {
		return false;
	} else {
		return true;
	}
}
// 全角字符
function isExtra(o) {
	var str = "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]";
	var reg = RegExp(str);
	return reg.test(o);
}
// 计算字符串的长度，汉字按两个字符计算
function computeLength(str) {
	var r, arr=[], re = /[\u4E00-\u9FA5]/g
	while ( (r=re.exec(str)) != null ) {
		arr.push(r)
	}
	return (str.length-arr.length) + arr.length * 2
}
/**
 * 截取指定长度的字符串，汉字算两个字符
 * example: 
 * computeStr('找不到动动手abd882222', 10)
 * return: '找不到动动'
 * 
 */
function computeStr(str, len) {
	len = len || 14
	str = str.substr(0,len)
	var re = /[\u4E00-\u9FA5]/
	var arr = []
	var i = 0, leng = 0
	var temp
	
	for (; i<str.length; i++) {
		temp = str.substr(i, 1)
		if (temp) {
			if ( re.test(temp) ) {
				leng+=2
			} else {
				leng++
			}
			
			if (leng<=14) {
				arr.push(temp)
			}
		}
	}
	
	return arr.join('')
}
/**
 * 去掉字符串的所有 html tag 
 * @param {Object} str
 */
function delhtml(str) {
	return str.replace(/<\/?.+?>/g,'')
}