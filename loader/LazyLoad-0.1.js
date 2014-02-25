/**
 * JavaScript LazyLoad Library v0.1
 * Copyright (c) 2011 snandy
 * Blog: http://www.cnblogs.com/snandy
 * QQ群: 34580561
 * Date: 2011-04-26
 * 
 * 变量hash记录已经加载过的资源，避免重复加载
 * 
 * 加载多个js后才回调，缺陷是js文件不存在，那么也将触发回调
 * LazyLoad.js(['a.js','b.js','c.js'], {
 *      callback: function(){c()},
 *      charset: 'utf-8',
 *      scope: xx
 * });
 * 
 * 加载多个css后才回调，IE6/7/8/9和Opera中支持link的onreadystatechange事件。
 * Firefox/Safari/Chrome既不支持onreadystatechange，也不支持onload。使用setTimeout延迟加载。
 * LazyLoad.css(['a.css','b.css','c.css'], {
 *       callback: function(){},
 *    charset: 'gbk',
 *    scope: xx
 * });
 * 
 */

LazyLoad = function(global) {
    
var isIE = /*@cc_on!@*/!1
var hash = {}
var doc  = global.document
var head = doc.head || doc.getElementsByTagName('head')[0]
var noop = function() {}

function createEl(type, attrs) {
    var el = doc.createElement(type), attr
    for (attr in attrs) {
        el.setAttribute(attr, attrs[attr])
    }
    return el
}
function done(list,obj) {
    hash[obj.url] = true
    list.shift()
    if (!list.length) {
        obj.callback.call(obj.scope)
    }
}
function load(type, urls, config) {
    var charset = config.charset
    var obj = {
        scope: config.scope || global,
        callback: config.callback || noop
    }
    var list = [].concat(urls)
    for (var i = 0, len = urls.length; i < len; i++) {
        var el, url = urls[i]
            
        // 已经加载的不再加载
        if (hash[url]) {
            throw new Error('warning: ' + url + ' has loaded!')
        }
        
        if (charset) {
            el.setAttribute('charset', charset)
        }

        if (type === 'js') {
            el = createEl('script', {
                src: url,
                async: 'async'
            })
            
        } else {
            el = createEl('link', {
                href: url,
                rel: 'stylesheet',
                type: 'text/css'
            })
        }

        (function(url) {
            if (isIE) {
                el.onreadystatechange = function() {
                    var readyState = this.readyState
                    if(readyState === 'loaded' || readyState === 'complete') {
                        obj.url = url
                        this.onreadystatechange = null
                        done(list, obj)
                    }
                }
                
            } else {
                if (type == 'js') {
                    el.onload = el.onerror = function() {
                        obj.url = url
                        done(list, obj)
                    }
                } else {
                    setTimeout(function() {
                        obj.url = url
                        done(list, obj)
                    }, 100)
                }
            }
        })(url);
        
        if (type === 'js') {
            head.insertBefore(el, head.firstChild)
        } else {
            head.appendChild(el)
        }
    }

}

return {
    js: function(urls, callback, scope) {
        load('js', urls, callback, scope)
    },
    css: function(urls, callback, scope) {
        load('css', urls, callback, scope)
    }
}
}(this);
