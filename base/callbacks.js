/**
 * Callbacks
 * 
 * options 'once unique stopOnFalse'
 * 
 */

function Callbacks(options) {
	var list = [],
		slice = list.slice,
		rspace = /\s+/,
		fired,
		optionsCache = {},
		options = optionsCache[options] || createOptions(options)
	
	function each(obj, iterator, context) {
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
	function createOptions(options) {
		var object = optionsCache[options] = {}
		options && each( options.split(rspace) || [], function(flag) {
			object[flag] = true
		})
		return object
	}
	function fire(context, args) {
		var i = 0, cb
		if (options.once && fired) {
			return
		}
		while (cb = list[i++]) {
			if (cb.apply(context, args) === false && options.stopOnFalse) {
				break
			}
		}
		fired = true
	}
	
	var target = {
		add: function() {
			(function add( args ) {
				each( args, function(arg) {
					var type = typeof arg
					if (type === 'function') {
						if (!options.unique || !target.has(arg)) {
							list.push(arg)
						}
					} else if (arg && arg.length && type !== 'string') {
						add(arg)
					}
				})
			})(arguments)
		},
		has: function(callback) {
			var i = 0, cb
			while (cb = list[i++]) {
				if (cb === callback) {
					return true
				}
			}
			return false
		},
		remove: function() {
			each(arguments, function(arg) {
				var len = list.length
				for (var i=0; i<len; i++) {
					if (arg === list[i]) {
						list.splice(i, 1)
						i--;
						len--;
					}
				}
			})
			return this
		},
		fireWith: function(context /* ,arg1,arg2.. */) {
			var args = slice.call(arguments, 1)
			fire(context, args)
			return this
		},
		fire: function() {
			fire(this, arguments)
			return this
		}
	}
	
	return target
	
}
