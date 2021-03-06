var lunarInfo = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0];
var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
var nStr2 = ['初', '十', '廿', '卅'];
// 公历节日
var sFtv = ["0101 元旦", "0214 情人节", "0308 妇女节", "0312 植树节", "0315 消费者权益日", "0401 愚人节", "0501 劳动节", "0504 青年节", "0512 护士节", "0601 儿童节", "0701 建党节", "0801 建军节", "0910 教师节", "0928 孔子诞辰", "1001 国庆节", "1006 老人节", "1024 联合国日", "1224 平安夜", "1225 圣诞节"];
// 农历节日
var lFtv = ["0101 春节", "0115 元宵节", "0505 端午节", "0707 七夕情人节", "0715 中元节", "0815 中秋节", "0909 重阳节", "1208 腊八节", "1224 小年"];

// 返回农历y年的总天数
function lYearDays(y) {
    var i, sum = 348;
    for ( i = 0x8000; i > 0x8; i >>= 1) {
        sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return sum + leapDays(y);
}

// 返回农历y年闰月的天数
function leapDays(y) {
    if (leapMonth(y))
        return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    else
        return 0;
}

// 判断y年的农历中那个月是闰月,不是闰月返回0
function leapMonth(y) {
    return (lunarInfo[y - 1900] & 0xf);
}

// 返回农历y年m月的总天数
function monthDays(y, m) {
    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
}

//返回公历y年m+1月的天数
function solarDays(y, m) {
    if (m == 1)
        return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
    else
        return (solarMonth[m]);
}

function getAnimal(year) {
    var animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
    var i = (year - 4) % 12;
    return animals[i];
}

/*
 * 根据年月返回该月的两个节气，一个公历月有两个节气
 * 
 * **节气算法**
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
        var offDate = new Date((31556925974.7 * (y - 1900) + termInfo[n] * 60000) + Date.UTC(1900, 0, 6, 2, 5));
        return offDate.getUTCDate();
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

// 算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
function Dianaday(objDate) {
    var i, leap = 0, temp = 0;
    var baseDate = new Date(1900, 0, 31);
    var offset = (objDate - baseDate) / 86400000;
    this.dayCyl = offset + 40;
    this.monCyl = 14;
    for ( i = 1900; i < 2050 && offset > 0; i++) {
        temp = lYearDays(i);
        offset -= temp;
        this.monCyl += 12;
    }
    if (offset < 0) {
        offset += temp;
        i--;
        this.monCyl -= 12;
    }
    this.year = i;
    this.yearCyl = i - 1864;
    leap = leapMonth(i);
    //闰哪个月
    this.isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
        if (leap > 0 && i == (leap + 1) && this.isLeap == false) {//闰月
            --i;
            this.isLeap = true;
            temp = leapDays(this.year);
        } else {
            temp = monthDays(this.year, i);
        }
        if (this.isLeap == true && i == (leap + 1)) { //解除闰月
            this.isLeap = false;
        }
        offset -= temp;
        if (this.isLeap == false) {
            this.monCyl++;
        }
    }
    if (offset == 0 && leap > 0 && i == leap + 1)
        if (this.isLeap) {
            this.isLeap = false;
        } else {
            this.isLeap = true; --i; --this.monCyl;
        }
    if (offset < 0) {
        offset += temp; --i; --this.monCyl;
    }
    this.month = i;
    this.day = offset + 1;
}


//记录公历和农历某天的日期
function calElement(sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap) {
    this.isToday = false;
    //公历
    this.sYear = sYear;
    this.sMonth = sMonth;
    this.sDay = sDay;
    this.week = week;
    //农历
    this.lYear = lYear;
    this.lMonth = lMonth;
    this.lDay = lDay;
    this.isLeap = isLeap;
    //节日记录
    this.lunarFestival = '';
    //农历节日
    this.solarFestival = '';
    //公历节日
    this.solarTerms = '';
    //节气
}

//保存y年m+1月的相关信息
var fat = mat = 9;
var eve = 0;

function calendar(y, m) {
    fat = mat = 0;
    var sDObj, lDObj, lY, lM, lDay = 1, lL, lX = 0;
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;
    sDObj = new Date(y, m, 1);
    //当月第一天的日期
    this.length = solarDays(y, m);
    //公历当月天数
    this.firstWeek = sDObj.getDay();
    //公历当月1日星期几
    if ((m + 1) == 5) {
        fat = sDObj.getDay()
    }
    if ((m + 1) == 6) {
        mat = sDObj.getDay()
    }
    for (var i = 0; i < this.length; i++) {
        if (lDay > lX) {
            sDObj = new Date(y, m, i + 1);
            //当月第一天的日期
            lDObj = new Dianaday(sDObj);
            //农历
            lY = lDObj.year;
            //农历年
            lM = lDObj.month;
            //农历月
            lDay = lDObj.day;
            //农历日
            lL = lDObj.isLeap;
            //农历是否闰月
            lX = lL ? leapDays(lY) : monthDays(lY, lM);
            //农历当月最後一天
            if (lM == 12) {
                eve = lX
            }
            if (n == 0) {
                firstLM = lM;
            }
            lDPOS[n++] = i - lDay + 1;
        }
        this[i] = new calElement(y, m + 1, i + 1, nStr1[(i + this.firstWeek) % 7], lY, lM, lDay++, lL);
        if ((i + this.firstWeek) % 7 == 0) {
            this[i].color = 'red'; //周日颜色
        }
    }
    //节气
    var termObj = getSolarTerm(y, m+1);
    var day1 = termObj.day1 - 1;
    var day2 = termObj.day2 - 1;
    var term1 = termObj.term1;
    var term2 = termObj.term2;
    this[day1].solarTerms = term1;
    this[day2].solarTerms = term2;
    if ((this.firstWeek + 12) % 7 == 5) { //黑色星期五 
        this[12].solarFestival += '黑色星期五';
    }
    if (y == tY && m == tM) {
        this[tD - 1].isToday = true;
    }
}

//用中文显示农历的日期
function cDay(d) {
    var s;
    switch (d) {
        case 10:
            s = '初十';
            break;
        case 20:
            s = '二十';
            break;
        case 30:
            s = '三十';
            break;
        default:
            s = nStr2[Math.floor(d / 10)];
            s += nStr1[d % 10];
    }
    return (s);
}

//在表格中显示公历和农历的日期,以及相关节日 http://www.cnblogs.com/jihua/
var cld;
function drawCld(SY, SM) {
    var p1 = p2 = "";
    var i, j, s, size;
    cld = new calendar(SY, SM);
    console.log(cld);
    var animal = getAnimal(SY);
    GZ.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;【' + animal + '】';
    //生肖
    for ( i = 0; i < 42; i++) {
        sd = eval('SD' + i);
        ld = eval('LD' + i);
        sd.className = '';
        j = i - cld.firstWeek;
        if (j > -1 && j < cld.length) {//日期内
            sd.innerHTML = j + 1;
            var item = cld[j];

            if (item.isToday) { //今日颜色
                sd.style.color = '#9900FF';
            } else {
                sd.style.color = '';
            }
            if (item.lDay == 1) {//显示农历月
                ld.innerHTML = '<b>' + (item.isLeap ? '闰' : '') + item.lMonth + '月' + (monthDays(item.lYear, item.lMonth) == 29 ? '小' : '大') + '</b>';
            } else {
                ld.innerHTML = cDay(item.lDay);
            }//显示农历日
            var Slfw = Ssfw = null;
            s = item.solarFestival;
            for (var k = 0; k < lFtv.length; k++) { //农历节日
                if (parseInt(lFtv[k].substr(0, 2)) == item.lMonth) {
                    if (parseInt(lFtv[k].substr(2, 4)) == item.lDay) {
                        ld.innerHTML = lFtv[k].substr(5);
                        Slfw = lFtv[k].substr(5);
                    }
                }
                if (12 == item.lMonth) {//判断是否为除夕
                    if (eve == item.lDay) {
                        ld.innerHTML = "除夕";
                        Slfw = "除夕";
                    }
                }
            }
            for (var k = 0; k < sFtv.length; k++) {//公历节日
                if (parseInt(sFtv[k].substr(0, 2)) == (SM + 1)) {
                    if (parseInt(sFtv[k].substr(2, 4)) == (j + 1)) {
                        ld.innerHTML = sFtv[k].substr(5);
                        Ssfw = sFtv[k].substr(5);
                    }
                }
            }
            if (SM + 1 == 5) { //母亲节
                if (fat == 0) {
                    if (j + 1 == 7) {
                        Ssfw = "母亲节";
                        ld.innerHTML = "母亲节"
                    }
                } else if (fat < 9) {
                    if ((j + 1) == (7 - fat + 8)) {
                        Ssfw = "母亲节";
                        ld.innerHTML = "母亲节"
                    }
                }
            }
            if (SM + 1 == 6) {//父亲节
                if (mat == 0) {
                    if (j + 1 == 14) {
                        Ssfw = "父亲节";
                        ld.innerHTML = "父亲节"
                    }
                } else if (mat < 9) {
                    if ((j + 1) == (7 - mat + 15)) {
                        Ssfw = "父亲节";
                        ld.innerHTML = "父亲节"
                    }
                }
            }
            if (s.length <= 0) {//设置节气的颜色
                s = item.solarTerms;
                if (s.length > 0)
                    s = s.fontcolor('limegreen');
            }
            if (s.length > 0) {
                ld.innerHTML = s;
                Slfw = s;
            }//节气
            if ((Slfw != null) && (Ssfw != null)) {
                ld.innerHTML = Slfw + "/" + Ssfw;
            }
        } else {//非日期
            sd.innerHTML = '';
            ld.innerHTML = '';
        }
    }
}

//在下拉列表中选择年月时,调用自定义函数drawCld(),显示公历和农历的相关信息
function changeCld() {
    var y, m;
    y = CLD.SY.selectedIndex + 1900;
    m = CLD.SM.selectedIndex;
    drawCld(y, m);
}

//用自定义变量保存当前系统中的年月日
var Today = new Date();
var tY = Today.getFullYear();
var tM = Today.getMonth();
var tD = Today.getDate();
//打开页时,在下拉列表中显示当前年月,并调用自定义函数drawCld(),显示公历和农历的相关信息
function initial() {
    CLD.SY.selectedIndex = tY - 1900;
    CLD.SM.selectedIndex = tM;
    drawCld(tY, tM);
}
