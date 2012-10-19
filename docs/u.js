/**
 * Utiltity functions
 * 
 */

~function(window) {

var U = {}

var AP = Array.prototype, OP = Object.prototype, FP = Function.prototype

var slice          = AP.slice,
	toString       = OP.toString,
	hasOwnProperty = OP.hasOwnProperty

// for internal usage only
var each, some,
	defIterator = function(obj) {
		return obj
	}

U.each = each = function(obj, iterator, context) {
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

U.map = function(obj, iterator, context) {
	var results = []
	if (obj == null) return results
	each(obj, function(value, index, list) {
		results[results.length] = iterator.call(context, value, index, list)
	})
	if (obj.length === +obj.length) results.length = obj.length
	return results
}

U.some = some = function(obj, iterator, context) {
	var result = false
	if (obj == null) return result
	iterator = iterator || defIterator
	each(obj, function(value, index, list) {
		if ( iterator.call(context, value, index, list) ) {
			result = true
			return result
		}
	})
	return result
}

U.find = function(obj, iterator, context) {
	var result
	some(obj, function(value, index, list) {
		if (iterator.call(context, value, index, list)) {
			result = value
			return true
		}
	})
	return result
}

each(['Array', 'Arguments', 'Boolean', 'Function', 'Object', 'String', 'Number', 'Date', 'RegExp'], function(name) {
	U['is' + name] = function(obj) {
		return toString.call(obj) === '[object ' + name + ']'
	}
})

U.isNull = function(obj) {
	return obj === null
}

U.isUndefined = function(obj) {
	obj === void 0
}

U.isNaN = function(obj) {
	return obj !== obj
}

U.isEmpty = function(obj) {
	if (obj == null) return true
	if (U.isArray(obj) || U.isString(obj)) return obj.length === 0
	for (var k in obj) {return false}
	return true
}

U.delay = function(func, wait) {
	return function() {
		var context = this, args = arguments
		setTimeout(function() {
			func.apply(context, args)
		}, wait)
	}
}

U.once = function(func) {
	var ran = false, memo
	return function() {
		if (ran) return memo
		ran = true
		memo = func.apply(this, arguments)
		func = null
		return memo
	}
}

U.debounce = function(func, wait, immediate) {
	var timeout, result
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) result = func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) result = func.apply(context, args)
		return result
	}
}

U.throttle = function(func, wait) {
	var context, args, timeout, throttling, more, result,
		whenDone = U.debounce(function() { more = throttling = false }, wait)
	return function() {
		context = this, args = arguments
		var later = function() {
			timeout = null
			if (more) {
				result = func.apply(context, args)
			}
			whenDone()
		}
		if (!timeout) timeout = setTimeout(later, wait)
		if (throttling) {
			more = true;
		} else {
			throttling = true
			result = func.apply(context, args)
		}
		whenDone()
		return result
	}
}


// Expose E to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
	define('U', [], function () { return U } )
} else {
	window.U = U
}

}(this)
