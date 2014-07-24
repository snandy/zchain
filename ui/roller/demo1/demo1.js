//页面初始化
$(function () {

//奖品名称
var prizeNames = {
    "1" : "索尼40寸平板电视",
    "2" : "100元手机话费充值定向京券",
    "3" : "50元手机话费充值定向京券",
    "4" : "2元手机话费充值定向京券",
    "5" : "再抽一次",
    "0" : "谢谢参与"
};
var lucky = new LuckyRoller({
    canvas: "#luckyRoller",
    width: 575,
    height: 573,
    plate: "skin/i/bg5.png",
    // arrow: {
    //     x: 205,
    //     y: 126,
    //     width: 30,
    //     height: 34,
    //     image: 'skin/i/bg6.png'
    // },
    button: {
        x: 195,
        y: 115,
        width: 177,
        height: 257,
        image: "skin/i/bg6.png",
        click: auto
    },
    initAngle: 0,
    prizes: [
        {id: "1", range: [330, 390]},
        {id: "2", range: [30, 90]},
        {id: "3", range: [90, 150]},
        {id: "4", range: [150, 210]},
        {id: "5", range: [210, 270]},
        {id: "0", range: [270, 330]}
    ],
    onStop: function (id) {
        isHaveChace(id);
    },
    onRolling: function () {
    }
});
$("#manual-1").click(function () {
    lucky.rolling();
});
$("#manual-3").click(function () {
    lucky.prize($("#manual-2").val());
});
$("#auto").click(auto);
function auto() {
    if (lucky.isRolling() == true){
        return false;
    }
    if($('#number').html()>0){
        lucky.rolling();
    }
    jQuery.ajax({
        url: "http://chongzhi.jd.com/json/area/jsonArea_searchLoginCookie.action",
        type: "POST",
        data: "",
        dataType: "json",
        cache: false,
        async: false,
        success: function(pin) {
            if (!pin || pin == "") {
                jdModelCallCenter.settings = {'clstag1':"login|keycount|5|5",'clstag2':"login|keycount|5|6",'fn':function() {
                    userInfo();
                }};
                jdModelCallCenter.login();
            }else{
                jQuery.getJSON("http://chongzhi.jd.com/json/msg/jsonMsg_play.action"
                    +"?t="+new Date(), 
                    function(playResultVo) {
                        if(playResultVo != null){
                            if(playResultVo.success==1){
                                lucky.prize(playResultVo.prizeLevel);
                            }else{
                                if (lucky.isRolling() == true){
                                    lucky.prize(0);
                                }else{
                                    showPlayMessage(playResultVo.type);
                                }
                            }
                        }
                    }
                );
            }
        }
    });
    //lucky.prize(Math.floor(Math.random() * (6 - 1 + 1) + 1));
}

function auto() {
    // if($('#number').html()>0){
        lucky.rolling();
    // }

    setTimeout(function() {
        lucky.prize(3)
    }, 1000)
    
}

function isHaveChace(price){
    //将剩余中奖数量重新
    showPlayMessage(price);
    if(price >=0  || price<=5){
        //抽奖后,奖级在1-5,更新页面数据
        userInfo();
    }
}
function userInfo(){
    jQuery.getJSON("http://chongzhi.jd.com/json/msg/jsonMsg_getChanceAndOwnPrizes.action"
                            +"?t="+new Date(), 
              function(userInfoVo) {
                    if(userInfoVo != null){
                        jQuery("#number").html(userInfoVo.chance);
                        for(var i=0;i<userInfoVo.ownPrizeses.length;i++){
                            jQuery("#pc"+userInfoVo.ownPrizeses[i].prizeLevel).html(userInfoVo.ownPrizeses[i].count);
                        }
                    }
              }
    );
}

$("#stop").click(function() {
    lucky.stop();
});

var options = [];
for(var key in prizeNames){
    options.push("<option value=\"",key,"\">",prizeNames[key],"</option>");
}
$("#manual-2").append(options.join(""));

});