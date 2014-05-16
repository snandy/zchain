animate = function(window) {

var slice = [].slice
var top = 'Top'
var right = 'Right'
var bottom = 'Bottom'
var left = 'Left'
var mutex = 1
var reUnit = /\d(\D+)$/
var reOpac = /alpha\(opacity=(\d+)\b/i
var reRgba = /#(.)(.)(.)\b|#(..)(..)(..)\b|(\d+)%,(\d+)%,(\d+)%(?:,([\d\.]+))?|(\d+),(\d+),(\d+)(?:,([\d\.]+))?\b/

var getStyle = 
	window.getComputedStyle ? function(elem, name) {return getComputedStyle(elem, null)[name]} 
	: function(elem, name) {return elem.currentStyle[name]}

var timeout = function(win, str) {
    return win['webkitR' + str] || win['mozR' + str] || win['msR' + str] || win['oR' + str] || win['r' + str]
}(window, 'equestAnimationFrame')

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
	
	if (elem.charAt) {
		elem = document.getElementById(elem)
	}
	if (elem > 0 || !elem) {
		prop = {}
		duration = 0
		callback(arr = [[elem || 0]])
	}

	expand(prop, {padding: 0, margin: 0, border: 'Width'}, [top, right, bottom, left])
	expand(prop, {borderRadius: 'Radius'}, [top+left, top+right, bottom+right, bottom+left])

	++mutex

	for (var key in prop) {
		var obj = prop[key]
		if (!obj.to && obj.to !== 0) {
			obj = prop[key] = {to: obj}
		}
		A.defs(elem, obj, key, ease)
	}
	A.iter(prop, 1000 * duration, callback)

	return {
		animate: function() {
			arr.push(slice.call(arguments))
			return this
		}
	}
}

A.defs = function(elem, obj, name, ease) {
	var style = elem.style
	obj.name = name
	obj.elem = elem
	obj.styl = name in style ? style : elem
	obj.ease = obj.ease || ease
	if (!obj.from) {
		obj.from = obj.from === 0 ? 0 : elem[name] ? elem[name] : getStyle(elem, name)
	}
	obj.unit = (reUnit.exec(obj.to) || reUnit.exec(obj.from) || [0, 0])[1]
	obj.fn = /color/i.test(name) ? A.fx.color : A.fx[name] || A.fx._
	obj.mx = 'anim_' + name
	elem[obj.mx] = obj.mxv = mutex
}

A.iter = function(prop, duration, callback) {
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
				if (obj.elem[obj.mx] != obj.mxv) return
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
			timeout ? timeout(func) : setTimeout(func, 20)
		}
	}
	func()
}

A.toRGBA = function(str) {
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

A.fx = {
	_: function(obj, el, from, to, name) {
		to = parseFloat(to) || 0
		from = parseFloat(from) || 0
        var num = 0
        if (obj.p >= 1) {
            num = to
        } else {
            num = obj.p * (to - from) + from
        }
		obj.styl[name] = num + obj.unit
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
		A.fx._(obj, el, from, to, name)
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
            to = obj.to = A.toRGBA(to)
            from = obj.from = A.toRGBA(from)
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
			obj.styl[name] = (3 < arr.length ? 'rgba(' : 'rgb(') + arr.join(',') + ')'
		} catch (k) {
			A.rgbaIE = 1
		}
	}
}
A.fx.height = A.fx.width

return A

}(this);