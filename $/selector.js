/**
 * JavaScript Selector
 * Copyright (c) 2010 snandy
 * Blog: http://snandy.cnglogs.com
 * QQ群: 34580561
 * 
 * $ 获取元素, 在DOM中使用频繁的，根据2/8原则只实现最常用的四种
 * 
 * @param {Object} selector
 * @param {Object} context
 * 
 * 1, 通过id获取,该元素是唯一的
 *    $('#id')
 * 
 * 2, 通过className获取
 *    $('.cls') 获取文档中所有className为cls的元素
 *    $('.cls', el)
 *    $('.cls', '#id')
 *    $('span.cls') 获取文档中所有className为cls的span元素
 *    $('span.cls', el) 获取指定元素中className为cls的元素, el为HTMLElement (不推荐)
 *    $('span.cls', '#id') 获取指定id的元素中className为cls的元素
 *    
 * 3, 通过tagName获取
 *    $('span') 获取文档中所有的span元素
 *    $('span', el) 获取指定元素中的span元素, el为HTMLElement (不推荐)
 *    $('span', '#id') 获取指定id的元素中的span元素
 * 
 * 4, 通过attribute获取
 *    $('[name]') 获取文档中具有属性name的元素
 *    $('[name]', el)
 *    $('[name]', '#id')
 *    $('[name=uname]') 获取文档中所有属性name=uname的元素
 *    $('[name=uname]', el)
 *    $('[name=uname]', '#id')
 *    $('input[name=uname]') 获取文档中所有属性name=uname的input元素
 *    $('input[name=uname]', el)
 *    $('input[name=uname]', '#id')
 */
~function(win, doc, undefined) {
    
// Save a reference to core methods
var slice = Array.prototype.slice

// selector regular expression
var rId = /^#[\w\-]+/
var rTag = /^([\w\*]+)$/
var rCls = /^([\w\-]+)?\.([\w\-]+)/
var rAttr = /^([\w]+)?\[([\w]+-?[\w]+?)(=(\w+))?\]/

// For IE9/Firefox/Safari/Chrome/Opera
var makeArray = function(obj) {
    return slice.call(obj, 0)
}
// For IE6/7/8
try{
    slice.call(doc.documentElement.childNodes, 0)[0].nodeType
} catch(e) {
    makeArray = function(obj) {
        var result = []
        for (var i = 0, len = obj.length; i < len; i++) {
            result[i] = obj[i]
        }
        return result
    }
}

function byId(id) {
    return doc.getElementById(id)
}
function check(attr, val, node) {
    var reg = RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)')
    var    attribute = attr === 'className' ? 
            node.className : node.getAttribute(attr)
    if (attribute) {
        if (val) {
            if (reg.test(attribute)) return true
        } else {
            return true
        }
    }
    return false
}    
function filter(all, attr, val) {
    var el, result = []
    var    i = 0, r = 0
    while ( (el = all[i++]) ) {
        if ( check(attr, val, el) ) {
            result[r++] = el
        }
    }
    return result
}
    
function query(selector, context) {
    var s = selector, arr = []
    var context = context === undefined ? doc : 
        typeof context === 'string' ? query(context)[0] : context
            
    if (!selector) return arr
    
    // id和tagName 直接使用 getElementById 和 getElementsByTagName

    // id 
    if ( rId.test(s) ) {
        arr[0] = byId( s.substr(1, s.length) )
        return arr
    }
    
    // Tag name
    if ( rTag.test(s) ) {
        return makeArray(context.getElementsByTagName(s))
    }

    // 优先使用querySelector，现代浏览器都实现它了
    if (context.querySelectorAll) {
        if (context.nodeType === 1) {
            var old = context.id, id = context.id = '__ZZ__'
            try {
                return context.querySelectorAll('#' + id + ' ' + s)
            } catch(e) {
                throw new Error('querySelectorAll: ' + e)
            } finally {
                old ? context.id = old : context.removeAttribute('id')
            }
        }
        return makeArray(context.querySelectorAll(s))
    }
    
    // ClassName
    if ( rCls.test(s) ) {
        var ary = s.split('.')
        var    tag = ary[0] 
        var    cls = ary[1]
        if (context.getElementsByClassName) {
            var elems = context.getElementsByClassName(cls)
            if (tag) {
                for (var i = 0, len = elems.length; i < len; i++) {
                    var el = elems[i]
                    el.tagName.toLowerCase() === tag && arr.push(el)
                }
                return arr
            } else {
                return makeArray(elems)
            }
        } else {
            var all = context.getElementsByTagName(tag || '*')
            return filter(all, 'className', cls)
        }
    }

    // Attribute
    if ( rAttr.test(s) ) {
        var result = rAttr.exec(s)
        var all = context.getElementsByTagName(result[1] || '*')
        return filter(all, result[2], result[4])
    }
}

win.query = win.$ = query
}(this, document);
