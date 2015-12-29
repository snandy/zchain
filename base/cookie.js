/**
 * cookie.js
 *
 * ***USE***
 * 1. cookie.set('key', 'value');
 * 2. cookie.set({
 *        key1: 'value1',
 *        key2: 'value2'
 *    });
 *
 * 3. cookie.set('key', 'value', {
 *        expires: 7, // expires in one week
 *    });
 *
 * 4. cookie.set({
 *        key1: 'value1',
 *        key2: 'value2'
 *    }, {
 *        expires: 7
 *    })
 */
~function (document, undefined) {

	var cookie = function () {
		return cookie.get.apply(cookie, arguments)
	}

	var utils = cookie.utils =  {
		isArray: Array.isArray || function(value) {
			return Object.prototype.toString.call(value) === '[object Array]'
		},
		isPlainObject: function(value) {
			return !!value && Object.prototype.toString.call(value) === '[object Object]'
		},
		toArray: function(value) {
			return Array.prototype.slice.call(value);
		},
		getKeys: Object.keys || function(obj) {
			var keys = []
			var key = ''
			for (key in obj) {
				if (obj.hasOwnProperty(key)) keys.push(key)
			}
			return keys
		},
		encode: function(value) {
			return String(value).replace(/[,;"\\=\s%]/g, function(character) {
				return encodeURIComponent(character)
			})
		},
		decode: function(value) {
			return decodeURIComponent(value)
		},
		retrieve: function(value, fallback) {
			return value == null ? fallback : value
		}
	}

	cookie.defaults = {}
	cookie.expiresMultiplier = 60 * 60 * 24

	cookie.set = function(key, value, options) {
		if (utils.isPlainObject(key)) {
			for (var k in key) {
				if (key.hasOwnProperty(k)) this.set(k, key[k], value)
			}
		} else {
			options = utils.isPlainObject(options) ? options : { expires: options }

			var expires = options.expires !== undefined ? options.expires : (this.defaults.expires || '')
			var expiresType = typeof expires

			if (expiresType === 'string' && expires !== '') {
				expires = new Date(expires)
			} else if (expiresType === 'number') { // This is needed because IE does not support the `max-age` cookie attribute.
				expires = new Date(+new Date + 1000 * this.expiresMultiplier * expires)
			}

			if (expires !== '' && 'toGMTString' in expires) {
				expires = ';expires=' + expires.toGMTString()
			}

			var path = options.path || this.defaults.path
			path = path ? ';path=' + path : ''

			var domain = options.domain || this.defaults.domain
			domain = domain ? ';domain=' + domain : ''

			var secure = options.secure || this.defaults.secure ? ';secure' : ''
			if (options.secure === false) secure = ''

			document.cookie = utils.encode(key) + '=' + utils.encode(value) + expires + path + domain + secure
		}

		return this
	}

	cookie.setDefault = function(key, value, options) {
		if (utils.isPlainObject(key)) {
			for (var k in key) {
				if (this.get(k) === undefined) this.set(k, key[k], value)
			}
			return cookie
		} else {
			if (this.get(key) === undefined) return this.set.apply(this, arguments)
		}
	}

	cookie.remove = function(keys) {
		keys = utils.isArray(keys) ? keys : utils.toArray(arguments)

		for (var i = 0, l = keys.length; i < l; i++) {
			this.set(keys[i], '', -1)
		}

		return this
	}

	cookie.empty = function() {
		return this.remove(utils.getKeys(this.all()))
	}

	cookie.get = function(keys, fallback) {
		var cookies = this.all()

		if (utils.isArray(keys)) {
			var result = {}

			for (var i = 0, l = keys.length; i < l; i++) {
				var value = keys[i]
				result[value] = utils.retrieve(cookies[value], fallback)
			}

			return result

		} else return utils.retrieve(cookies[keys], fallback)
	}

	cookie.all = function() {
		if (document.cookie === '') return {}

		var cookies = document.cookie.split('; ')
		var result = {}

		for (var i = 0, l = cookies.length; i < l; i++) {
			var item = cookies[i].split('=')
			var key = utils.decode(item.shift())
			var value = utils.decode(item.join('='))
			result[key] = value
		}

		return result
	}

	cookie.enabled = function() {
		if (navigator.cookieEnabled) return true

		var ret = cookie.set('_', '_').get('_') === '_'
		cookie.remove('_')
		return ret
	}

	// If an AMD loader is present use AMD.
	// If a CommonJS loader is present use CommonJS.
	// Otherwise assign the `cookie` object to the global scope.

	if (typeof define === 'function' && define.amd) {
		define(function() {
			return cookie
		})
	} else if (typeof exports !== 'undefined') {
		exports.cookie = cookie
	} else window.cookie = cookie


}(document);


// ----------------------------------------------------------------------------------------------------------------------------

var cookie = function(name, value, options) {
	if (value != undefined) { // set 
		options = options || {}
		if (value === null) {
			value = ''
			options.expires = -1
		}
		var expires = ''
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date = new Date
			if (typeof options.expires == 'number') {
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
			} else {
				date = options.expires
			}
			// for IE
			expires = '; expires=' + date.toUTCString()
		}
		var path   = options.path ? '; path=' + options.path : ''
		var domain = options.domain ? '; domain=' + options.domain : ''
		var secure = options.secure ? '; secure' : ''
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')

	} else { // get 
		var cookieValue = null
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';')
			for (var i = 0; i < cookies.length; i++) {
				var cookie = $.trim(cookies[i]).split('=')
				if ( cookie[0] == name && cookie.length > 1 ) {
					try {
						cookieValue = decodeURIComponent(cookie[1])
					} catch(e) {
						cookieValue = cookie[1]
					}
					break
				}
			}
		}
		return cookieValue
	}
};