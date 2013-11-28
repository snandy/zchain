~function($) {

$.fn.uniClick = function(handler, time) {
    time = time || 1000
    this.each(function(i, el) {
        var canClick = true
        $(el).click(function() {
            if (canClick) {
                handler.apply(this, arguments)
                canClick = false    
            }
            setTimeout(function() {
                canClick = true
            }, time)
        })
    })
}

}(jQuery)