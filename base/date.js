// 是否是闰年
function isLeapYear(year) {
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
}
/*
 * 根据日期返回星期几？
 */
function getDay(year, month, day) {
    var date = new Date(year, month-1, day)
    return date.getDay()
}

/*
 * 根据所传Date对象和offset计算
 * 例如：date:2014-08-28，offset为5，则返回的Date为2014-09-02
 */
function getDate(date, offset) {
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var year1  = date.getFullYear()
    var month1 = date.getMonth()
    var date1  = date.getDate()

    // 误差
    var sum  = date1 + offset
    var days = months[month1]

    // 返回结果
    var result = {date:null, str: ''}
    
    // 当月的情况最简单，直接把Date相加
    if (sum < days) {
        result.date = new Date(year1, month1, sum)
        result.str  = year1 + '-' + (month1+1) + '-' + sum
        return result
    }

    // 补齐当月
    var newYear  = 0
    var newMonth = 0
    var newDate  = 0
    var currMonthDiff = days - date1
    var realDiff = offset - currMonthDiff
    var diffMonth = 1
    while ( (realDiff = realDiff - months[++month1]) > 0) {
        diffMonth++
    }
    console.log(diffMonth)
}

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

function dateFormat(date, hasDay) {
    var arr, m, d, day
    var week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    if (typeof date == 'string') {
        arr = date.split('-')
        date = new Date(arr[0], arr[1]-1, arr[2])
    }
    var mm = date.getMonth()
    var dd = date.getDate()
    if (mm < 9) {
        m = '0' + (mm + 1)
    } else {
        m = mm + 1
    }
    if (dd < 10) {
        d = '0' + dd
    } else {
        d = dd
    }
    var str = date.getFullYear() + '-' + m + '-' + d
    if (hasDay) {
        day = week[date.getDay()]
        str += ' ' + day
    }
    return str
}

/*
 * 获取当前日期的后一天，如 
 *    2014-04-03 返回 2014-04-04
 *    2014-04-30 返回 2014-05-01
 *    2014-12-31 返回 2015-01-01
 * 
 *  闰年
 *    2008-02-28 返回 2014-02-29
 *    2008-02-29 返回 2014-03-01
 */
function getAfterDay(str) {
    var arr    = str.split('-')
    var year   = arr[0] - 0
    var month  = arr[1] - 1
    var day    = arr[2] - 0
    var curr = new Date(year, month, day)
    var next = curr.getTime() + (1000 * 60 * 60 * 24)
    next = new Date(next)
    return dateFormat(next)
}

// 补齐月/天的0
function fixMonthDay(num) {
    if ( (num+'').length == 1 ) {
        return '0'+num
    }
    return num
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