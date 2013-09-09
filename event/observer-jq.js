~function($) {

var observer = function() {
    // 存放所有的事件
    var events = {}

    return {
        /**
         * 添加事件handler
         * @param {String} type 事件名称
         * @param {Function} handler 事件处理函数
         */
        on: function(type, handler) {
            if (typeof type !== 'string') {
                throw new Error('Event name must be a string type')
            }
            if (!events[type]) {
                events[type] = $.Callbacks()
            }
            events[type].add(handler)
        }, 

        /**
         * 移除事件handler
         * @param {String} type 事件名称
         * @param {Function} handler 事件处理函数
         */
        off: function(type, handler) {
            var callbacks = events[type]
            if (!callbacks) {
                throw new Error('This type of event does not exist')
            }
            callbacks.remove(handler)
        },

        /**
         * 派发事件
         *
         * fire(type, args)
         * @param {String} type 事件名称
         * @param {Object} args 传参数args给事件handler
         * 
         * fire(context, type, args)
         * @param {Object} context handler执行上下文
         * @param {String} type 事件名称
         * @parma {Object} args 传参数args给事件handler
         * 
         */
        fire: function(type, args) {
            var context 
            if (typeof type === 'object') {
                context = type
                type = args
                args = arguments[2]
            }
            var callbacks = events[type]
            if (!callbacks) {
                throw new Error('This type of event does not exist')
            }
            if (context) {
                callbacks.fireWith(context, type, args)
            } else {
                callbacks.fire(type, args)    
            }
        }
    }
}

$.observer = observer

}(jQuery)

function Person(name, age) {
    this.name = name
    this.age = age
}
Person.prototype = {
    setName: function(name) {
        this.name = name
        this.trigger('change:name', name)
    }
}

$.extend(Person.prototype, $.observer())

// Test
var p1 = new Person('John', 30)
function hander1() {
    console.log(arguments)
}
p1.on('change:name', hander1)