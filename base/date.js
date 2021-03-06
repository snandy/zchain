// 一些常量
var reDate = /^\d{4}\-\d{1,2}\-\d{1,2}/
var weekArr1 = ['周日','周一','周二','周三','周四','周五','周六']
var weekArr2 = ['星期日', '星期一','星期二','星期三','星期四','星期五','星期六']

/*
 * 判断闰年
 * @param  {Number} 年
 * @return {Blooean}
 */
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}
/*
 * 补齐月，日数字位数
 * @param {number|string} n 需要补齐的数字
 * @return {string} 补齐两位后的字符
 */
function getTwoBit(n) {
    return (n > 9 ? '' : '0') + n
}
/*
 * 日期字符串转成Date对象
 * @param {String} str
 *   "2014-12-31" 
 *   "2014/12/31"
 * @return {Date} 
 */
function str2Date(str) {
    if (reDate.test(str)) {
        str = str.replace(/-/g, '/')
    }
    return new Date(str)
}
/*
 * 日期对象转成字符串
 * @param  {Date} new Date()
 * @split  {String} "-" 或 "/"
 * @return {String} "2014-12-31" 
 */
function date2Str(date, split) {
    split = split || '-'
    var y = date.getFullYear()
    var m = getTwoBit(date.getMonth() + 1)
    var d = getTwoBit(date.getDate())
    return [y, m, d].join(split)    
}
/*
 * 返回日期格式字符串
 * @param {Number} 0返回今天的日期、1返回明天的日期，2返回后天得日期，依次类推
 * @return {string} '2014-12-31'
 */
function getDay(i) {
    i = i || 0
    var date = new Date
    var diff = i * (1000 * 60 * 60 * 24)
    date = new Date(date.getTime() + diff)
    return date2Str(date)
}
/*
 * 返回明天日期字符串
 * @param  {String} '2014-12-30'
 * @return {String} '2014-12-31'
 */
function getAfterDay(str) {
    var curr = str2Date(str)
    var next = curr.getTime() + (1000 * 60 * 60 * 24)
    next = new Date(next)
    return date2Str(next)
}
/*
 * 根据Date对象获取周几
 * @param date {Date|String} 如 '2014-12-22'
 * @return '周一' 或 '星期一'
 */ 
function getWeekByDate(date, isFormal) {
    var obj = null
    if (typeof date == 'string') {
        obj = str2Date(date)
    } else if (date instanceof Date) {
        obj = date
    }
    var num = obj.getDay()
    return isFormal ? weekArr2[num] : weekArr1[num]
}
/*
 * 根据所传Date对象和offset计算
 * 例如：date:2014-08-28，offset为5，则返回的Date为2014-09-02
 */
/*
 * 判断两个日期是否一样
 */
function isEqual(date1, date2) {
    var arr1 = date1.split('-')
    var arr2 = date2.split('-')
    var year1  = arr1[0] - 0
    var month1 = arr[1] - 0
    var date1  = arr[2] - 0
    var year2  = arr2[0] - 0
    var month2 = arr2[1] - 0
    var date2  = arr2[2] -0
    if (year1===year2 && month1 === month2 && date1 === date2) {
        return true
    } else {
        return false
    }
}

// 比较两个时间字符串，比如 compareDate('2014-05-18', '2014-05-10') 返回false，入住时间不能大于退房时间
function compareDate(date1, date2) {
    var a1 = date1.split('-')
    var a2 = date2.split('-')

    // year
    if (a1[0] > a2[0]) {
        return false
    } else if (a1[0] < a2[0]) {
        return true
    }
    // month
    if (a1[1] > a2[1]) {
        return false
    } else if (a1[1] < a2[1]) {
        return true
    }
    // day
    if (a1[2] > a2[2]) return false
    return true
}
/*
 * 根据date返回字符串格式日期，可含中文星期
 */ 
function formatDate(date, hasDay) {
    var day = null
    if (typeof date === 'string') {
        date = str2Date(date)
    }
    var str = date2Str(date)
    if (hasDay) {
        day = weekArr1[date.getDay()]
        str += ' ' + day
    }
    return str
}
/*
 * 计算从今天开始后的1年后的时间
 * 例如
 * 2014-11-20 返回 2015-11-19
 * 2014-11-01 返回 2014-10-31
 */
function getNextYear(date) {
    var MON = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // 提取年，月，日
    var arr   = date.split('-')
    var year  = arr[0] - 0 + 1
    var month = arr[1]
    var day   = arr[2] - 1

    if (isLeapYear(year)) {
        MON[1] = 29
    }
    // 1号时月数需要减1
    if (day == 0) {
        month = month - 1
        // 1月特殊处理
        if (month == 0) {
            month = 12
            year--
        }
        day = MON[month-1]
    }

    month = fixMonthDay(month)
    day = fixMonthDay(day)
    return [year, month, day].join('-')
}

/*
 * 根据年/月返回该月的天数
 * 
 * **参数**
 * year   {Number|Date|String} 必选
 * month  {Number} 可选
 * 
 * **示例1**
 * var date = new Date()
 * var days = getDaysInMonth(date)

 * **示例2**
 * var days = getDaysInMonth('2015-04-28')
 * var days = getDaysInMonth('2015/04/28')
 *
 * **示例3**
 * var days = getDaysInMonth(2015, 4)
 * 
 */
function getDaysInMonth(year, month) {
    var date, y, m
    if (typeof year == 'string') {
        date = str2Date(year)
    }
    if (year instanceof Date) {
        date = year
        y = date.getFullYear()
        m = date.getMonth()
    } else {
        y = year
        m = month
    }
    return 32 - new Date(y, m, 32).getDate()
}

/*
 * 根据年获取生肖
 *
 * **参数**
 *  year {number} 年
 *
 * **示例**
 *  getAnimal(1980) // "猴"
 *  getAnimal(1981) // "鸡"
 *  getAnimal(2013) // "蛇"
 */ 
function getAnimal(year) {
    var animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    var i = (year - 4) % 12;
    return animals[i];
}

/*
 * 根据年月返回该月的两个节气，一个公历月有两个节气
 * 
 * **节气算法**
 *  http://ershisijieqi.baike.com/article-284624.html
 *  http://www.azg168.com/huangli/24sijieqi/28337.html
 *  http://blog.csdn.net/orbit/article/details/7910220
 *
 * **参数**
 *  year  {number} 年 
 *  month {number} 月
 *
 * **返回**
 *  object
 * 
 * **示例**
 *  getSolarTerm(2016, 4); // {day1: 4, term1: "清明", day2: 19, term2: "谷雨"}
 *
 */
function getSolarTerm(year, month) {
    var solarTerm = [
        "小寒", "大寒", 
        "立春", "雨水", 
        "惊蛰", "春分", 
        "清明", "谷雨", 
        "立夏", "小满", 
        "芒种", "夏至", 
        "小暑", "大暑", 
        "立秋", "处暑", 
        "白露", "秋分", 
        "寒露", "霜降", 
        "立冬", "小雪", 
        "大雪", "冬至"
    ];
    var termInfo = [
        0, 21208, 42467, 63836, 85337, 107014, 
        128867, 150921, 173149, 195551, 218072, 
        240693, 263343, 285989, 308563, 331033, 
        353350, 375494, 397447, 419210, 440795, 
        462224, 483532, 504758
    ];
    // 返回某年的第n个节气为几日(从0小寒起算)
    function computeTermDay(y, n) {
        var d = new Date((31556925974.7 * (y - 1900) + termInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return d.getUTCDate();
    }

    // month 转为 [0-11] 范畴
    month = month - 1;

    // 计算节气
    var n1 = month * 2;
    var n2 = month * 2 + 1;
    // day1, day2 为当月的两个节气日
    var day1 = computeTermDay(year, n1);
    var day2 = computeTermDay(year, n2);
    // 当月的两个节气名称
    var term1 = solarTerm[n1];
    var term2 = solarTerm[n2];

    // 返回结果
    return {
        day1: day1,
        term1: term1,
        day2: day2,
        term2: term2
    };
}

/*
 * 获取Y年的清明节是哪一天
 *  
 * **参数**
 *  yare {number} 年
 *
 * **示例**
 *  getQingMing(2015); // 0405
 *  getQingMing(2016); // 0404
 */
function getQingMing(year) {
    // 返回某年的第n个节气为几日(从0小寒起算)
    function getTerm(y, n) {
        var d = new Date((31556925974.7 * (y - 1900) + 128867 * 60000) + Date.UTC(1900, 0, 6, 2, 5))
        return d.getUTCDate();
    }    
    var day = getTerm(year);
    return '040' + day;
}

function getQingMing(year) {
    // [Y*D+C]-L
    // Y=年数后2位，D=0.2422，L=闰年数，21世纪C=4.81，20世纪=5.59
    var d = 0.2422;
    var c = 4.81;
    var y = (year + '').substr(2);
    var day = parseInt(y*d+c) - parseInt(y/4);
    return day;
}