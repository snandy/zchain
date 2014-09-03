~function() {
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    function toDate(str) {
        var arr = str.split('-')
        return new Date(arr[0], arr[1]-1, arr[2])
    }

    // 是否是闰年
    function isLeapYear(year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)
    }

    function getSize(m1, m2) {
        var len = 0
        var diff = m2 - m1
        if (diff == 0) {
            len = 1
        } else if (diff == 1) {
            len = 2
        } else {
            len = diff + 1
        }
        return len
    }

    function calcSingleYear(year, month1, month2, date1, date2, isMult /*两年以上*/) {
        var arr = []
        var len = getSize(month1, month2)

        // 日期的getMonth()从0开始，[0-11]
        month1++

        if (len == 1 && !isMult) {
            var str = year + '-' + month1 + '-'
            arr = [str + date1, str + date2]

        } else {
            for (var i = 0; i < len; i++) {
                var str = year + '-' + month1 + '-'
                if (i == len-1) {
                    arr[i] = str + date2
                } else if (i == 0) {
                    arr[i] = str + date1
                }  else {
                    arr[i] = str + '1'
                }
                month1++
            }
        }
        return arr
    }

    // 第一年从开始月到year-12-31，如[2014-8-10, 2014-12-31]
    function calcFirstYear(year, month, date) {
        var month1 = month
        var month2 = 11
        var date1  = date
        var date2  = 1
        return calcSingleYear(year, month1, month2, date1, date2, true)
    }

    // 最后一年从year-1-1到截止月，如[2015-1-1, 2015-4-22]
    function calcLastYear(year, month, date) {
        var month1 = 0
        var month2 = month
        var date1  = 1
        var date2  = date
        return calcSingleYear(year, month1, month2, date1, date2, true)
    }

    // 计算完整年的
    // function twoConsecutive years
    function calcWholeYear(year, len) {
        var arr = []
        for (var i = 0; i < len; i++) {
            for (var mon = 0; mon <= 11; mon++) {
                arr.push( year + '-' + (mon+1) + '-1' )
            }
            year++
        }
        return arr
    }

    /*
     * 根据参数起始日期，返回的所有月份数组
     * {
     *   nature: 1, // 同年同月
     *   result: ["2014-8-13", "2014-8-29"]
     * }
     * {
     *   nature: 2, // 同年
     *   result: ["2014-8-13", "2014-9-1", "2014-10-17"]
     * }
     * {
     *   nature: 3, // 跨年
     *   result: ["2014-12-5", "2015-1-1", "2015-2-12"]  
     * }
     */
    function calcDate(start, end) {
        if (start.constructor != Date) {
            start = toDate(start)
        }
        if (end.constructor != Date) {
            end = toDate(end)
        }
        var year1  = start.getFullYear()
        var month1 = start.getMonth()
        var date1  = start.getDate()
        var year2  = end.getFullYear()
        var month2 = end.getMonth()
        var date2  = end.getDate()

        var diffYear = year2 - year1

        if (diffYear == 0) { // 一年
            return calcSingleYear(year1, month1, month2, date1, date2)

        } else if (diffYear == 1) { // 两年及以上
            var first = calcFirstYear(year1, month1, date1)
            var last  = calcLastYear(year2, month2, date2)
            return first.concat(last)
        } else { // 三年以上
            // 第一年
            var first = calcFirstYear(year1, month1, date1)
            // 最后一年
            var last  = calcLastYear(year2, month2, date2)
            // 中间的都是完整的年
            var size  = getSize(year1, year2) - 2
            var middle = calcWholeYear(year1+1, size)
            return first.concat(middle, last)
        }
    }

    /*
     *  单月日历需要的行数
     *  根据所传的日期到该月月底，计算生成该月日历需要的行数
     *  @param Date new Date(2014, 8, 1) 2014年9月1号 星期一
     *  @param Date 可选，如果没指定则默认到该月月底
     *  @return Number
     */
    function calcAMonthRow(sDate, eDate) {
        if (sDate.constructor != Date) {
            return
        }
        var year  = sDate.getFullYear()
        var month = sDate.getMonth()

        var days = months[month]
        if (isLeapYear(year) && month == 1) {
            days = 29
        }

        var arr = []
        var count = 0
        var currDay = sDate.getDay()
        var currDate = sDate.getDate()
        var lastDate = new Date(year, month, days)

        if (eDate) {
            lastDate = eDate
            days = lastDate.getDate()
        }

        for (var i = currDate; i <= days; i++) {
            var tempDate = new Date(year, month, i)
            if (tempDate.getDay() == currDay) {
                count++
                arr.push(tempDate)
            }
        }

        // 最后匹配的日期后面 还有几个格子 [日，一，二，三，四，五，六]
        // 比如周日后面有6个格子，周一后面有5个格子，依次类推
        var hash = {
            '7': 6,
            '1': 5,
            '2': 4,
            '3': 3,
            '4': 2,
            '5': 1,
            '6': 0
        }

        var lastMatch = arr[arr.length-1]
        var lastDay = lastMatch.getDay()
        var len = lastDate.getDate() - lastMatch.getDate()

        // 两个条件都成立才加1
        // 条件1：最后匹配的日期如果不是该月的最后一天，如2014年9月1号 星期一，最后匹配的是2014年9月29日 星期一，该月最后一天是30号，条件成立
        // 条件2：看最后匹配的日期后面的格子能否放置下剩下的天数，如果不可以则count+1
        if (lastMatch < lastDate && hash[lastDay] < len) {
            count++
        }

        return count
    }

    window.calcDate = calcDate
    window.calcAMonthRow = calcAMonthRow

}();
