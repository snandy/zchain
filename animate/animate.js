animate = function(window) {

var slice   = [].slice
var top     = 'Top'
var right   = 'Right'
var bottom  = 'Bottom'
var left    = 'Left'
var reColor = /color/i
var reUnit  = /\d(\D+)$/
var reOpac  = /alpha\(opacity=(\d+)\b/i
var reRgba  = /#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/

var getSty = 
	window.getComputedStyle ? function(elem, name) {return getComputedStyle(elem, null)[name]} 
	: function(elem, name) {return elem.currentStyle[name]}

var RAF = function(win, str) {
    return win['webkitR' + str] || win['mozR' + str] || win['msR' + str] || win['oR' + str] || win['r' + str]
}(window, 'equestAnimationFrame')

var fx = {
	_: function(obj, el, from, to, name) {
		to = parseFloat(to) || 0
		from = parseFloat(from) || 0
        var num = 0
        if (obj.p >= 1) {
            num = to
        } else {
            num = obj.p * (to - from) + from
        }
		obj.sty[name] = num + obj.unit
	},
	width: function(obj, el, from, to, name) {
		from = parseFloat(from)
        if ( !isNaN(from) ) {
            from = from
        } else if ( name === 'width' ) {
            from = el.clientWidth
        } else if (name === 'height') {
            from = el.clientHeight
        }
		fx._(obj, el, from, to, name)
	},
	opacity: function(obj, el, from, to, name) {
		if (isNaN(from)) {
			from = el.style
			from.zoom = 1
			from = (reOpac.exec(from.filter) || {})[1] / 100 || 1
		}
		from *= 1
		to = obj.p * (to - from) + from

		var style = el.style
        if (name in el) {
            style[name] = to
        } else if (to >= 0) {
            style.filter = ''
        } else {
            style.filter = 'alpha(' + name + '=' + Math.round(100 * to) + ')'
        }
	},
	color: function(obj, el, from, to, name) {
		if (!obj.ok) {
            to = obj.to = toRGBA(to)
            from = obj.from = toRGBA(from)
            if (to[3] === 0) {
                to = [].concat(from)
                to[3] = 0
            }
            if (from[3] === 0) {
                from = [].concat(to)
                from[3] = 0
            }
            obj.ok = 1
        }

        var arr = [0, 0, 0, obj.p * (to[3] - from[3]) + 1 * from[3]]

		for (var i = 2; 0 <= i; i--) {
            arr[i] = Math.round(obj.p * (to[i] - from[i]) + 1 * from[i])
        }

        if (1 <= arr[3] || A.rgbaIE) {
            arr.pop()
        }
		try {
			obj.sty[name] = (3 < arr.length ? 'rgba(' : 'rgb(') + arr.join(',') + ')'
		} catch (k) {
			A.rgbaIE = 1
		}
	}
}
fx.height = fx.width

function expand(obj, dim, arr) {
    var name, i, it
    for (name in obj) {
        if (name in dim) {
            var ci = obj[name]
            for (i = 0; it = arr[i]; i++) {
                var str = name.replace(dim[name], '') + it + (dim[name] || '')
                obj[str] = {
                    to: 0 === ci.to ? ci.to : ci.to || ci,
                    from: ci.from,
                    e: ci.dim
                }
            }
            delete obj[name]
        }
    }
}

function toRGBA(str) {
    var arr = [0, 0, 0, 0]
    str.replace(/\s/g, '').replace(reRgba, function(str, b, g, d, c, z, k, l, m, n, p, q, r, s, t) {
        k = [b + b || c, g + g || z, d + d || k]
        b = [l, m, n]
        for (a = 0; 3 > a; a++) {
            k[a] = parseInt(k[a], 16)
            b[a] = Math.round(2.55 * b[a])
        }
        arr = [k[0] || b[0] || q || 0, k[1] || b[1] || r || 0, k[2] || b[2] || s || 0, p || t || 1]
    })
    return arr
}

/*
    {
 		width: {
 			name:
 			elem:
 			sty:
			from:
			to:
			ease:
			unit:
			fn:
 		}
    }
 */
function getConfig(prop, elem, ease) {
	var config = {}
	var sty = elem.style
	for (var key in prop) {
		var val = prop[key]
		var obj = {}
		if (!val.to) {
			obj = {to: val}
		}
		obj.name = key
		obj.elem = elem
		obj.sty = key in sty ? sty : elem
		obj.ease = obj.ease || ease
		if (!obj.from) {
			obj.from = obj.from === 0 ? 0 : elem[key] ? elem[key] : getSty(elem, key)
		}
		obj.unit = ( reUnit.exec(obj.to) || reUnit.exec(obj.from) || [0, 0] )[1]
		obj.fn = reColor.test(key) ? fx.color : fx[key] || fx._

		config[key] = obj
	}
	return config
}

function exec(prop, duration, callback) {
	var cTime, sTime
	var eTime = +new Date + duration
	var func = function(l) {
		var obj, key, ease
        // IE10+ l值总是负数
		// sTime = eTime - (l || (new Date).getTime())
        sTime = eTime - (new Date).getTime()
		if (50 > sTime) {
			for (key in prop) {
				obj = prop[key]
				obj.p = 1
				obj.fn(obj, obj.elem, obj.from, obj.to, obj.name)
			}
			if (callback) {
				callback()
			}
		} else {
			sTime = sTime / duration
			for (key in prop) {
				obj = prop[key]
				ease = obj.ease
				cTime = sTime
				if (ease === 'lin') {
					cTime = 1 - cTime
				} else if (ease === 'ease') {
					cTime = 2 * (0.5 - cTime)
					cTime = 1 - (cTime * cTime * cTime - 3 * cTime + 2) / 4
				} else if (ease === 'ease-in') {
					cTime = 1 - cTime
					cTime *= cTime * cTime
				} else {
					cTime = 1 - cTime * cTime * cTime
				}
				obj.p = cTime
				obj.fn(obj, obj.elem, obj.from, obj.to, obj.name)
			}
			RAF ? RAF(func) : setTimeout(func, 20)
		}
	}
	func()
}

function A(elem, prop, duration, ease) {
	var arr = []
	var callback = function(a) {
		if (a = arr.shift()) {
			if (a[1]) {
				A.apply(this, a).animate(callback)
			} else if (a[0] > 0) {
				setTimeout(callback, a[0]*1000)
			} else {
				a[0]()
				callback()
			}
		}
	}
	
	if (elem > 0 || !elem) {
		prop = {}
		duration = 0
		arr = [[elem || 0]]
		callback(arr)
	}

	expand(prop, {padding: 0, margin: 0, border: 'Width'}, [top, right, bottom, left])
	expand(prop, {borderRadius: 'Radius'}, [top+left, top+right, bottom+right, bottom+left])

	prop = getConfig(prop, elem, ease)
	exec(prop, 1000 * duration, callback)

	return {
		animate: function() {
			arr.push(slice.call(arguments))
			return this
		}
	}
}

return A

}(this);