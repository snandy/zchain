$.fn.tigerGame = function(option) {

    $self = $(this)
    var $ul = $self.find('.border ul')
    var $li = $ul.find('li')
    var oneHeight = $li.height()
    var animHeight = $ul.height() - oneHeight
    var stop = false

    /*
     * 开始抽奖
     */
    function begin() {
        if (stop) {
            return 
        }
        $ul.animate({
            marginTop: -animHeight
        }, {
            easing: 'linear',
            duration: 600,
            complete: function() {
                $ul.css({
                    marginTop: 0
                })
                begin()
            }
        })
    }

    /*
     * 中奖 ，一般以后台返回的数据为准
     */
    function winPrize(idx) {
        stop = true
        var i = 0
        $ul.stop(true).css({marginTop:0})

        $ul.eq(0).animate({
            marginTop: -idx * oneHeight
        }, {
//            easing: 'linear',
            duration: 500,
            complete: function() {
            }
        })


        $ul.eq(1).animate({
            marginTop: -idx * oneHeight
        }, {
//            easing: 'linear',
            duration: 1000,
            complete: function() {
            }
        })


        $ul.eq(2).animate({
            marginTop: -idx * oneHeight
        }, {
//            easing: 'linear',
            duration: 2000,
            complete: function() {
                alert('中奖了')
            }
        })
                        
    }

    // 开始摇奖
    $self.find('.yaojiang').click(function() {
        begin()
    })

    // 模拟中奖
    $self.find('.lingqu').click(function() {
        winPrize(3)
    })


}

$('.bandit').tigerGame()