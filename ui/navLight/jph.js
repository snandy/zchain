/*!
 * jph v0.1.0 tuan.jd.com
 * @snandy 2014-08-08 10:26:07
 *
 */
function UrlDecode(e) {
    var t = [];
    for (var n = 0; n < e.length; n++) {
        var r = e.charAt(n);
        if (r == "+") t[t.length] = " ";
        else if (r == "%") {
            var i = e.substring(n + 1, n + 3);
            parseInt("0x" + i) > 127 ? (t[t.length] = decodeURI(e.substring(n, n + 9)), n += 8) : (t[t.length] = String.fromCharCode(parseInt("0x" + i)), n += 2)
        } else t[t.length] = r
    }
    return t.join("")
}
function parse_url(e, t) {
    var n = t.indexOf("?"),
    r = t.substr(n + 1),
    i = r.split("&");
    for (var s = 0; s < i.length; s++) {
        var o = i[s].split("=");
        if (o[0].toUpperCase() == e.toUpperCase()) return o[1]
    }
    return 0
}
var X = {};
X.hook = function() {
    var e = "x_init_hook_";
    for (var t in window) {
        if (0 != t.indexOf(e)) continue;
        var n = window[t];
        if (typeof n == "function") try {
            n()
        } catch(r) {}
    }
},
X.get = function(e) {
    return X.ajax(e, "GET")
},
X.post = function(e) {
    return X.ajax(e, "POST")
},
X.ajax = function(e, t) {
    return $.ajax({
        url: e,
        dataType: "json",
        success: X.json
    }),
    !1
},
X.json = function(r) {
    var type = r.data.type,
    data = r.data.data;
    if (type == "alert") if ($("#dialog").length > 0) {
        var innerHTML = '<div id="order-pay-dialog" class="order-pay-dialog-c" style="width:380px;"><h3><span id="order-pay-dialog-close" class="close" onclick="return X.boxClose();">关闭</span>提示</h3><table cellspacing="0" cellpadding="0" style="width:100%;"><tbody><tr><td style="text-align: center; padding: 10px;">' + data + '</td></tr><tr><td style="text-align: center; padding: 10px;"><input type="submit" onclick="return X.boxClose();" class="formbutton" name="" value="确定"></td></tr></tbody></table></div>';
        X.boxShow(innerHTML, !0)
    } else alert(data);
    else if (type == "eval") eval(data);
    else if (type == "refresh") window.location.reload();
    else if (type == "updater") {
        var id = data.id,
        inner = data.html;
        $("#" + id).html(inner)
    } else if (type == "dialog") X.boxShow(data, !0);
    else if (type == "mix") for (var x in data) r.data = data[x],
    X.json(r)
},
X.getXY = function() {
    var e, t;
    return document.body.scrollTop ? (e = document.body.scrollLeft, t = document.body.scrollTop) : (e = document.documentElement.scrollLeft, t = document.documentElement.scrollTop),
    {
        x: e,
        y: t
    }
},
X.boxMask = function(e) {
    var t = $("body").height() + "px",
    n = $(window).width() + "px";
    $("#pagemasker").css({
        position: "absolute",
        "z-index": "3000",
        width: n,
        height: t,
        filter: "alpha(opacity=0.5)",
        opacity: .5,
        top: 0,
        left: 0,
        background: "#CCC",
        display: e
    }),
    $("#dialog").css("display", e)
},
X.boxShow = function(e, t) {
    var n = $("#dialog");
    n.html(e),
    t && X.boxMask("block");
    var r = n.get(0).scrollWidth,
    i = $(window).width(),
    s = i / 2 - r / 2 + "px",
    o = $(window).height(),
    u = X.getXY(),
    a = o * .15 + u.y + "px";
    return n.css("background-color", "#FFF"),
    n.css("left", s),
    n.css("top", a),
    n.css("z-index", 9999),
    n.css("display", "block"),
    !1
},
X.boxClose = function() {
    return $("#dialog").html("").css("z-index", -9999),
    X.boxMask("none"),
    !1
},
X.location = function(e) {
    $("#ifra_show").attr({
        src: e
    })
},
X.check_selected = function(e) {
    var t = 0,
    n = 0;
    if (e == "Y") var r = $("input[name='refund_couponN']"),
    i = $("input[name='refund_couponY']");
    else if (e == "N") var r = $("input[name='refund_couponY']"),
    i = $("input[name='refund_couponN']");
    else var i = $("input[name='refund_coupon']");
    var s = i.length;
    for (var o = 0; o < s; o++) i[o].checked == 0 ? t++:n++;
    if (e == "Y" || e == "N") if (t == s) for (var u = 0; u < r.length; u++) r[u].disabled = !1;
    else for (var u = 0; u < r.length; u++) r[u].disabled = !0;
    if (n >= 20) for (var a = 0; a < s; a++) i[a].checked == 0 && (i[a].disabled = !0);
    else for (var a = 0; a < s; a++) i[a].disabled = !1
},
X.utf16to8 = function(e) {
    var t,
    n,
    r,
    i;
    t = "",
    r = e.length;
    for (n = 0; n < r; n++) i = e.charCodeAt(n),
    i >= 1 && i <= 127 ? t += e.charAt(n) : i > 2047 ? (t += String.fromCharCode(224 | i >> 12 & 15), t += String.fromCharCode(128 | i >> 6 & 63), t += String.fromCharCode(128 | i >> 0 & 63)) : (t += String.fromCharCode(192 | i >> 6 & 31), t += String.fromCharCode(128 | i >> 0 & 63));
    return t
},
X.utf8to16 = function(e) {
    var t,
    n,
    r,
    i,
    s,
    o;
    t = "",
    r = e.length,
    n = 0;
    while (n < r) {
        i = e.charCodeAt(n++);
        switch (i >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            t += e.charAt(n - 1);
            break;
        case 12:
        case 13:
            s = e.charCodeAt(n++),
            t += String.fromCharCode((i & 31) << 6 | s & 63);
            break;
        case 14:
            s = e.charCodeAt(n++),
            o = e.charCodeAt(n++),
            t += String.fromCharCode((i & 15) << 12 | (s & 63) << 6 | (o & 63) << 0)
        }
    }
    return t
};
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
base64DecodeChars = new Array( - 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
X.base64encode = function(e) {
    var t,
    n,
    r,
    i,
    s,
    o;
    r = e.length,
    n = 0,
    t = "";
    while (n < r) {
        i = e.charCodeAt(n++) & 255;
        if (n == r) {
            t += base64EncodeChars.charAt(i >> 2),
            t += base64EncodeChars.charAt((i & 3) << 4),
            t += "==";
            break
        }
        s = e.charCodeAt(n++);
        if (n == r) {
            t += base64EncodeChars.charAt(i >> 2),
            t += base64EncodeChars.charAt((i & 3) << 4 | (s & 240) >> 4),
            t += base64EncodeChars.charAt((s & 15) << 2),
            t += "=";
            break
        }
        o = e.charCodeAt(n++),
        t += base64EncodeChars.charAt(i >> 2),
        t += base64EncodeChars.charAt((i & 3) << 4 | (s & 240) >> 4),
        t += base64EncodeChars.charAt((s & 15) << 2 | (o & 192) >> 6),
        t += base64EncodeChars.charAt(o & 63)
    }
    return t
},
X.base64decode = function(e) {
    var t,
    n,
    r,
    i,
    s,
    o,
    u;
    o = e.length,
    s = 0,
    u = "";
    while (s < o) {
        do t = base64DecodeChars[e.charCodeAt(s++) & 255];
        while (s < o && t == -1);
        if (t == -1) break;
        do n = base64DecodeChars[e.charCodeAt(s++) & 255];
        while (s < o && n == -1);
        if (n == -1) break;
        u += String.fromCharCode(t << 2 | (n & 48) >> 4);
        do {
            r = e.charCodeAt(s++) & 255;
            if (r == 61) return u;
            r = base64DecodeChars[r]
        }
        while (s < o && r == -1);
        if (r == -1) break;
        u += String.fromCharCode((n & 15) << 4 | (r & 60) >> 2);
        do {
            i = e.charCodeAt(s++) & 255;
            if (i == 61) return u;
            i = base64DecodeChars[i]
        }
        while (s < o && i == -1);
        if (i == -1) break;
        u += String.fromCharCode((r & 3) << 6 | i)
    }
    return u
},
X.str_encode = function(e) {
    return X.base64encode(X.utf16to8(e))
},
X.str_decode = function(e) {
    return X.utf8to16(X.base64decode(e))
},
$(document).ready(X.hook);
var WEB_ROOT = WEB_ROOT || "",
LOGINUID = LOGINUID || 0,
PI_MOBILE = /^1[345]\d{9}$|^18\d{9}$|^0\d{9,10}$/;
X.misc = {},
X.misc.copyToCB = function(e) {
    var t = $("#" + e);
    t.select();
    var n = t.val();
    if (window.clipboardData) {
        if (window.clipboardData.setData("Text", n)) {
            var r = t.attr("tip");
            return r && alert(r),
            !0
        }
    } else if (window.netscape) {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        var i = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
        if (!i) return;
        var s = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
        if (!s) return;
        s.addDataFlavor("text/unicode");
        var o = new Object,
        u = new Object,
        o = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString),
        a = n;
        o.data = a,
        s.setTransferData("text/unicode", o, a.length * 2);
        var f = Components.interfaces.nsIClipboard;
        if (!i) return ! 1;
        i.setData(s, null, f.kGlobalClipboard);
        var r = t.attr("tip");
        return r && alert(r),
        !0
    }
    return ! 1
},
X.misc.scaleimage = function(e, t) {
    var n = $(e).width();
    n > t && $(e).css("width", t + "px")
},
X.misc.inputblur = function() {
    var e = $(this).attr("value"),
    t = $(this).attr("xtip");
    if (e == t || !e) $(this).attr("value", t),
    $(this).css("color", "#999")
},
X.misc.inputclick = function() {
    var e = $(this).attr("value"),
    t = $(this).attr("xtip");
    e == t && $(this).attr("value", ""),
    $(this).css("color", "#333")
},
X.misc.smscount = function() {
    var e = $("#sms-content-id").val().length,
    t = Math.ceil(e / 70);
    $("#span-sms-length-id").html(e),
    $("#span-sms-split-id").html(t)
},
X.misc.locale = function() {
    return X.get(WEB_ROOT + "/ajax/system.php?action=locale")
},
X.misc.init_userinfo_newhead = function() {
    var e = "",
    t = $("#tid").val();
    $.ajax({
        type: "POST",
        url: "/tuaninit.php",
        data: "_charset_=utf-8&para=loginfo&id=" + t + "&time=" + Math.random(),
        dataType: "json",
        async: !0,
        success: function(e) {
            var t = e.loginSta,
            n = e.payStatus,
            r = e.newbie,
            i = e.closeTime,
            s = "";
            t ? (s = "", s += "您好，" + e.username + '！<a href="http://tuan.jd.com/account/logoutv2.action" title="退出">[退出]</a>', $("#loginbar").html(s)) : (s = "", s += '欢迎您来到京东团购！<a href="javascript:login()" title="登录">[登录]</a>&nbsp;<a href="javascript:regist()" title="免费注册">[免费注册]</a>', $("#loginbar").html(s)),
            r && $("#sysmsg-guide").show(),
            i ? ($("#sysmsg-tip").html('<div class="sysmsg-tip-top"></div><div class="sysmsg-tip-content"><div class="deal-close"><div class="focus">抱歉，您来晚了，团购已经结束啦。</div><div id="tip-deal-subscribe-body" class="body"><form id="tip-deal-subscribe-form" method="post" action="/subscribe.php" class="validator"><table><tr><td>不想错过明天的团购？立刻订阅每日最新团购信息：&nbsp;</td><td><input type="text" name="email" class="f-text" value="" require="true" datatype="email" /></td><td>&nbsp;<input class="commit" type="submit" value="订阅" /></td></tr></table></form></div></div><span id="sysmsg-tip-close" class="sysmsg-tip-close">关闭</span></div><div class="sysmsg-tip-bottom"></div>'), $("#sysmsg-tip").attr("class", "sysmsg-tip-deal-close")) : n && $("#sysmsg-tip").html('<div class="sysmsg-tip-top"></div><div class="sysmsg-tip-content">您已经下过订单，但还没有付款。<a href="/order/index.php?s=unpay">查看订单并付款</a><span id="sysmsg-tip-close" class="sysmsg-tip-close">关闭</span></div><div class="sysmsg-tip-bottom"></div>')
        },
        error: function(e, t, n) {},
        timeout: 5e3
    })
},
X.misc.init_userinfo_order = function() {
    var e = "",
    t = $("#tid").val();
    $.ajax({
        type: "POST",
        url: "/tuaninit.php",
        data: "_charset_=utf-8&para=loginfo&id=" + t + "&time=" + Math.random(),
        dataType: "json",
        async: !0,
        success: function(e) {
            var t = e.loginSta,
            n = "";
            t ? (n = "", n += "您好，" + e.username + '！<a href="http://tuan.jd.com/account/logoutv2.action" title="退出">[退出]</a>', $("#loginbar").html(n)) : (n = "", n += '欢迎您来到京东团购！<a href="javascript:login()" title="登录">[登录]</a>&nbsp;<a href="javascript:regist()" title="免费注册">[免费注册]</a>', $("#loginbar").html(n))
        },
        error: function(e, t, n) {},
        timeout: 5e3
    })
},
X.misc.message_notice_show = function() {
    var e = $("#sysmsg-success"),
    t = $("#sysmsg-error"),
    n = $("#sysmsg-success p"),
    r = $("#sysmsg-error p"),
    i = "message_notice",
    s = "message_error";
    $.ajax({
        type: "POST",
        url: "/message.php",
        data: "_charset_=utf-8&time=" + Math.random(),
        dataType: "json",
        async: !0,
        success: function(o) {
            o.notice.length > 0 && o["notice"] != undefined && o["notice"] != "" && (n.text(o.notice), $.cookie(i) && $.cookie(i, null, {
                path: "/"
            }), e.show()),
            o.error.length > 0 && o["error"] != undefined && o["error"] != "" && (r.text(o.error), $.cookie(s) && $.cookie(s, null, {
                path: "/"
            }), t.show())
        },
        error: function(e, t, n) {},
        timeout: 5e3
    })
},
X.misc.get_now_time_str = function() {
    var e = new Date,
    t = e.getFullYear(),
    n = e.getMonth() + 1,
    r = e.getDate(),
    i = e.getHours(),
    s = e.getMinutes(),
    o = e.getSeconds(),
    u = t + "-" + (n < 10 ? "0" + n: n) + "-" + (r < 10 ? "0" + r: r) + " " + (i < 10 ? "0" + i: i) + ":" + (s < 10 ? "0" + s: s) + ":" + (o < 10 ? "0" + o: o);
    return u
},
X.misc.multirotate = function(e, t) {
    var n = 0,
    r = $("#" + t + " a").size();
    if (r < 2) return;
    var i = function() {
        var e = n + 1;
        n == r - 1 && (e = 0),
        s(e),
        n++,
        n > r - 1 && (n = 0, e = n + 1)
    };
    $("#" + e).everyTime(3e3, "imagerotate", i),
    $("#" + e + " li,#" + t + " a").hover(function() {
        $("#" + e).stopTime("imagerotate")
    },
    function() {
        $("#" + e).everyTime(3e3, "imagerotate", i)
    }),
    $("#" + t + " a").click(function() {
        var e = $("#" + t + " a").index(this);
        return n != e && (s(e), n = e),
        !1
    });
    var s = function(r) {
        $("#" + e + " li").eq(n).css({
            opacity: "0.5"
        }).animate({
            left: "-440px",
            opacity: "1"
        },
        "slow", 
        function() {
            $(this).css({
                left: "440px"
            })
        }).end().eq(r).animate({
            left: "0px",
            opacity: "1"
        },
        "slow", 
        function() {
            $("#" + t + " a").siblings("a").removeClass("active").end().eq(r).addClass("active")
        })
    }
},
X.misc.trim = function(e) {
    return e.replace(/^\s*(.*?)[\s\n]*$/g, "$1")
},
X.misc.checkEmail = function(e) {
    var t = /^[\w\-\.]+@[\w\-]+(\.[\w\-]+)*(\.[a-z]{2,})$/;
    return ! t.test(e) || e.indexOf(".") == -1 ? !1: !0
},
X.team = {},
X.team.consultation_again = function() {
    $("#consult-content").val(""),
    $("#consult-add-form").toggle(),
    $("#consult-add-succ").toggle()
},
X.team.dealbuy_farefree = function(e) {
    var t = parseInt($("#deal-buy-quantity-input").attr("ff"));
    if (t > 0 && t <= e) $("#deal-express-total").html("0");
    else {
        var n = parseInt($("#deal-express-price").attr("v"));
        $("#deal-express-total").html(n)
    }
},
X.team.dealbuy_totalCount = function() {
    var e = parseInt($("#deal-buy-quantity-input").val());
    return e > 0 ? e: 0
},
X.team.dealbuy_totalMoney = function(e) {
    var t = parseFloat($("#deal-express-price").attr("v"), 10);
    isNaN(t) && (t = 0);
    var n = $("#deal-farefree").val();
    n > 0 && e >= n ? (t = 0, $("#deal-express-total").html("0"), $("#deal-express-total").attr("v", 0)) : ($("#deal-express-total").html(t), $("#deal-express-total").attr("v", t));
    var r = parseFloat($("#deal-team-price").val(), 10),
    i = e * r + t;
    $("#deal-buy-list-total").html("￥" + i.toFixed(2)),
    $("#deal-buy-goods-total").html("￥" + i.toFixed(2)),
    $("#deal-buy-balance-total").html("￥" + i.toFixed(2))
},
X.team.buy_check_login = function(e) {
    var t = "http://" + window.location.hostname;
    return $.ajax({
        type: "POST",
        url: "/tuaninit.php",
        data: "_charset_=utf-8&para=buylogin&time=" + Math.random(),
        dataType: "json",
        async: !0,
        success: function(n) {
            var r = n.loginSta;
            r ? window.location = t + e: login(e)
        },
        error: function(e, t, n) {},
        timeout: 5e3
    }),
    !1
},
X.team.team_buy_check_email = function() {
    var e = !1,
    t = $("#email_ok").attr("checked"),
    n = $("#sub_email").val();
    return t == 1 ? X.misc.checkEmail(n) ? e = !0: alert("请输入邮箱地址!\n邮箱格式不正确!") : e = !0,
    e
},
X.team.team_buy_check_sku = function() {
    var e = !1,
    t = $("input[name='condbuy']");
    for (var n = 0; n < t.size(); n++) if (t[n].checked == 1) {
        e = !0;
        break
    }
    return e || alert("请选择要订购的商品！"),
    e
},
X.team.dealbuy_init_last_address = function() {
},
X.team.dealbuy_init_user_address = function() {
},
X.team.dealbuy_province_form_select = function(e) {
},
X.team.dealbuy_city_form_select = function(e, t) {
},
X.team.dealbuy_area_form_select = function(e, t) {
},
X.team.dealbuy_change_addressinfo = function(e) {
},
X.team.dealbuy_save_addressinfo = function() {
},
X.team.dealbuy_add_useraddress = function() {
},
X.team.dealbuy_setup_hidden_info = function(e, t, n, r) {
},
X.team.dealbuy_change_form_display = function(e) {
},
Date.prototype.format = function(e, t) {
    var n = {
        "M+": this.getMonth(e) + 1,
        "d+": this.getDate(e),
        "h+": this.getHours(e),
        "m+": this.getMinutes(e),
        "s+": this.getSeconds(e),
        "q+": Math.floor((this.getMonth(e) + 3) / 3),
        S: this.getMilliseconds(e)
    };
    /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear(e) + "").substr(4 - RegExp.$1.length)));
    for (var r in n)(new RegExp("(" + r + ")")).test(t) && (t = t.replace(RegExp.$1, RegExp.$1.length == 1 ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
    return t
},
X.team.isEmail = function(e) {
    var t = /^[\w\-\.]+@[\w\-]+(\.[\w\-]+)*(\.[a-z]{2,})$/;
    return e != "" ? !t.test(e) || e.indexOf(".") == -1 ? ($("#email").attr({
        datatype: "email",
        require: "true"
    }), $("#email").css("backgroundColor", "#FFCC33"), !1) : ($("#email").css("backgroundColor", "#FFFFFF"), !0) : ($("#email").css("backgroundColor", "#FFFFFF"), $("#email").attr({
        datatype: "",
        require: ""
    }), !0)
}
$("#deal-subscribe-form").submit(function() {
    var e = $("#deal-subscribe-form-email").attr("value"),
    t = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e);
    return t ? $(this).find(".dingyue-prompt").hide() : $(this).find(".dingyue-prompt").show(),
    t
})
$("#deal-subscribe-form-email").focus(function() {
    $(this).nextAll(".dingyue-prompt").hide()
})
$("#detail-deal-subscribe-form").submit(function() {
    var e = $("#detail-deal-subscribe-form-email").attr("value"),
    t = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e);
    return t ? $(this).find(".dingyue-prompt").hide() : $(this).find(".dingyue-prompt").show(),
    t
})
$("#detail-deal-subscribe-form-email").focus(function() {
    $(this).nextAll(".dingyue-prompt").hide()
})
~function() {

var guid = 1
var global = []
var dataKey = '$.timer'
var regex = /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/
var powers = {
    'ms': 1,
    'cs': 10,
    'ds': 100,
    's': 1000,
    'das': 10000,
    'hs': 100000,
    'ks': 1000000
}

function timeParse(value) {
    if (value == undefined || value == null) return
    var result = regex.exec($.trim(value.toString()))
    if (result[2]) {
        var num = parseFloat(result[1])
        var mult = powers[result[2]] || 1
        return num * mult
    } else {
        return value
    }
}
$.extend({
    timer: {
        add: function(element, interval, label, fn, times) {
            var counter = 0
            if ($.isFunction(label)) {
                if (!times) {
                    times = fn
                }
                fn = label
                label = interval
            }
            interval = timeParse(interval)

            if (typeof interval != 'number' || isNaN(interval) || interval < 0) return

            if (typeof times != 'number' || isNaN(times) || times < 0) {
                times = 0
            }

            var timers = $.data(element, dataKey) || $.data(element, dataKey, {})

            if (!timers[label]) {
                timers[label] = {}
            }

            fn.timerID = fn.timerID || guid++;
            var handler = function() {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false) {
                    $.timer.remove(element, label, fn)   
                }
            }
            handler.timerID = fn.timerID;

            if (!timers[label][fn.timerID]) {
                timers[label][fn.timerID] = setInterval(handler, interval)
            }
            global.push(element)
        },
        remove: function(element, label, fn) {
            var timers = $.data(element, dataKey), ret
            if (timers) {
                if (!label) {
                    for (label in timers) {
                        this.remove(element, label, fn)
                    }
                } else if (timers[label]) {
                    if (fn) {
                        if (fn.timerID) {
                            clearInterval(timers[label][fn.timerID])
                            delete timers[label][fn.timerID]
                        }
                    } else {
                        for (var fn in timers[label]) {
                            clearInterval(timers[label][fn])
                            delete timers[label][fn]
                        }
                    }
                    for (ret in timers[label]) break;
                    if (!ret) {
                        ret = null;
                        delete timers[label]
                    }
                }
                for (ret in timers) break;
                if (!ret) $.removeData(element, dataKey)
            }
        }
    }
})

$.fn.extend({
    everyTime: function(interval, label, fn, times) {
        return this.each(function() {
            $.timer.add(this, interval, label, fn, times)
        })
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            $.timer.add(this, interval, label, fn, 1)
        })
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            $.timer.remove(this, label, fn)
        })
    }
})

}();



/**
 * 虚拟类团购
 */
function multiclock_new(timeleft, counter, teamId) {  //auto time update in team_view_*.html
    var diff = parseInt($('#'+timeleft).attr('diff'))
    if (!diff > 0) return
    var time1 = (new Date).getTime()
    var $elem = $('strong#' + counter)
    $elem.html('<span></span>' + multiclock_new.miao + '秒')
    var callback = function() {
        var time2 = (new Date).getTime()
        var ls = diff + time1 - time2
        if (ls > 0) {
            // 计算天数
            var ld = parseInt(ls / 86400000)
            // 不足一天毫秒数
            ls = ls % 86400000;

            // 计算小时数
            var lh = parseInt(ls / 3600000)
            // 不足一小时的毫秒数
            ls = ls % 3600000;

            // 计算分钟数
            var lm = parseInt(ls / 60000)
            // 不足一分钟的毫秒数
            var ls = parseInt( Math.round(ls % 60000) / 1000 )
            
            if (ld < 1) {
                var html = lh + '小时' + lm + '分钟' + ls
                $elem.find('span').html(html)
            } else if (ld >= 1 && ld < 3) {
                var html = ld + '天' + lh + '小时' + lm + '分钟'
                $elem.html(html)
            } else {
                var html = '3天以上'
                $elem.html(html)
            }
        } else {
            $elem.stopTime('"+counter')
            $elem.html('end')
            var url = "http://tuan.jd.com/team-"+teamId+".html?"+ Math.random()
            location.replace(url)
        }
    }
    $elem.everyTime(99, counter, callback)
}
multiclock_new.miao = '<img width="18" height="16" src="http://misc.360buyimg.com/tuangou/2013/skin/i/miao.gif">';
/**
 * 实物类团购
 */
multiclock_forshow = function(timeleft, counter, teamId) { //auto time update in team_view_jdgoods.html
    var diff = parseInt($('#'+timeleft).attr('diff'))
    if (!diff > 0) return
    var time1 = (new Date()).getTime()
    var $elem = $('strong#' + counter)
    $elem.html('<span></span>' + multiclock_new.miao + '秒')
    var callback = function() {
        var time2 = (new Date()).getTime()
        var ls = diff + time1 - time2
        if (ls > 0) {
            var ld = parseInt(ls / 86400000)
            ls = ls % 86400000;
            var lh = parseInt(ls / 3600000)
            ls = ls % 3600000;
            var lm = parseInt(ls / 60000)
            var ls = parseInt( Math.round(ls % 60000) / 1000 )
            if (ld < 1) {
                var html = lh + '小时' + lm + '分钟' + ls
            } else {
                var html = ld + '天' + lh + '小时' + lm + '分钟' + ls
            }
            $elem.find('span').html(html)
        } else {
            $elem.stopTime('"+counter')
            $elem.html('end')
            var url = "http://tuan.jd.com/team-"+teamId+".html?r=" + Math.random()
            location.replace(url)
        }
    }
    $elem.everyTime(996, counter, callback)
}

/**
 * 频道页品牌团倒计时
 * @param timeleft
 */
function multiclock_channel_brand_teams(timeleft) {
    var a = parseInt($("#"+timeleft).attr('diff'));
    if (!a>0) return;
    var b = (new Date()).getTime();
    var e = function() {
        var c = (new Date()).getTime();
        var ls = a + b - c;
        if ( ls > 0 ) {
			var ld = parseInt(ls/86400000) ; ls = ls % 86400000;
			var lh = parseInt(ls/3600000) ; ls = ls % 3600000;
			var lm = parseInt(ls/60000) ;
			var ls = parseInt(Math.round(ls%60000)/1000);
			var html;
			if (ld >= 3) {
				 html = '剩余时间3天以上'
			} else if (ld == 0) {
				if (lh > 0) {
					html = '剩余时间' + lh + '小时' + lm + '分钟' + ls + '秒';
				} else {
					if(lm > 0) {
						html = '剩余时间' + lm + '分钟' + ls + '秒';
					} else {
						html = '剩余时间' + ls + '秒';
					}
				}
			} else { 
				html = '剩余时间' + ld + '天' + lh + '小时' + lm + '分钟' + ls + '秒';
			}
			$('#'+timeleft).html(html)
		}
    }
    $('#'+timeleft).everyTime(996, timeleft, e)
}
/**
 *####分享到####
 *
 * 类型有 sinaweibo 新浪微博   qqweibo 腾讯微博    qzone QQ空间      renren 人人网      weibo163 网易微博   
 * kaixin001 开心网    douban 豆瓣网      sohuweibo 搜狐微博      qq QQ好友     yixin 易信    
 *
 ***参数**
 *
 *  - `content` {String}  分享的内容
 *  - `url` {String}  分享的url, 默认为location.href
 *  - `pic` {String}   分享的图片 (可选)
 *  - `title` {String}   内容略要 (可选)
 *  - `sinaweiboAppkey` {String}   新浪微博appkey (可选)
 *
 ***举例**
 * 
 *js部分
 *
 *  var scrollbar = $('#scrollbar').scrollbar();
 *  scrollbar.update();//更新时调用
 * 
 *html部分
 *  
 *   <div id="share" class="ui-share">
 *      <a class="sinaweibo"></a> 
 *      <a class="qqweibo"></a> 
 *      <a class="qzone"></a> 
 *      <a class="renren"></a> 
 *      <a class="weibo163"></a> 
 *      <a class="kaixin001"></a> 
 *      <a class="douban"></a> 
 *      <a class="sohuweibo"></a> 
 *      <a class="qq"></a>
 *      <a class="yixin"></a> 
 *  </div>
 *
 ***ctime**
 * 2014-4-18 13:30:25
 *
 */

~function($, undefined) {

var obj = {
    options: {
        hasCssLink:true,
        baseVersion:'1.0.0',
        cssLinkVersion:'1.0.0',
        content:'', 
        url:'', 
        pic:'', 
        title:'',
        sinaweiboAppkey:null
    },
    share:function(type, getNameTag) {
        var opts = this.options;
        var name = typeof(getNameTag) == 'undefined' ? null : getNameTag;
        var content = encodeURIComponent(opts.content);
        var url = opts.url ? encodeURIComponent(opts.url) : encodeURIComponent(location.href);
        var pic = opts.pic ? encodeURIComponent(opts.pic) : '';
        var title = opts.title ? encodeURIComponent(opts.title) : encodeURIComponent(window.document.title);
        
        var share_to = null;
        switch (type) {
            case "sinaweibo":
                if(name) name = "新浪微博";
                var appkey = '';
                if (opts.sinaweiboAppkey) {
                    appkey = "&appkey=" + opts.sinaweiboAppkey;
                }
                share_to = "http://service.weibo.com/share/share.php?url=" + url + appkey+"&title=" + content + "&pic=" + pic;
                
                break;
            case "qqweibo":
                if(name) name = "腾讯微博";
                share_to = "http://share.v.t.qq.com/index.php?c=share&a=index&f=q2&url=" + url + "&title=" + content + "&pic=" + pic;
                break;
            case "qzone":
                if(name) name = "QQ空间";
                share_to = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + url + "&title=" + content + "&desc=&summary=";
                break;
            case "renren"://
                if(name) name = "人人网";
                share_to = "http://widget.renren.com/dialog/share?resourceUrl=" + url + "&pic=" + pic + "&title="+title+"&description=" + content + "&srcUrl=" + url;
                break;
            case "weibo163" :
                if(name) name = "网易微博";
                share_to = "http://t.163.com/article/user/checkLogin.do?info="+content+""+url+"&images="+pic;
                break;
            case "kaixin001" :
                if(name) name = "开心网";
                share_to = "http://www.kaixin001.com/rest/records.php?url="+url+"&style=11&content=" + content;
                break;
            case "douban" ://
                if(name) name = "豆瓣网";
                share_to = "http://www.douban.com/share/service?href="+url+"&name="+title+"&text="+content;
                break;
            case "sohuweibo" :
                if(name) name = "搜狐微博";
                share_to = "http://t.sohu.com/third/post.jsp?url="+url+"&title="+ content;
                break;
            case "qq" :
                if(name) name = "QQ好友";
                share_to = "http://connect.qq.com/widget/shareqq/index.html?url="+url+"&desc="+ content+"&summary="+title;
                break;
            case "yixin" :
                if(name) name = "易信";
                share_to = "http://open.yixin.im/share?type=webpage&text="+ content+"&pic="+pic+"&url="+url;
                break;
        }
        
        if (name) {
            return name;
        }
        
        if(share_to){
            window.open(share_to);
        }
    }
}

$.fn.share = function(options) {
    var $elem = $(this)
    $.extend(obj.options, options)
    var shareLink = $elem.find('a');
    shareLink.each(function (){
        var _this = $(this);
        var type = _this.attr('class');
        _this.attr('href', 'javascript:void(0)');
        _this.attr('title', '分享到'+obj.share(type, true));
        
        _this.bind('click', function (event){
            var type = $(this).attr('class');
            obj.share(type);
            event.stopPropagation();
        });
    });

}

}(jQuery);

/**
 * JavaScript Dragdrop Library
 * Copyright (c) 2010 snandy
 * 
 * 基本拖拽
 * var dd = new Dragdrop({
 *         target    拖拽元素 HTMLElemnt 必选
 *         bridge    指定鼠标按下哪个元素时开始拖拽，实现模态对话框时用到 
 *         dragable  是否可拖拽    (true)默认
 *         dragX     true/false false水平方向不可拖拽 (true)默认
 *         dragY     true/false false垂直方向不可拖拽 (true)默认
 *         area      [minX,maxX,minY,maxY] 指定拖拽范围 默认任意拖动
 *         inwin     true/false 仅在浏览器窗口内拖动
 *         fixed     true/false 默认true
 * });
 * 
 * 事件
 * dragstart
 * dd.ondragstart = function() {}
 * 
 * darg
 * dd.ondrag = function() {}
 * 
 * dragend
 * ondragend = function() {}
 * 
 * demo.html
 * 
 */

Dragdrop = function(window) {
    var doc = window.document
    var w3c = !!window.addEventListener
    var ie6 = /msie 6/i.test(navigator.userAgent)
    var addEvent = w3c ?
            function(el, type, fn) { el.addEventListener(type, fn, false) } :
            function(el, type, fn) { el.attachEvent("on" + type, fn) }
    var removeEvent = w3c ?
            function(el, type, fn) { el.removeEventListener(type, fn, false) } :
            function(el, type, fn) { el.detachEvent("on" + type, fn) }
    
    function getWinWidth() {
        var arr = []
        if (window.innerWidth) {
            arr.push(window.innerWidth)
        }
        if (document.documentElement) {
            arr.push(document.documentElement.clientWidth)
        }
        return Math.min.apply({}, arr)
    }
    function getWinHeight() {
        var arr = []
        if (window.innerHeight) {
            arr.push(window.innerHeight)
        }
        if (document.documentElement) {
            arr.push(document.documentElement.clientHeight)
        }
        return Math.max.apply({}, arr)
    }
    function getStyle(el, name) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(el, null)[name]
        } else {
            return el.currentStyle[name]
        }
    }
    function getWH(el, name) {
        var val = name === "width" ? el.offsetWidth : el.offsetHeight
        var which = name === "width" ? ['Left', 'Right'] : ['Top', 'Bottom']
         
        // display is none
        if (val === 0) {
            return 0
        }
 
        for (var i = 0, a; a = which[i++];) {
            val -= parseFloat( getStyle(el, "border" + a + "Width") ) || 0
            val -= parseFloat( getStyle(el, "padding" + a) ) || 0
        }
     
        return val
    }
    
    function Config(opt) {
        this.target   = opt.target
        this.bridge   = opt.bridge
        this.dragable = opt.dragable !== false
        this.dragX    = opt.dragX !== false
        this.dragY    = opt.dragY !== false
        this.area     = opt.area || []
        this.inwin    = opt.inwin
        this.fixed    = opt.fixed !== false
    }
        
    return function(opt) {
        var conf, defaultConf, diffX, diffY, dd
        
        function Dragdrop(opt) {
            var elDown
            if (!opt) return
            
            conf = new Config(opt)
            defaultConf = new Config(opt)
            elDown = conf.bridge || conf.target
            
            addEvent(elDown, 'mouseover', function() {
                elDown.style.cursor = 'move'
            })
            addEvent(elDown, 'mousedown', mousedown)

            // 出现滚动条时保持fixed
            if (conf.fixed) {
                var docEl = doc.documentElement
                var target = conf.target
                if (ie6) {
                    addEvent(window, 'scroll', function() {
                        var winHeight = getWinHeight()
                        var top = (winHeight)/2 - (target.clientHeight)/2 + docEl.scrollTop
                        target.style.top = top + 'px'
                    })                    
                } else {
                    var winHeight = getWinHeight()
                    var targetHeight = getWH(target, 'height')
                    target.style.top = (winHeight-targetHeight) / 2 + 'px'
                    target.style.position = 'fixed'
                }
            }
        }
        Dragdrop.prototype = {
            dragX: function() {
                conf.dragX = true
                conf.dragY = false
            },
            dragY: function(b) {
                conf.dragY = true
                conf.dragX = false
            },
            dragAll: function() {
                conf.dragX = true
                conf.dragY = true
            },
            setArea: function(a) {
                conf.area = a
            },
            setBridge: function(b) {
                conf.bridge = b
            },
            setDragable: function(b) {
                conf.dragable = b
            },
            reStore: function() {
                conf = new Config(defaultConf)
                conf.target.style.top = '0px'
                conf.target.style.left = '0px'
            },
            getDragX: function() {
                return conf.dragX
            },
            getDragY: function() {
                return conf.dragY
            }
        }
        function mousedown(e) {
            var el = conf.target
            // el.style.position = 'absolute'
            
            if(window.captureEvents){ //标准DOM
                e.stopPropagation()
                e.preventDefault()
                addEvent(window, "blur", mouseup)
            }else if(el.setCapture){ //IE
                el.setCapture()
                e.cancelBubble = true
                addEvent(el, "losecapture", mouseup)
            }
            
            diffX = e.clientX - el.offsetLeft
            diffY = e.clientY - el.offsetTop
            addEvent(doc, 'mousemove', mousemove)
            addEvent(doc, 'mouseup', mouseup)
            // dragstart event
            if (dd.ondragstart) {
                dd.ondragstart()
            }
        }
        function mousemove(e) {
            var el = conf.target, minX, maxX, minY, maxY,
                moveX = e.clientX - diffX,
                moveY = e.clientY - diffY
    
            if (conf.inwin) {
                var bodyWidth = getWinWidth()
                var bodyHeight = getWinHeight()
                var winX = bodyWidth - Math.max(el.offsetWidth, el.clientWidth)
                var winY = bodyHeight - Math.max(el.offsetHeight, el.clientHeight)
                conf.area = [0, winX, 0, winY]
            }
            if (conf.area) {
                minX = conf.area[0]
                maxX = conf.area[1]
                minY = conf.area[2]
                maxY = conf.area[3]
                moveX < minX && (moveX = minX) // left 最小值
                moveX > maxX && (moveX = maxX) // left 最大值
                moveY < minY && (moveY = minY) // top 最小值
                moveY > maxY && (moveY = maxY) // top 最大值
            }
            if (conf.dragable) {
                //设置位置，并修正margin
                moveX = moveX - (parseInt(el.style.marginLeft, 10) || 0)
                moveY = moveY - (parseInt(el.style.marginTop, 10) || 0)

                conf.dragX && (el.style.left = moveX + 'px')
                conf.dragY && (el.style.top =  moveY + 'px')
            }
            // drag event
            if (dd.ondrag) {
                dd.ondrag(moveX, moveY)
            }
        }
        function mouseup(e) {
            var el = conf.target
            el.style.cursor = ''
            removeEvent(doc, 'mousemove', mousemove)
            removeEvent(doc, 'mouseup', mouseup)
            
            if (window.releaseEvents) { //标准DOM
                removeEvent(window, 'blur', mouseup)
            } else if(el.releaseCapture) { //IE
                removeEvent(el, 'losecapture', mouseup)
                el.releaseCapture()
            }
            // dragend evnet
            if (dd.ondragend) {
                dd.ondragend()
            }
        }
        
        return dd = new Dragdrop(opt)
    }
    
}(this);
/**
 * 重写Jslider
 */
$.fn.Jslider = function(option, callback, frameCallback) {
    if (!this.length) return
    if (typeof option == 'function') {
        callback = option;
        option = {};
    }
    var settings = $.extend({
        auto: false,
        reInit: false,//重新初始化
        data: [],
        defaultIndex: 0,
        slideWidth: 0,
        slideHeight: 0,
        slideDirection: 1,//1,left;2,up;3,fadeIn
        speed: 'normal',
        stay: 5000,
        delay: 150,
        maxAmount: null,
        template: null,
        showControls: true,
        overleaveSelector: 'img'
    }, option||{})

    var element = $(this),
    elementItems = null,
    elementControls = null,
    elementControlsItems = null,
    mainTimer = null,
    controlTimer = null,
    init = function() {
        var object
        if (settings.maxAmount && settings.maxAmount < settings.data.length) {
            settings.data.splice(settings.maxAmount,settings.data.length-settings.maxAmount)
        }
        if (typeof settings.data == 'object') {
            if (settings.data.length) {
                object = {};
                object.json = settings.data;
            } else {
                object = settings.data;
            }
        }
        var template = settings.template
        if (settings.reInit) {
            var htmlItems
            var htmlControls = template.controlsContent.process(object)
            object.json = object.json.slice(1)
            htmlItems = template.itemsContent.process(object)
            element.find(".slide-items").eq(0).append(htmlItems)
            element.find(".slide-controls").eq(0).html(htmlControls)
        } else {
            var newTemplate = template.itemsWrap.replace("{innerHTML}", template.itemsContent) + template.controlsWrap.replace("{innerHTML}",template.controlsContent),
                html=newTemplate.process(object);
            element.html(html);
        }
        elementItems = element.find('.slide-items');
        elementControls = element.find('.slide-controls');
        elementControlsItems = elementControls.find('span');

        // 一张图时没有轮播动画，没有数字页码
        if (settings.data.length > 1) {
            bindEvents()
            autoRun()            
        } else {
            elementControls.hide()
        }

        if (callback) {
            callback(element)
        }
    },
    bindEvents = function() {
        var olSelector = settings.overleaveSelector
        elementItems.find(olSelector).bind('mouseover', function() {
            clearInterval(mainTimer)
        }).bind('mouseleave',function() {
            autoRun();
        })

        elementControlsItems.bind('mouseover', function(){
            var index = elementControlsItems.index(this)
            if (index == settings.defaultIndex) return;
            play(index);
        }).bind('mouseleave',function(){
            autoRun();
        })
    },
    play = function(index) {
        elementControlsItems.removeClass('curr');
        elementControlsItems.eq(index).addClass('curr');

        if (settings.slideDirection == 3) {
            var children = elementItems.children(),
            last = children.eq(settings.defaultIndex),
            current = children.eq(index);
            last.fadeOut(300);
            current.fadeIn(800);
            settings.defaultIndex = index;
        }
        if (frameCallback) {
            frameCallback(index) 
        }
    },
    autoRun = function() {
        clearInterval(mainTimer);
        if (settings.auto) {
            mainTimer = setInterval(function() {
                var v = settings.defaultIndex;
                v++;
                if (v == settings.data.length) {
                    v = 0;
                }
                play(v);
            }, settings.stay)
        }
    };
    init();
}

/**
 *
 * 图片滚动插件
 */
$.fn.imgScroll = function(options, callback) {
    // 默认参数
    var defaults = {
        // 动态数据
        data: [],
        // 数据渲染模板
        template: null,
        // 事件类型=click,mouseover
        evtType: 'click',
        // 可见图片个数
        visible: 1,
        // 方向x,y
        direction: 'x',
        // 按钮-下一张，默认为元素选择器字符串，也可以是jQuery对象
        next: '#next',
        // 按钮-上一张，默认为元素选择器字符串，也可以是jQuery对象
        prev: '#prev',
        // 滚动到头按钮class
        disableClass: 'disabled',
        // 滚动到头按钮class是否加方向前缀prev-, next-
        disableClassPerfix: false,
        // 滚动速度
        speed: 300,
        // 每次滚动图片个数
        step: 1,
        // 是否循环
        loop: false,
        // 是否自动播放
        autoPlay: false,
        // 自动播放时间
        autoPlayTime: 2000,
        // 无法(不足以)滚动时是否显示控制按钮
        showControl: false,
        // 每个滚动元素宽度，默认取li的outerWidth
        width: null,
        // 每个滚动元素宽度，默认取li的outerHeight
        height: null,
        // 是否显示滚动当前状态(1,2,3,4,...)
        navItems: false,
        // 包围元素的class，默认为'scroll-nav-wrap'
        navItmesWrapClass: 'scroll-nav-wrap',
        // 当前项目高亮class
        navItemActivedClass: 'current',
        // 滚动分页状态条==<<==(n/total)==>>==
        status: false,
        // 滚动分布状态条包围元素选择器，如页面已准备好元素可传元素css selector否则生成一个class为scroll-status-wrap的div插入到滚动后面
        statusWrapSelector: '.scroll-status-wrap',

        end: function() {}
    };

    // 继承 初始化参数 - 替代默认参数
    var settings = $.extend(defaults, options);
    var TPL = settings.template || '<ul>{for slide in list}<li><a href="${slide.href}" target="_blank"><img src="${slide.src}" alt="${slide.alt}" /></a></li>{/for}</ul>';

    // 自动播放为true时，loop也为true
    if (settings.autoPlay) {
        settings.loop = true
    }

    // 实例化每个滚动对象
    return this.each(function() {

        var that = $(this),
            ul = that.find('ul').eq(0),
            nextFrame, lis = ul.children('li'),
            len = lis.length,
            liWidth = null,
            liHeight = null,

            btnNext = typeof settings.next == 'string' ? $(settings.next) : settings.next,
            btnPrev = typeof settings.prev == 'string' ? $(settings.prev) : settings.prev,

            current = 0,
            step = settings.step,
            visible = settings.visible,
            total = Math.ceil((len - visible) / step) + 1,
            loop = settings.loop,
            dir = settings.direction,
            evt = settings.evtType,

            disabled = settings.disableClass,
            prevDisabled = settings.disableClassPerfix ? 'prev-' + disabled : disabled,
            nextDisabled = settings.disableClassPerfix ? 'next-' + disabled : disabled,

            nav = settings.navItems,
            navWrap = settings.navItmesWrapClass,
            navHasWrap = $('.' + navWrap).length > 0,
            navClass = settings.navItemActivedClass,

            status = settings.status,
            statusWrap = settings.statusWrapSelector,
            hasStatusWrap = $(statusWrap).length > 0,

            last = false,
            first = true,

            perfect = (len - visible) % step === 0;

        /**
         * direction 滚动方向
         */
        function resetStyles(direction) {
            // 重置按钮样式
            if (len > visible && !loop) {
                btnPrev.addClass(prevDisabled);
                btnNext.removeClass(nextDisabled);
            } else {
                if (!loop) {
                    btnNext.addClass(nextDisabled);
                }
            }

            // 重置每个滚动列表项样式
            if(lis.eq(0).css('float') !== 'left') {
                lis.css('float', 'left');
            }

            // 重新设置滚动列表项高宽
            liWidth = settings.width || lis.eq(0).outerWidth(true);
            liHeight = settings.height || lis.eq(0).outerHeight();

            // 重置最外层可视区域元素样式
            that.css({
                'position': that.css('position') == 'static' ? 'relative' : that.css('position'),
                'width': direction == 'x' ? liWidth * visible : liWidth,
                'height': direction == 'x' ? liHeight : liHeight * visible,
                'overflow': 'hidden'
            });


            // 重置滚动内容区元素样式
            ul.css({
                'position': 'absolute',
                'width': direction == 'x' ? liWidth * len : liWidth,
                'height': direction == 'x' ? liHeight : liHeight * len,
                'top': 0,
                'left': 0
            })
        }

        /**
         * 重新初始化参数
         */
        function reInitSettings() {
            len = settings.data.length;
            ul = that.find('ul').eq(0);
            lis = ul.children('li');
            total = Math.ceil((len - visible) / step) + 1;
            perfect = (len - visible) % step === 0;
        }

        /**
         * direction 滚动方向
         */
        function renderHTML(data) {
            var r = {list: data};
            that.html(TPL.process(r));
            reInitSettings();
        }

        /**
         * index 切换到第几页滚动
         * isPrev 是否点击上一张
         */
        function switchTo(index, isPrev) {
            // 是否正在动画中
            if (ul.is(':animated')) {
                return false;
            }

            if (loop) {
                if (first && isPrev) {
                    current = total;
                }
                if (last && !isPrev) {
                    current = -1;
                }
                index = isPrev ? --current : ++current;
            } else {
                // 是否滚动到头或者尾
                if (first && isPrev || last && !isPrev) {
                    return false;
                } else {
                    index = isPrev ? --current : ++current;
                }
            }

            // 滚动下一帧位移量
            nextFrame = dir == 'x' ? {
                left: index >= (total - 1) ? -(len - visible) * liWidth : -index * step * liWidth
            } : {
                top: index >= (total - 1) ? -(len - visible) * liHeight : -index * step * liHeight
            };

            // 滚动完成一帧回调
            function onEnd() {
                if (!loop) {
                    // 滚动尾
                    if (len - index * step <= visible) {
                        btnNext.addClass(nextDisabled);
                        last = true;
                    } else {
                        btnNext.removeClass(nextDisabled);
                        last = false;
                    }

                    // 滚动头
                    if (index <= 0) {
                        btnPrev.addClass(prevDisabled)
                        first = true
                    } else {
                        btnPrev.removeClass(prevDisabled)
                        first = false
                    }
                } else {
                    if (len - index * step <= visible) {
                        last = true
                    } else {
                        last = false
                    }

                    if (index <= 0) {
                        first = true
                    } else {
                        first = false
                    }
                }

                // 显示导航数字
                if (nav || status) {
                    setCurrent(index)
                }

                // 每次可视区li的总集合
                var allLi = lis.slice(index * step, index * step + visible)
                // 每次滚动到可视区li的集合
                var viewLi = lis.slice(index * step + visible - step, index * step + visible)
                // 每次滚动后回调参数
                if (typeof callback == 'function') {
                    /**
                     * index 当前滚动到第几页
                     * total 一共有多少页
                     * 可视区域内的滚动li jQuery对象集合
                     */
                    callback.apply(that, [index, total, allLi, viewLi])
                }
            }

            // 是否动画滚动
            if( !!settings.speed) {
                ul.animate(nextFrame, settings.speed, onEnd);
            } else {
                ul.css(nextFrame);
                onEnd();
            }
        }

        /**
         * 显示数字分页1,2,3,4,5,6...
         * nav 数字导航外层div的class
         * 数字导航当前页高亮class
         */
        function showNavItem(nav, actived) {
            var navPage = navHasWrap ? $('.' + nav).eq(0) : $('<div class="' + nav + '"></div>');
            for(var i = 0; i < total; i++) {
                navPage.append('<em ' + (i === 0 ? ' class=' + actived : '') + ' title="' + (i + 1) + '">' + (i + 1) + '</em>');
            }
            if(!navHasWrap) {
                that.after(navPage);
            }
        }

        /**
         * 显示数字导航 (1/10)
         */
        function showStatus() {
            var statusPage = hasStatusWrap ? $(statusWrap).eq(0) : $('<div class="' + statusWrap.replace('.', '') + '"></div>');
            statusPage.html('<b>1</b>/' + total);
            if (!hasStatusWrap) {
                that.after(statusPage);
            }
        }

        // 设置当前状态的数字导航与分页
        function setCurrent(ind) {
            if (nav) {
                $('.' + navWrap).find('em').removeClass(navClass).eq(ind).addClass(navClass);
            }
            if (status) {
                $(statusWrap).html('<b>' + (ind + 1) + '</b>/' + total);
            }
        }

        var intervalTimer = null
        function play() {
            intervalTimer = setInterval(function() {
                switchTo(current, false)
            }, settings.autoPlayTime)
        }

        function stop() {
            clearInterval(intervalTimer)
        }

        function bindEvent() {
            btnPrev.unbind(evt).bind(evt, function() {
                switchTo(current, true);
            })
            btnNext.unbind(evt).bind(evt, function() {
                switchTo(current, false);
            })
            if (settings.autoPlay) {
                btnPrev.mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                });
                btnNext.mouseover(function() {
                    stop() 
                }).mouseout(function() {
                    play()
                });
                ul.find('li').mouseover(function() {
                    stop()
                }).mouseout(function() {
                    play()
                });               
                play();
            }
            
        }

        // 自定义数据模板
        if (settings.data.length > 0) {
            if (!settings.width || !settings.height) {
                return false;
            }
            renderHTML(settings.data);
        }

        // 初始化滚动
        if (len > visible && visible >= step) {
            // 可以滚动
            resetStyles(dir);
            bindEvent();
            if (nav) {
                showNavItem(navWrap, navClass);
            }
            if (status) {
                showStatus(statusWrap);
            }
        } else {
            // 无法滚动
            if (settings.showControl) {
                btnNext.add(btnPrev).show();
            } else {
                btnNext.add(btnPrev).hide();
            }
            btnPrev.addClass(prevDisabled);
            btnNext.addClass(nextDisabled);
        }

    });
};

/* Date: 2014-08-08 10:26:07 */
~function($) { 
$.jph = {}
var template = { 
	alert: '<div>{0}</div>',
	checkFail2: '<div class="jbox jbox5"><div class="jbox-left"></div><div class="jbox-content"><p>您已连续答错3次，签到失败！明天再来试试吧~</p><p class="font12">您有<span class="boxdate">{0}</span>京豆。</p></div></div>',
	checkin: '<div class="jbox jbox7"><div class="jbox-left"></div><div class="jbox-content"><p>还差一步，就可成功签到并获得<span class="boxdate">{0}</span>京豆啦~</p><p class="goods"></p><p class="gray-text zhao-ans">亲，可以在<a href="http://tuan.jd.com" target="_blank" class="jbox-href">京品惠首页</a>找找答案～</p><p class="gray-text text-bold">请输入图片中商品价格</p><p class="field"><input type="text"><span class="wenzi">元</span></p><p class="alert-text">输入不正确哦，今天还有0次机会</p><p class="gray-text text-bold">请输入验证码</p><p class="scode"><input type="text"></p><p class="alert-text codeMsg"></p><p><a class="jbox-btn mt3" href="javascript:void 0">签到</a></p></div></div>',
	checkinFail: '<div class="jbox jbox5"><div class="jbox-left"></div><div class="jbox-content"><p class="mt20">您已连续答错3次，签到失败！明天再来试试吧~</p><br><br><p class="font12">您有<span class="boxdate">{0}京豆</span>，<a target="_blank" class="jbox-href" href="http://tuan.jd.com/integral/index.html">去看看能兑换哪些礼品&gt;&gt;</a></p></div></div>',
	checkinSucc: '<div class="jbox jbox4"><div class="jbox-left"></div><div class="jbox-content" style="padding-left:5px;"><p>回答正确，签到成功！您将获得<span class="boxdate">{0}</span>京豆~</p><p class="gray-text">20分钟后发放到您的京豆账户中，请耐心等待！可在我的京品惠-京豆记录中查看</p><br><p class="font12">您有<span class="boxdate">{3}</span>京豆，<a class="jbox-href" target="_blank" href="http://tuan.jd.com/integral/index.html">去看看能换哪些礼品>></a></p></div></div>',
	confirm: '<div class="jbox5 jbox16"><div class="content"><div class="jbox-left"></div><div class="jbox-gongn">{0}</div></div><div style="clear:both;"></div><div class="orderbtn-box"><a class="orderbtn" data-act="yes" href="javascript:void 0">确定</a><a class="orderbtn" data-act="no" href="javascript:void 0">关闭</a></div></div>',
	copper: '<div class="jbox jbox18 jbox5"><div class="jbox-left"></div><div class="jbox-content"><p>啊哦～您不是铜牌及以上用户，暂无法签到</p><a class="jbox-href" href="http://tuan.jd.com">马上购物提高会员级别</a><a class="jbox-href" href="http://help.jd.com/help/question-57.html">查看会员级别介绍</a></div></div>',
	mailCheck: '为了保障您的账户及资金安全，请先进行&nbsp;<a target="_blank" href="http://safe.jd.com/user/paymentpassword/safetyCenter.action" class="jbox-href">手机和邮箱验证</a>',
	shopRemind: '<div class="jbox jbox8"><p>根据您的设置，在开团前通过手机短信通知您本次团购消息。<br>（每天最多定制5条，今日您还可以定制<span class="count">0</span>条短信）</p><form><div class="jbox-form"><label>发送手机号：</label><input class="mobile"><p class="alert-text mobile">手机号码格式不正确，请重新输入</p></div><div class="jbox-form input-short mt3"><label>验证码：</label><input class="code"><img class="code" src=""><p class="alert-text code">请输入验证码</p></div><p class="btn-wrap"><a class="jbox-btn" href="javascript://;">定制</a></p></form></div>',
	smsQuan: '<div class="jbox jbox8"><p class="jbox12-p">更改接收手机号会给绑定电话发送提示短信</p><div class="jbox-form"><label>手机号：</label><input class="def"><p class="alert-text"></p></div><div class="jbox-form mt3"><label>确认：</label><input class="conf"><p class="alert-text"></p></div><p class="btn-wrap"><a class="jbox-btn" href="javascript:void 0">发送</a></p></div>',
	success: '<div class="jbox jbox3">{0}</div>',
	warn: '<div class="jbox jbox2">{0}</div>'
}
$.jph.template = template 
}(jQuery)
/*!
 * Validation.js v0.1.0
 * http://snandy.github.io/validation
 * Original idea: www.livevalidation.com (Copyright 2007-2010 Alec Hill)
 * @snandy 2013-06-26 23:26:27
 *
 */
~function(win, doc, undefined) {

var toString = Object.prototype.toString
var Util = {}

// Iterator
var forEach = Util.forEach = function(obj, iterator, context) {
    if ( obj.length === +obj.length ) {
        for (var i=0; i<obj.length; i++) {
            if (iterator.call(context, obj[i], i, obj) === true) return
        }
    } else {
        for (var k in obj) {
            if (iterator.call(context, obj[k], k, obj) === true) return
        }
    }
}

// IO.isArray, IO.isBoolean, ...
forEach(['Array', 'Boolean', 'Function', 'Object', 'String', 'Number'], function(name) {
    Util['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

// field type
var TYPE = {
    textarea: 1,
    text: 2,
    password: 3,
    checkbox: 4,
    select: 5,
    file: 6 
}

// empty function
function noop() {}

// If the jQuery exists, use it
function $(selector) {
    return win.jQuery ? win.jQuery(selector) : query(selector)
}
function single(selector) {
    return $(selector)[0]
}
Util.$ = $

// Error class
function ZVError(errorMsg) {
    this.message = errorMsg
    this.name = 'ValidationError'
}
/**
 *  Validate 单例， 核心验证函数库， 可脱离Validation单独使用
 *   
 */
var Validate = {
    /**
     * 验证是否存在 ，必填项
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示语
     */
    presence: function(val, option) {
        var option = option || {}
        var msg = option.failureMsg || '不能为空!'
        if (val === '' || val === null || val === undefined) {
            Validate.fail(msg)
        }
        return true
    },
    /**
     * 数字验证
     * @param {Object} val
     * @param {Object} option
     *      is  {Number}             特定数
     *      min {Number}             指定最小约束数
     *      max {Number}             指定最大约束数
     *      onlyInteger {Bool}       是否仅为整数
     *      notANumberMsg {String}   非数字提示语
     *      notAnIntegerMsg {String} 非整数提示语
     *      wrongNumberMsg {String}  非特定数提示语
     *      tooLowMsg {String}       太小提示语
     *      tooHighMsg {String}      太大提示语
     */
    numericality: function(val, option) {
        var suppliedVal = val
        var val = Number(val)
        var option = option || {}
        var min = ((option.min) || (option.min === 0)) ? option.min : null
        var max = ((option.max) || (option.max === 0)) ? option.max : null
        var is  = ((option.is)  || (option.is === 0))  ? option.is  : null
        var notANumberMsg   = option.notANumberMsg   || '必须是数字!'
        var notAnIntegerMsg = option.notAnIntegerMsg || '必须为整数!'
        var wrongNumberMsg  = option.wrongNumberMsg  || '必须为' + is + '!'
        var tooLowMsg       = option.tooLowMsg       || '不能小于' + min + '!'
        var tooHighMsg      = option.tooHighMsg      || '不能大于' + max + '!'
        
        if ( !isFinite(val) ) Validate.fail(notANumberMsg)
        
        if ( option.onlyInteger && (/\.0+$|\.$/.test(String(suppliedVal)) || val != parseInt(val)) ) {
            Validate.fail(notAnIntegerMsg)
        }
        
        switch (true) {
            case (is !== null):
                if (val != Number(is)) Validate.fail(wrongNumberMsg)
                break
            case (min !== null && max !== null):
                Validate.numericality(val, {tooLowMsg: tooLowMsg, min: min})
                Validate.numericality(val, {tooHighMsg: tooHighMsg, max: max})
                break
            case (min !== null):
                if (val < Number(min)) Validate.fail(tooLowMsg)
                break
            case (max !== null):
                if (val > Number(max)) Validate.fail(tooHighMsg)
                break
        }
        return true
    },
    /**
     * 格式化验证
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示语
     *      pattern {RegExp} 正则
     *      negate {Bool} 
     */
    format: function(val, option) {
        var val = String(val)
        var option = option || {}
        var message = option.failureMsg || '格式不对!'
        var pattern = option.pattern || /./
        var negate = option.negate || false
        if (!negate && !pattern.test(val)) Validate.fail(message) // normal
        if (negate && pattern.test(val)) Validate.fail(message)   // negated
        return true
    },
    /**
     * email验证
     * @param {Object} val
     * @param {Object} option
     *      faliureMsg {Stirng} 错误提示
     *      pattern {RegExp} 
     */
    email: function(val, option) {
        var option = option || {}
        var reg = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
        var message = option.failureMsg || '必须为一个有效的电子邮箱地址!'
        Validate.format(val, {failureMsg: message, pattern: reg})
        return true
    },
    /**
     * 长度验证
     * @param {Object} val
     * @param {Object} option
     *      is {Number}  指定长度
     *      min {Number} 低限
     *      max {Number} 高限
     *      wrongSizeMsg {String} 指定长度错误提示
     *      tooShortMsg {String} 低限错误提示
     *      tooLongMsg {String} 高限错误提示
     */
    size: function(val, option) {
        var val = String(val)
        var option = option || {}
        var min = ((option.min) || (option.min == 0)) ? option.min : null
        var max = ((option.max) || (option.max == 0)) ? option.max : null
        var is  = ((option.is)  || (option.is == 0))  ? option.is  : null
        var wrongSizeMsg = option.wrongSizeMsg || '必须是' + is + '个字符长度!'
        var tooShortMsg    = option.tooShortMsg || '不能小于' + min + '个字符长度!'
        var tooLongMsg     = option.tooLongMsg || '不能大于' + max + '个字符长度!'
        switch (true) {
            case (is !== null):
                if ( val.length != Number(is) ) Validate.fail(wrongSizeMsg)
                break
            case (min !== null && max !== null):
                Validate.size(val, {tooShortMsg: tooShortMsg, min: min})
                Validate.size(val, {tooLongMsg: tooLongMsg, max: max})
                break
            case (min !== null):
                if ( val.length < Number(min) ) Validate.fail(tooShortMsg)
                break
            case (max !== null):
                if ( val.length > Number(max) ) Validate.fail(tooLongMsg)
                break
            default:
                throw new Error('Validate::size - size(s) to validate against must be provided!')
        }
        return true
    },
    /**
     * 包含校验
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示
     */
    inclusion: function(val, option) {
        var option = option || {}
        var message = option.failureMsg || '必须是列表中指定的元素!'
        var caseSensitive = (option.caseSensitive === false) ? false : true
        if (option.allowNull && val == null) {
            return true
        }
        if (!option.allowNull && val == null) {
            Validate.fail(message)
        }
        var within = option.within || []
        //if case insensitive, make all strings in the array lowercase, and the val too
        if (!caseSensitive) { 
            var lowerWithin = []
            for (var j = 0, length = within.length; j < length; ++j) {
                var item = within[j]
                if ( Util.isString(item) ) {
                    item = item.toLowerCase()
                }
                lowerWithin.push(item)
            }
            within = lowerWithin;
            if ( Util.isString(val) ) {
                val = val.toLowerCase()
            }
        }
        var found = false
        forEach(within, function(it) {
            if (it === val) found = true
            if (option.partialMatch && val.indexOf(it) !== -1) found = true
        })
        if ( (!option.negate && !found) || (option.negate && found) ) {
            Validate.fail(message)
        }
        return true
    },
    /**
     * 排除校验
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示
     */
    exclusion: function(val, option) {
        var option = option || {}
        option.failureMsg = option.failureMsg || '不能输入列表中的元素!'
        option.negate = true
        Validate.inclusion(val, option)
        return true
    },
    /**
     * 中文校验
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示
     */
    chinese: function(val, option) {
        var option = option || {}
        var msg = option.failureMsg || '请输入中文!'
        var reg = /^[\u4E00-\u9FA5]+$/
        if (!reg.test(val)) {
            Validate.fail(msg)
        }
        return true
    },
    /**
     * 手机号校验
     * @param {Object} val
     * @param {Object} option
     *      failureMsg {String} 错误提示
     */    
    mobile: function(val, option) {
        var option = option || {}
        var msg = option.failureMsg || '请输入正确的手机号!'

        // 必须为11位
        var leng = val.length === 11

        // 验证正则
        var reg = /^1(?:[38]\d|4[57]|5[012356789])\d{8}$/
        if (!reg.test(val)) {
            Validate.fail(msg)
        }
        return true
    },    
    confirmation: function(val, option) {
        if (!option.match) {
            throw new Error('Error validating confirmation: Id of element to match must be provided')
        }
        var option = option || {}
        var message = option.failureMsg || '两次输入不一致!'
        var match = option.match.nodeName ? option.match : single(option.match)
        if (!match) {
            throw new Error('There is no reference with name of, or element with id of ' + option.match)
        }
        if (val != match.value) Validate.fail(message)
        
        return true
    },
    acceptance: function(val, option) {
        var option = option || {}
        var message = option.failureMsg || '必须同意!'
        if (!val) {
            Validate.fail(message)
        }
        return true
    },
    /**
     * 自定义验证规则
     * @param {Object} val
     * @param {Object} option
     */
    custom: function(val, option) {
        var option = option || {}
        var against = option.against || function(){ return true }
        var args = option.args || {}
        var message = option.failureMsg || 'Not valid!'
        if (!against(val, args)) {
            Validate.fail(message)
        }
        return true
    },
    fail: function(errorMsg) {
        throw new ZVError(errorMsg)
    }
};
/**
 *  Validation Class 公开类
 * 
 * @param {Object} elem [id or css selector(jQuery support)]
 * @param {Object} option
 * 
 *     option properties: 
 *      validMsg {String}             正确的提示消息 ,如果没传，将从输入域的data-validate-succ取  (默认 "填写正确")
 *      insertAfterWhatNode {Element} 提示信息插入的位置，如果该元素存在在插入它后面 (默认插在输入域的后面)
 *      onlyBlur {Bool}               是否仅在光标离验证 (默认false)
 *      onlyOnSubmit {Bool}           是否仅在Form提交时验证
 *      wait {int}                    延迟验证的时间 (默认0)
 *      
 *      beforeValidate {Function}     验证前的回调函数 (默认 noop)
 *      beforeValid {Function}        验证正确时执行，在onValid前 
 *      onValid {Function}            验证正确函数，此函数将覆盖默认处理函数，你必须实现将正确提示消息展现到UI
 *      afterValid {Function}         验证正确时执行，在onValid后
 * 
 *      beforeInvalid {Function}      验证失败时执行，在onInvalid前
 *      onInvalid {Function}          验证失败函数，此函数将覆盖默认处理函数，你必须实现将失败提示消息展现到UI
 *      afterInvalid {Function}       验证失败时执行，在onValid后
 *      afterValidate {Function}      验证前的回调函数 (默认 noop)
 * 
 */
function Validation(elem, option) {
    if (!elem) return
    this.element = elem.nodeName ? elem : single(elem)
    if (!this.element) throw new Error('element is not exits')
    this.initialize(option)
}
/**
 * convenience method to add validation 
 * @param {Object} elem
 * @param {Object} validate
 * @param {Object} instanceOption
 * @param {Object} validateOption
 */
Validation.add = function(elem, validate, instanceOption, validateOption) {
    var vObj = new Validation(elem, instanceOption)
    vObj.add(validate, validateOption)
    return vObj
}
/**
 * 根据输入域的data-validate进行初始化，只需添加data-validate属性就自动完成验证，无需写一行JS代码
 * @param {DOM Element} container
 */
Validation.init = function(container) {
    var elems = $('[data-validate]', container)
    Util.forEach(elems, function(elem) {
        var vali = new Validation(elem)
        vali.add(elem.getAttribute('data-validate'))
    })
}

Validation.prototype = {
    validClass: 'ZV_valid',
    invalidClass: 'ZV_invalid',
    messageClass: 'ZV_validation_msg',
    validFieldClass: 'ZV_valid_field',
    invalidFieldClass: 'ZV_invalid_field',
    initialize: function(option) {
        var element = this.element
        this.validations = []
        this.elemType = this.getType()
        this.form = element.form

        // options
        var option = option || {}
        this.validMsg = option.validMsg || 
                element.getAttribute('data-validate-succ') || '填写正确'
        var node = option.insertAfterWhatNode || element
        this.insertAfterWhatNode = node.nodeType ? node : single(node)
        this.onlyOnBlur = option.onlyOnBlur || false
        this.wait = option.wait || 0
        this.onlyOnSubmit = option.onlyOnSubmit || false
        
        // events
        this.beforeValidate = option.beforeValidate || noop
        this.beforeValid    = option.beforeValid || noop
        this.onValid = option.onValid || function() {
            this.insertMessage(this.createMessage())
            this.addFieldClass()
        }
        this.afterValid    = option.afterValid || noop
        this.beforeInvalid = option.beforeInvalid || noop
        this.onInvalid = option.onInvalid || function() {
            this.insertMessage(this.createMessage())
            this.addFieldClass()
        }
        this.afterInvalid  = option.afterInvalid || noop
        this.afterValidate = option.afterValidate || noop
        
        // add to form if it has been provided
        if (this.form) {
            this.formObj = ValidationForm.getInstance(this.form)
            this.formObj.addField(this)
        }

        // collect old events
        this.oldOnFocus  = element.onfocus  || noop
        this.oldOnBlur   = element.onblur   || noop
        this.oldOnClick  = element.onclick  || noop
        this.oldOnChange = element.onchange || noop
        this.oldOnKeyup  = element.onkeyup  || noop
        
        var self = this
        element.onfocus = function(e) {
            self.doOnFocus(e)
            return self.oldOnFocus.call(this, e)
        }
        
        if (this.onlyOnSubmit) return
        
        switch (this.elemType) {
            case TYPE.checkbox:
                element.onclick = function(e) {
                    self.validate()
                    return self.oldOnClick.call(this, e)
                }
            case TYPE.select:
            case TYPE.file:
                element.onchange = function(e) {
                    self.validate()
                    return self.oldOnChange.call(this, e)
                }
                break;
            default:
                if (!this.onlyOnBlur) {
                    element.onkeyup = function(e) {
                        self.deferValidation()
                        return self.oldOnKeyup.call(this, e)
                    }
                }
                element.onblur = function(e) {
                    self.doOnBlur(e)
                    return self.oldOnBlur.call(this, e)
                }
        }
    },
    add: function(op, option) {
        var self = this
        option = option || {}
        if (!option.failureMsg) {
            option.failureMsg = self.element.getAttribute('data-validate-err')
        }
        if ( Util.isString(op) ) {
            forEach(op.split(' '), function(n, i) {
                self.validations.push({
                    validateFunc: Validate[n],
                    params: option
                })
            })
        }
    },
    remove: function(func, option) {
        var validations = this.validations
        var victimless = []
        forEach(validations, function(obj) {
            if (obj.type != func && obj.params != option) {
                victimless.push(obj)
            }
        })
        this.validations = victimless
    },
    deferValidation: function(e) {
        var self = this
        if (this.wait >= 300) this.removeMessageAndFieldClass()
        if (this.timeout) clearTimeout(self.timeout)
        this.timeout = setTimeout(function(){ self.validate()}, self.wait)
    },
    doOnBlur: function(e) {
        this.focused = false
        this.validate(e)
    },
    doOnFocus: function(e) {
        this.focused = true
        this.removeMessageAndFieldClass()
    },
    getType: function() {
        var element = this.element
        var ntype = element.type.toUpperCase()
        var nname = element.nodeName.toUpperCase()
        switch (true) {
            case (nname == 'TEXTAREA'):
                return TYPE.textarea
            case (nname == 'INPUT' && ntype == 'TEXT'):
                return TYPE.text
            case (nname == 'INPUT' && ntype == 'PASSWORD'):
                return TYPE.password
            case (nname == 'INPUT' && ntype == 'CHECKBOX'):
                return TYPE.checkbox
            case (nname == 'INPUT' && ntype == 'FILE'):
                return TYPE.file
            case (nname == 'SELECT'):
                return TYPE.select
            case (nname == 'INPUT'):
                throw new Error('Cannot use Validation on an ' + ntype.toLowerCase() + ' input')
            default:
                throw new Error('Element must be an input/select/textarea - ' + nname.toLowerCase() + ' was given')
        }
    },
    doValidations: function() {
        var validations = this.validations
        var length = validations.length
        this.validateFailed = false
        for (var i = 0; i < length; ++i) {
            var vs = validations[i]
            this.validateFailed = !this.perform(vs.validateFunc, vs.params)
            if (this.validateFailed) {
                return false
            } 
        }
        this.message = this.validMsg
        return true
    },
    perform: function(func, option) {
        // check whether we should display the message when empty
        switch (func) {
            case Validate.presence:
            case Validate.confirmation:
            case Validate.acceptance:
                this.showMessageWhenEmpty = true
                break;
            case Validate.custom:
                if (option.showMessageWhenEmpty) {
                    this.showMessageWhenEmpty = true
                }
                break;
        }
        // select and checkbox elements values are handled differently
        var element = this.element
        var elType  = this.elemType 
        var val = (elType === TYPE.select) ? element.options[element.selectedIndex].value : element.value
        if (func == Validate.acceptance) {
            if (elType != TYPE.checkbox) {
                throw new Error('Element to validate acceptance must be a checkbox')
            }
            val = element.checked
        }
        // now validate
        var isValid = true
        try {
            func(val, option)
        } catch(error) {
            if (error instanceof ZVError) {
                if (val !== '' || (val === '' && this.showMessageWhenEmpty)) {
                    this.validateFailed = true
                    // Opera 10 adds stacktrace after newline
                    this.message = error.message.split('\n')[0]
                    isValid = false
                }
            } else {
                throw error
            }
        } finally {
            return isValid
        }
    },
    validate: function(e) {
        if (this.element.disabled) return true
        this.beforeValidate()
        var isValid = this.doValidations()
        if (isValid) {
            this.beforeValid()
            this.onValid()
            this.afterValid()
            return true
        } else {
            this.beforeInvalid()
            this.onInvalid()
            this.afterInvalid()
            return false
        }
        this.afterValidate()
    },
    enable: function() {
        this.element.disabled = false
        return this
    },
    disable: function() {
        this.element.disabled = true
        this.removeMessageAndFieldClass()
        return this
    },
    createMessage: function() {
        var span = doc.createElement('span')
        var textNode = doc.createTextNode(this.message)
        span.appendChild(textNode)
        return span
    },
    insertMessage: function(elem) {
        this.removeMessage()
        // dont insert anything if vaalidMesssage has been set to false or empty string
        if (!this.validateFailed && !this.validMsg) {
            return
        }
        var val = this.element.value
        var whatNode = this.insertAfterWhatNode
        if ( (this.showMessageWhenEmpty && (this.elemType === TYPE.checkbox || val === '')) || val !== '' ) {
            var className = this.validateFailed ? this.invalidClass : this.validClass
            elem.className += ' ' + this.messageClass + ' ' + className;
            var parent = whatNode.parentNode
            if (whatNode.nextSibling) {
                parent.insertBefore(elem, whatNode.nextSibling)
            } else {
                parent.appendChild(elem)
            }
        }
    },
    addFieldClass: function() {
        var element = this.element
        var validCls = this.validFieldClass
        var invalidCls = this.invalidFieldClass
        
        this.removeFieldClass()
        if (!this.validateFailed) {
            if (this.showMessageWhenEmpty || element.value !== '') {
                if (element.className.indexOf(validCls) === -1) {
                    element.className += ' ' + validCls
                }
            }
        } else {
            if (element.className.indexOf(invalidCls) === -1) {
                element.className += ' ' + invalidCls
            }
        }
    },
    removeMessage: function() {
        var nextEl
        var el = this.insertAfterWhatNode
        while (el.nextSibling) {
            if (el.nextSibling.nodeType === 1) {
                nextEl = el.nextSibling
                break
            }
            el = el.nextSibling
        }
        if (nextEl && nextEl.className.indexOf(this.messageClass) != -1) {
            this.insertAfterWhatNode.parentNode.removeChild(nextEl)
        }
    },
    removeFieldClass: function() {
        var cls = this.element.className
        if (cls.indexOf(this.invalidFieldClass) !== -1) {
            this.element.className = cls.split(this.invalidFieldClass).join('')
        }
        if (cls.indexOf(this.validFieldClass) !== -1) {
            this.element.className = cls.split(this.validFieldClass).join(' ')
        }
    },
    removeMessageAndFieldClass: function() {
        this.removeMessage()
        this.removeFieldClass()
    }
};

// exports Util to Validation
Validation.Util = Util


// Universally Unique Identifie
var uuid = 1
// cache all instance
var formInstance = {}

/**
 * ValidationForm Class 私有类，仅供Validation内部使用 
 * @param {Object} elem
 */
function ValidationForm(elem) {
    this.initialize(elem)
}
ValidationForm.getInstance = function(elem) {
    if (!elem) return
    var el = elem.nodeName ? elem : single(elem)
    if (!el.id) {
        el.id = 'formId_' + uuid++
    }
    if (!formInstance[el.id]) {
        formInstance[el.id] = new ValidationForm(el)
    }
    return formInstance[el.id]
}
ValidationForm.prototype = {
    beforeValidate: noop,
    onValid:        noop,
    onInvalid:      noop,
    afterValidate:  noop,
    initialize: function(elem) {
        this.name = elem.id
        this.element = elem
        this.fields = []
        // preserve the old onsubmit event
        this.oldOnSubmit = this.element.onsubmit || noop
        var self = this
        this.element.onsubmit = function(e) {
            var ret = false
            self.beforeValidate()
            self.valid = self.execValidate(self.fields)
            self.valid ? self.onValid() : self.onInvalid()
            self.afterValidate()
            if (self.valid) {
                ret = self.oldOnSubmit.call(this, e || win.event) !== false
            }
            if (!ret) return ret
        }
    },
    addField: function(field) {
        this.fields.push(field)
    },
    removeField: function(victim) {
        var victimless = []
        var fields = this.fields
        forEach(fields, function(field) {
            if (field !== victim) victimless.push(field)
        })
        this.fields = victimless
    },
    execValidate: function() {
        var returnValue = true
        forEach(this.fields, function(obj) {
            var valid = obj.validate()
            if (returnValue) returnValue = valid
        })
        return returnValue
    }
};
/*
 * 自执行验证，通过element上的Script的data-run="true"
 * 
 */
~function() {
    var oldOnload = win.onload
    win.onload = function() {
        var canRun = single('script[data-run=true]')
        if (!canRun) return
        var selector = canRun.getAttribute('data-container')
        var container = $(selector)
        Validation.init(container)
        if (oldOnload) oldOnload.call(win)
    }
}()


// Expose Validation to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Validation', [], function() { return Validation } )
} else {
    win.Validation = Validation
}

}(this, document);
~function($) {

// toolbar login & register
function login(url) {
    jdModelCallCenter.settings = {
        clstag1 : 'login|keycount|5|5',
        clstag2 : 'login|keycount|5|6',
        fn : function() {
            if (url == undefined) {
                url = location.href
            }
            jdModelCallCenter.autoLocation(url)
            var $loginbar = $('#loginbar')
            var $link = $loginbar.find('.link-logout')
            if ($link.length) {
                $link.attr('href', 'http://passport.jd.com/uc/login?ltype=logout&returnUrl=http://tuan.jd.com')
            }
        }
    };
    jdModelCallCenter.login()
}
function regist() {
    $.extend(jdModelCallCenter.settings, {
        clstag1: 'login|keycount|5|9',
        clstag2: 'login|keycount|5|10'
    })
    jdModelCallCenter.regist()
}
function isLogin(is, not) {
   $.getJSON('http://passport.jd.com/loginservice.aspx?method=Login&callback=?', function(r) {
        var isAuthenticated = r.Identity.IsAuthenticated
        if ( isAuthenticated ) { 
            is(r)
        } else {
            not(r)
        }
    })
}

// exports
this.login = login
this.regist = regist
this.isLogin = isLogin


var $win = $(this)
var $doc = $(document)
var jph  = $.jph
var template = jph.template


/**
 * browser.ie(6,7,8,9,10) / browser.firefox / browser.chrome ...
 */
jph.browser = function(ua) {
    var b = {
        sogou: /se/.test(ua),
        opera: /opera/.test(ua),
        chrome: /chrome/.test(ua),
        firefox: /firefox/.test(ua),
        maxthon: /maxthon/.test(ua),
        tt: /TencentTraveler/.test(ua),
        ie: /msie/.test(ua) && !/opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua)
    }
    var mark = ''
    for (var i in b) {
        if (b[i]) {
            mark = 'safari' == i ? 'version' : i
            break
        }
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    b.version = mark && reg.test(ua) ? RegExp.$1 : '0'

    var iv = parseInt(b.version, 10)
    for (var i = 6; i < 11; i++) {
        b['ie'+i] = iv === i
    }
    
    return b
}(navigator.userAgent.toLowerCase())

/**
 * 事件节流
 */
jph.debounce = function(func, wait, immediate) {
    var timeout
    return function() {
        var context = this, args = arguments
        later = function() {
            timeout = null
            if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

/**
 * 事件节流
 */
jph.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result
    var whenDone = jph.debounce(function() {
        more = throttling = false
    }, wait)
    return function() {
        context = this, args = arguments
        var later = function() {
            timeout = null
            if (more) func.apply(context, args)
            whenDone()
        }
        if (!timeout) timeout = setTimeout(later, wait)
        
        if (throttling) {
            more = true
        } else {
            result = func.apply(context, args)
        }
        whenDone()
        throttling = true
        return result
    }
}

/**
 * Ajax请求，返回JSON数据
 */
jph.postJSON = function(url, data, success) {
    $.post(url, data, function(obj) {
        if (typeof obj == 'string') {
            var obj = $.parseJSON(obj)
        }
        success(obj)
    })
}

var $searchform = $('#searchform')
var $keytuan = $('#key-tuan')
/**
 * Input placeholder
 * @param {HTMLInputElement} input
 * @param {String} txt 默认显示文字 
 */
function placeHolder(input, txt) {
    txt = txt || '请输入商品名称、分类、商圈...'

    var $input = $(input)
    $input.focus(function() {
        if ($input.val() === txt) {
            $input.val('')
        }
    }).blur(function() {
        if ($input.val() === '') {
            $input.val(txt)
        }
    })
}
jph.placeHolder = placeHolder
placeHolder($keytuan)

$searchform.submit(function() {
    return checkKeywords()
})
$keytuan.keydown(function() {
    if (checkKeywords()) {
        $searchform.submit()
    }
})

function checkKeywords() {   
    var keywords = $keytuan.val()
    var illegal_words = ['script','alert','confirm','prompt','select', 'from', 'where', 'update', 'delete', 'insert','drop','alter']
    keywords = keywords.toLowerCase()

    //如果空或等于title则禁止提交表单
    if (keywords === '' || keywords === '请输入商品名称、分类、商圈...') {
        return false
    } else {
        for (var i = 0; i < illegal_words.length; i++) {
            if (keywords.indexOf(illegal_words[i]) != -1) {
                return false
            }
        }
    }
}

/**
 * 获取城市数据
 */
function fetchCitys() {
    var $citys = $('#city8Div')

    // 先加这两个判断，待开发去掉appendCity.js后，此处判断亦可去掉
    if (!$citys.find('a').length && !window.appendCity) {
        jph.postJSON('/getHotCity8.action', {}, function(data) {
            var str = ''
            var cList = data.cityList
            for (var i = 0; i < cList.length; i++) {
                str += '<a href="/citychange.action?city='+cList[i].ename+'">'+cList[i].name+"</a>"
            }
            $citys.append(str)
        })    
    }
}
setTimeout(fetchCitys, 500)


/**
 * 城市选择弹层
 * @option {Object} 配置选择 预留
 */
$.fn.changeCity = function(option) {
    option = $.extend(option, {})
    var $city   = $('div.layer')
    var $elem   = $(this)
    var $parent = $elem.parent()
    var isShow  = false
    $elem.click(function(e) {
        e.stopPropagation()
        if (isShow) {
            $city.hide()
            isShow = false
        } else {
            var posi = $parent.position()
            $city.css({left:posi.left, top:posi.top+40}).show()
            isShow = true
        }
    })
    $city.delegate('.shut', 'click', function() {
        $city.hide()
        isShow = false
    })
    $doc.click(function(e) {
        var target = e.target
        // 点击到弹层内，弹层自身，“更换”元素 不隐藏
        if (!$.contains($city[0], target) && target!==$elem[0] && target !== $city[0]) {
            $city.hide()
            isShow = false
        }
    })
    return this
}
$('#guides a').changeCity()

/**
 * 签到有礼
 *
 */
~function() {
    var $checkin = $('#checkin')
    var $elChecked = $("#check-succ")
    var $tip = $checkin.find('.regist')

    var isTipHide = $.cookie('tipshow')
    if (isTipHide) {
        $tip.hide()
    }
    //关闭签到引导
    function closeGuide() {
        $.cookie('sign_guide_status', '1', {expires: 365, path: '/'})
        $tip.hide()
    }

    // 已签到
    function alreadySignIn() {
        $checkin.hide()
        $elChecked.show()
        removeIndexCheckIn()
    }

    // 签到失败三次置灰
    function disableSignIn() {
        $checkin.html('签到有礼')
        $checkin.css({
            color: '#ccc',
            cursor: 'default'
        })
        removeIndexCheckIn()
    }

    // 删除首页浮层里的 “签到有礼”
    function removeIndexCheckIn() {
        var $menuAdd = $('.menu-add')
        if ($menuAdd.length) {
            var last = $menuAdd.find('li').last()
            last.hide()
        }
    }

    // 铜牌以下用户提示
    function copperDialog() {
        $.jdThickBox({
            type: "text",
            title: "签到有礼",
            width: 520,
            height: 120,
            _box: '',
            source: template.copper
        })
    }

    //初始化签到引导
    function initGuide() {
        if ($.cookie('sign_guide_status') != "1") {
            $tip.show()
        }
        var url = 'http://tuan.jd.com/initSignStatus.action'
        var data = '_charset_=utf-8&time=' + Math.random()
        jph.postJSON(url, data, function(result) {
            var loginSta = result.loginSta
            var signInToday = result.signInToday
            var signFailed = result.signFailed
            if (loginSta && signInToday) {
                alreadySignIn()
            } else if (loginSta && signFailed) {
                disableSignIn()
            }
        })
    }
    setTimeout(initGuide, 200)

    // 记录点击次数，点击后待请求响应后才可以下次请求，避免重复点击
    var isClicked = true
    jph.checkIn = function() {
        isLogin(function() {
            if (isClicked) {
                openDialog()
            }
        }, function() {
            login(location.href)
        })        
    }
    $checkin.delegate('[data-act=close]', 'click', function() {
        closeGuide()
    }).delegate('[data-act=open]', 'click', function() {
        jph.checkIn()
    })

    var $elemDialog = null
    function request() {
        var singData = null
        var toSignUrl = 'http://tuan.jd.com/toSign.action'
        // var signTeamIds = getSignTeamIds()
        jph.postJSON(toSignUrl, {}, function(res) {
            isClicked = true
            switch (res.statusCode) {
                case 0: 
                    checkinDlg(res)
                    break;
                case 1: 
                    closeDialog()
                    jph.warn('签到有礼', '今日已签到')
                    break;
                case 2:
                    closeDialog()
                    disableSignIn()
                    if (res.moneyAmount == 0) {
                        $.jdThickBox({
                            type: "text",
                            title: '签到有礼',
                            width: 530,
                            height: 150,
                            source: format(template.checkinFail2, res.jindouAmount),
                            _autoReposi: true
                        })
                    } else {
                        fail(res)
                    }
                    break;
                case 4:
                    closeDialog()
                    jph.warn('签到有礼', '内部异常，稍后再试')
                    break;
                case 5:
                case 6:
                    closeDialog()
                    jph.warnMail('手机邮箱验证提示', template.mailCheck, 600)
                    break;
                case 10:
                    closeDialog()
                    copperDialog()
                    break;
                default:
                    checkinDlg(res)
            }
        })
    }

    function openDialog() {
        isClicked = false
        var loadingHTML = '<div class="jbox jbox7"><div class="loading">努力加载中......请稍候</div></div>'
        $.jdThickBox({
            type: "text",
            title: "签到有礼",
            width: 560,
            height: 430,
            _box: 'dialog_checkin',
            source: loadingHTML
        })
        $elemDialog = $('#dialog_checkin')
        // 加拖拽
        var dragdrop = new Dragdrop({
            target: $elemDialog[0],
            bridge: $elemDialog.find('.thicktitle')[0]
        })
        request()
    }

    // 关闭对话框
    function closeDialog() {
        $elemDialog.find('.thickclose').click()
    }

    function fail(res) {
        $.jdThickBox({
            type: "text",
            title: '签到有礼',
            width: 530,
            height: 150,
            source: format(template.checkinFail, res.jindouAmount, res.moneyAmount),
            _autoReposi: true
        })
    }
    
    function checkinDlg(res) {
        var signData = res

        // 渲染Dialog
        var dialogHTML = format(template.checkin, res.integralNumber)
        $elemDialog.find('.thickcon').html(dialogHTML)
        
        var $tips   = $elemDialog.find('.gray-text')
        var $field  = $elemDialog.find('.field')
        var $input1 = $field.find('input')
        var $scode  = $elemDialog.find('.scode')
        var $input2 = $scode.find('input')
        var $msg1   = $elemDialog.find('.alert-text').eq(0)
        var $msg2   = $elemDialog.find('.alert-text').eq(1)

        // 光标置入价格输入域
        $elemDialog.find('.goods').html('<img width="207" height="138" src="' + signData.imgUrl + '"/>')
        $input1[0].focus()

        // 初始化图片
        var codeSrc = 'http://tuan.jd.com/buildAuthCode.action?t='
        var enabledAuthCode = res.enabledAuthCode
        if (enabledAuthCode != 1) {
            $tips.eq(2).hide()
            $elemDialog.find('.scode').hide()
            $msg2.hide()
        } else {
            // 添加验证码图片
            var time = (new Date).getTime()
            $scode.append('&nbsp;<img width="80" height="28" src="' + codeSrc + time + '">')
        }

        // 输入域验证
        var pass1 = false
        var pass2 = false
        var priceError = function(msg) {
            $field.addClass('wrong-alert')
            $msg1.html(msg).css('visibility', 'visible')
        }
        var codeError = function(msg) {
            $scode.addClass('wrong-alert')
            $msg2.html(msg).css('visibility', 'visible')
        }
        
        var vobj1 = Validation.add($input1[0], 'presence numericality', {
            onValid: function() {
                pass1 = true
                $field.removeClass('wrong-alert')
                $msg1.css('visibility', 'hidden')
            },
            onInvalid: function() {
                var val = $input1.val()
                if (val === '') {
                    priceError('请输入商品价格')
                } else {
                    priceError('商品价格输入不正确')
                }
                pass1 = false
            },
            onlyOnBlur: true
        })
        var vobj2 = Validation.add($input2[0], 'presence', {
            onValid: function() {
                pass2 = true
                $scode.removeClass('wrong-alert')
                $msg2.css('visibility', 'hidden')
            },
            onInvalid: function() {
                var val = $input2.val()
                if (val === '') {
                    codeError('请输入验证码')
                } else {
                    codeError('验证码输入不正确')
                }
                pass2 = false
            },
            onlyOnBlur: true
        })

        // 回车
        $input2.keydown(function(e) {
            if (e.keyCode === 13) {
                setTimeout(function() {
                    $elemDialog.find('.mt3').click()
                }, 100)
            }
        })

        // 成功签到提示
        function succ(res) {
            // 用户连续签到天数
            var cycleDay = res.cycleDay
            // 签到成功后获得的京豆数
            var beanNumber = res.integralNumber
            // 用户目前拥有的京豆数
            var beanAmount = res.jindouAmount
            // 用户目前拥有的金钱数
            var beanMoney = res.moneyAmount

            // 规则：连续签到3后为300，少于3天为200，等于7时200
            var beans = res.nextExtraRewardintegral
            var nday = res.nextExtraRewardDay

            $.jdThickBox({
                type: "text",
                title: '签到有礼',
                width: 610,
                height: 180,
                _box: 'dialog_succ',
                source: format(template.checkinSucc, beanNumber, nday, beans, beanAmount, beanMoney),
                _autoReposi: true
            })

            var $dialog = $('#dialog_succ')
            if (nday == 0) {
                $dialog.find('.exa').remove()
            }

            // 重置签到状态
            $checkin.hide()
            $elChecked.show()
        }
        
        // events
        $elemDialog.delegate('.scode img', 'click', function() {
            var time = (new Date).getTime()
            $(this).attr('src', codeSrc+time)
        }).delegate('.mt3', 'click', function() {

            // 执行验证
            vobj1.validate()
            vobj2.validate()

            if (!pass1) {
                $input1[0].focus()
                return
            }
            if (enabledAuthCode == 1 && !pass2) {
                $input2[0].focus()
                return
            }
            var siginInUrl = 'http://tuan.jd.com/signIn.action'
            var data = {
                token: signData.token, 
                answer: $input1.val(),
                authCode: $input2.val()
            }
            jph.postJSON(siginInUrl, data, function(res) {
                if (res.result) {
                    switch (res.statusCode) {
                        case 0: 
                            closeDialog()
                            succ(res)
                            break;
                        case 1:
                            closeDialog()
                            jph.warn('签到有礼', '今日已经签到了')
                            break;
                        case 2:
                            closeDialog()
                            fail(res)
                            disableSignIn()
                            break;
                        case 3:
                            if (res.signCount == 0) {
                                closeDialog()
                                disableSignIn()
                                jph.warn('签到有礼', '您已连续答错3次，签到失败！明天再来试试吧~', 550)
                            } else {
                                priceError('输入不正确，您今天还有' + res.signCount + '次机会')
                            }
                            break;
                        case 4:
                            closeDialog()
                            jph.warn('签到有礼', '由于内部异常引起的签到失败')
                            break;
                        case 5:
                            closeDialog()
                            jph.warn('签到有礼', '邮箱未验证')
                            break;
                        case 6:
                            closeDialog()
                            jph.warnMail('签到有礼', template.mailCheck, 600)
                            break;
                        case 8:
                            if (res.signCount == 0) {
                                closeDialog()
                                disableSignIn()
                                jph.warn('签到有礼', '您已连续答错3次，签到失败！明天再来试试吧~', 550)
                            } else {
                                codeError('验证码不正确，您今天还有' + res.signCount + '次机会')
                            }
                            // 换一张验证码图片
                            $scode.find('img')[0].click()
                            break;
                        case 9:
                            codeError('验证码过期了，请重新输入')
                            // 换一张验证码图片
                            $scode.find('img')[0].click()
                            break;
                    }
                }
            })
        })
    }

}()


/**
 * 元素添加hover插件
 *
 */
$.fn.addHover = function(targetSelector, className) {
    className = className || 'curr'
    
    var $elem = $(this)
    $elem.delegate(targetSelector, 'mouseenter', function() {
        $(this).addClass(className)
    }).delegate(targetSelector, 'mouseleave', function() {
        $(this).removeClass(className)
    })
}

/**
 * 分类浮层
 *
 */
$.fn.floatCate = function(fixedFunc, resetFunc, cls) {
    var $self = $(this)
    var fixCls = cls || 'catefixed'
    if (!$self.length) return

    var fTop = $self.offset().top
    $win.scroll(function() {
        var dTop = $doc.scrollTop()
        if (fTop < dTop) {
            $self.addClass(fixCls)
            if (fixedFunc) {
                fixedFunc($self, fTop)
            }
        } else {
            $self.removeClass(fixCls)
            if (resetFunc) {
                resetFunc($self, fTop)
            }
        }
    })
}

/**
 * format( string, value1, value2 ) 
 * format('<p>{0}</p>', 'snandy') // <p>snandy</p>
 */
var format = function() {
    var regFormat = /\{(\d+)\}/g
    var temp = []
    return function(str) {
        var args = temp.slice.call(arguments, 1)
        return str.replace(regFormat, function(m, i) {
            return args[i]
        })       
    }
}()

/**
 * 开团提醒
 */
function remindDialog(teamId, pname) {
    isLogin(function() {
        querySms.call(null, teamId, pname)
    }, function() {
        login(location.href)
    })
}

/**
 * 查询可发送的的短信数量
 */
function querySms(teamId, pname) {
    var queryUrl = 'http://tuan.jd.com/team/sms.action'
    jph.postJSON(queryUrl, {teamId: teamId}, function(obj) {
        var content = obj.content
        var code = content.code
        if (code == 100) {
            remindLogined(teamId, content.time, pname)

        } else if (code == 104) {
            jph.warn('定制开团提醒短信', '啊哦！您今天定制的短信已达上限（5条）', 500)
        }
    })
}

/**
 * 短信提醒弹框
 */
function remindLogined(teamId, smsTimes, pname) {
    var teamId = teamId
    var codeUrl = 'http://tuan.jd.com/team/genCode.action?rd='
    var saveUrl = 'http://tuan.jd.com/team/saveSms.action'

    $.jdThickBox({
        type: "text",
        title: "定制开团提醒短信",
        width: 553,
        height: 240,
        _box: 'dialog_remind',
        source: template.shopRemind,    
        _autoReposi: true
    })

    var $dialog = $('#dialog_remind')
    $dialog.addClass('jph')
    $dialog.find('.count').html(smsTimes)

    var $mobile = $dialog.find('input.mobile')
    var $code   = $dialog.find('input.code')
    var $msg1   = $dialog.find('p.mobile')
    var $msg2   = $dialog.find('p.code')
    var $jbox = $dialog.find('.jbox-form')
    var $first  = $jbox.eq(0)
    var $second = $jbox.eq(1)
    var $imgcode = $dialog.find('img.code')

    // init
    changeCode()

    // check
    var pass1 = false
    var pass2 = false
    var vobj1 = Validation.add($mobile[0], 'presence mobile', {
        onValid: function() {
            mobileCorrect()
            pass1 = true      
        },
        onInvalid: function() {
            var val = $mobile.val()
            if (val === '') {
                mobileError('请输入手机号')
            } else {
                mobileError('手机号码格式不正确，请重新输入')
            }
            pass1 = false
        },
        onlyOnBlur: true
    })
    var vobj2 = Validation.add($code[0], 'presence size', {
        onValid: function() {
            codeCorrect()
            pass2 = true      
        },
        onInvalid: function() {
            var val = $code.val()
            if (val === '') {
                codeError('请输入验证码')
            } else {
                codeError('验证码不正确，请重新输入')
            }
            pass2 = false
        },
        onlyOnBlur: true
    }, {is: 4})

    initEvent()
    
    // events
    function initEvent() {
        // 防止点击太快
        var canClick = true
        $dialog.delegate('.jbox-btn', 'click', function() {
            if (!canClick) return
            canClick = false
            var data = {
                mobile: $mobile.val(),
                captcha: $code.val(),
                teamId: teamId
            }
            setTimeout(function() {
                canClick = true
            }, 1000)

            // 执行验证
            vobj1.validate()
            vobj2.validate()

            if (!pass1) {
                mobileError()
                return
            }
            if (!pass2) {
                codeError()
                return
            }
            jph.postJSON(saveUrl, data, function(obj) {             
                var content = obj.content
                var code = content.code
                if (code == 100) {
                    closeDialog()
                    var $succDlg = jph.succ('定制开团提醒短信', '<span title="' + pname + '">' + pname + '</span><br>短信定制成功~')
                    $succDlg.find('.jbox3').css({
                        width: '165px',
                        lineHeight: '22px',
                        backgroundPosition: '0 -35px'
                    })
                } else if (code == 102) {
                    codeError(content.message)
                    changeCode()
                } else if (content.code == 103) {
                    closeDialog()
                    jph.warn('定制开团提醒短信', '啊哦！此手机号已对该商品定制了开团提醒哦~', 550)
                } else {
                    closeDialog()
                    jph.warn('定制开团提醒短信', '啊哦！定制失败，请重试~')
                }
            })

        }).delegate('img.code', 'click', function() {
            changeCode()
        })

        $code.keyup(function(e) {
             if (e.keyCode === 13) {
                setTimeout(function() {
                    $dialog.find('.jbox-btn').click()
                }, 100)
            }
        })
    }

    // functions
    function closeDialog() {
        $dialog.find('.thickclose').click()
    }
    function changeCode() {
        $imgcode.attr('src', codeUrl + Math.random())
    }
    function mobileError(msg) {
        $msg1.css('visibility', 'visible')
        $first.addClass('wrong-alert')
        $first.find('p.mobile').html(msg)  
    }
    function mobileCorrect() {
        $msg1.css('visibility', 'hidden')
        $first.removeClass('wrong-alert')    
    }
    function codeError(msg) {
        $msg2.css('visibility', 'visible')
        $second.addClass('wrong-alert')
        $second.find('p.code').html(msg)
    }
    function codeCorrect() {
        $msg2.css('visibility', 'hidden')
        $second.removeClass('wrong-alert')
    }
}

// exports jph
jph.remindDialog = remindDialog;

jph.alert = function(title, txt, width, height) {
    $.jdThickBox({
        type: "text",
        title: title ||'信息',
        width: width || 400,
        height: height || 160,
        source: format(template.alert, txt),
        _autoReposi: true
    })
}

jph.confirm = function(option) {
    var title = option.title
    var txt   = option.txt
    var width = option.width
    var height = option.height
    var confirmFn = option.confirmFn
    $.jdThickBox({
        type: "text",
        title: title ||'',
        width: width || 400,
        height: height || 160,
        _box: 'confirm_dialog',
        source: format(template.confirm, txt),
        _autoReposi: true
    })

    var $confirm = $('#confirm_dialog')
    $confirm.delegate('[data-act=yes]', 'click', function() {
        if (confirmFn) {
            confirmFn($confirm)   
        }
        
    }).delegate('[data-act=no]', 'click', function() {
        $confirm.find('.thickclose').click()
    })
}

jph.warn = function(title, txt, width, height) {
    $.jdThickBox({
        type: "text",
        title: title||'信息',
        width: width || 400,
        height: height || 160,
        source: format(template.warn, txt),
        _autoReposi: true
    })
}

jph.warnMail = function(title, txt, width, height) {
    $.jdThickBox({
        type: "text",
        title: title||'信息',
        width: width || 400,
        height: height || 160,
        source: format('<div class="jbox jbox1">{0}</div>', txt),
        _autoReposi: true
    })
}

jph.succ = function(title, txt, width, height) {
    $.jdThickBox({
        type: "text",
        title: title||'信息',
        width: width || 400,
        height: height || 160,
        source: format(template.success, txt),
        _autoReposi: true,
        _box: 'succ_dialog'
    })

    return $('#succ_dialog')
}

/*
 * 短信提醒
 */
$.fn.shopingRemind = function() {
    var $self = $(this)
    var $mask = $('<div class="mask">')
    var canClick = true
    $self.delegate('.p-img', 'mouseenter', function() {
        var $product = $(this).parent()
        $product.find('.warm')[0].className = 'warm2'
        $mask.appendTo($(this))
    }).delegate('.p-img', 'mouseleave', function() {
        var $product = $(this).parent()
        $product.find('.warm2')[0].className = 'warm'
        $(this).find('.mask').remove()
    }).delegate('.p-img span', 'click', function() {
        if (canClick) {
            var $product = $(this).closest('.product')
            var teamId = $product.attr('data-teamid')
            var pname = $product.find('.p-name').attr('title')
            remindDialog(teamId, pname)
            canClick = false        
        }
        setTimeout(function() {
            canClick = true
        }, 1000)
    })
}

$.fn.seeHover = function() {
    var $self = $(this)
    var $mask = $('<div class="mask">')
    $self.delegate('.href-wrap', 'mouseenter', function() {
        var $pimg = $(this).next()
        $pimg.find('.warm')[0].className = 'warm2'
        $mask.appendTo($pimg)
    }).delegate('.href-wrap', 'mouseleave', function() {
        var $pimg = $(this).next()
        $pimg.find('.warm2')[0].className = 'warm'
        $pimg.find('.mask').remove()
    })    
}

/** 
 * 生成调查问卷、返回顶部链接
 */
jph.rdSideBar = function(right) {
    if (window.pageConfig && window.pageConfig.FN_InitSidebar) {
        var sidebar = new pageConfig.FN_InitSidebar()
        var researchLink = 'http://market.jd.com/jdvote/vote2.aspx?voteId=159'
        if (window.jphData && window.jphData.researchLink) {
            researchLink = window.jphData.researchLink
        }
        var width = pageConfig.compatible ? 1210 : 990
        var right = screen.width >= 1210 ? right : 26
        var $el = $('#sidepanel')
        $el.delegate('.shantuan-close', 'click', function() {
            $shantuan.hide()
            right = 26;
            $el.css('right', (document.documentElement.clientWidth-width)/2-right+'px')
        }).delegate('.erwei', 'click', function() {
            window.open("http://app.jd.com/android.html#2","_blank")
        })
        sidebar.initCss = function() {
            var css
            if (screen.width>=1210) {
                if ($.browser.msie && $.browser.version<=6) {
                    css = {right: -right + 'px'}
                } else {
                    css = {
                        right:(document.documentElement.clientWidth-width)/2-right+'px'
                    }
                }
                $el.css(css)
            }
        }
        sidebar.addItem('<div id="shantuan-cont"><div class="erwei"><div class="top-text">京东团购客户端</div><div class="bottom-text">点击或扫描下载</div></div><span class="shantuan-close"></span></div>')
        sidebar.addItem('<a class="research" target="_blank" href="' + researchLink + '"><b></b>意见反馈</a>')
        sidebar.setTop()
        sidebar.scroll()
        var $shantuan = $('#shantuan-cont')
        // 二维码先不上线，暂时隐藏下
        $shantuan.css('visibility', 'hidden')
        if (screen.width >= 1210) {
            $shantuan.show()
        } else {
            $shantuan.hide()
        }
    }
}
$(function() {
    jph.rdSideBar(150)    
})

/*
 * 底部发邮件
 */
$('input[xtip$="."]').focus(X.misc.inputclick)
$('input[xtip$="."]').blur(X.misc.inputblur)


}(jQuery)
