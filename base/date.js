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
    var months = [31,28,31,30,31,30,31,31,30,31,30,31]
    var arr = str.split('-')
    var year = arr[0] - 0
    var month = arr[1] - 1
    var day = arr[2] - 0

    // 闰年2月有29天
    var isRunNian = false
    if ( 1 == month && ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) ) {
        isRunNian = true
        months[1] = 29
    }

    var result = []
    if (month === 11 && day === 31) {
        result = [ (year+1) + '', '01', '01']
    } else {
        var days = months[month]
        if (day < days) {
            day = day + 1
            result = [year + '', (month+1) + '', day + '']
        } else {
            result = [year + '', (month+2) + '', '1']
        }
    }

    return result.join('-')
}