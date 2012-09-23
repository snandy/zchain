/**
 * JSON.parse
 * JSON.stringify
 * 
 */
define(function() {

	/**
	 * Regex used to replace special characters in strings for JSON stringification.
	 */
	var _SPECIAL_CHARS = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	/*
	 * Replace certain Unicode characters that JavaScript may handle incorrectly
	 * during eval--either by deleting them or treating them as line
	 * endings--with escape sequences.
	 * IMPORTANT NOTE: This regex will be used to modify the input if a match is
	 * found.
	 */
	_UNICODE_EXCEPTIONS = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,

	/**
	 * Character substitution map for common escapes and special characters.
	 */
	_CHARS = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},

	JSON = window.JSON,

	toString = Object.prototype.toString,

	// Only accept JSON objects that report a [[Class]] of JSON
	JSON = toString.call(JSON) === '[object JSON]' && JSON;

	// Escapes a special character to a safe Unicode representation
	function _char(c) {
		if (!_CHARS[c]) {
			_CHARS[c] =  '\\u'+('0000'+(+(c.charCodeAt(0))).toString(16)).slice(-4);
		}
		return _CHARS[c];
	}

	// Enclose escaped strings in quotes
	function _string(s) { return '"' + s.replace(_SPECIAL_CHARS, _char) + '"'; }

	// JavaScript implementation of stringify (see API declaration of stringify)
	function stringify(o) {
		var stack = [];

		function _serialize(h, key) {
			var value = h[key],
				t	 = typeof value,
				a	 = [],
				COLON = ':',
				COMMA = ',',
				NULL  = 'null',
				arr, i, keys, k, v;

			// Per the ECMA 5 spec, toJSON is applied before the replacer is
			// called.  Also per the spec, Date.prototype.toJSON has been added, so
			// Date instances should be serialized prior to exposure to the
			// replacer.  I disagree with this decision, but the spec is the spec.
			if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
				value = value.toJSON(key);
			}

			if (value !== h[key]) {
				t = typeof value;
			}

			if (value === null) return NULL;

			switch (t) {
				case 'object' : break;
				case 'string' : return _string(value);
				case 'number' : return isFinite(value) ? value + '' : NULL;
				case 'boolean':
				default	   : return String(value);
			}

			// Check for cyclical references in nested objects
			for (i = stack.length - 1; i >= 0; --i) {
				if (stack[i] === value) {
					throw new Error("JSON.stringify. Cyclical reference");
				}
			}

			arr = toString.call(value) === '[object Array]' || (('length' in value) && value.slice);

			// Add the object to the processing stack
			stack.push(value);

			if (arr) { // Array
				for (i = value.length - 1; i >= 0; --i) {
					a[i] = _serialize(value, i) || NULL;
				}
			} else {   // Object
				// If whitelist provided, take only those keys
				keys = value;
				i = 0;

				for (k in keys) {
					if (keys.hasOwnProperty(k)) {
						v = _serialize(value, k);
						if (v) {
							a[i++] = _string(k) + COLON + v;
						}
					}
				}
			}

			// remove the array from the stack
			stack.pop();

			return arr ? '[' + a.join(COMMA) + ']': '{' + a.join(COMMA) + '}';
		}

		// process the input
		return _serialize({'':o}, '');
	}

	var stringify = JSON ? JSON.stringify : stringify;

	var parse = function (text, reviver) {

		if (text === '') return null;

		if (JSON.parse) {
			try {
				return JSON.parse(text, reviver);
			} catch (e) {
				this.error(e);
				return null;
			}
		}

		// The parse method takes a text and an optional reviver function, and returns
		// a JavaScript value if the text is a valid JSON text.

		var j;

		function walk(holder, key) {

			// The walk method is used to recursively walk the resulting structure so
			// that modifications can be made.

			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = walk(value, k);
						if (v !== undefined) {
							value[k] = v;
						} else {
							delete value[k];
						}
					}
				}
			}
			return reviver.call(holder, key, value);
		}

		// Parsing happens in four stages. In the first stage, we replace certain
		// Unicode characters with escape sequences. JavaScript handles many characters
		// incorrectly, either silently deleting them, or treating them as line endings.

		text = String(text);
		_UNICODE_EXCEPTIONS.lastIndex = 0;
		if (_UNICODE_EXCEPTIONS.test(text)) {
			text = text.replace(_UNICODE_EXCEPTIONS, function (a) {
				return '\\u' +
					('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			});
		}

		// In the second stage, we run the text against regular expressions that look
		// for non-JSON patterns. We are especially concerned with '()' and 'new'
		// because they can cause invocation, and '=' because it can cause mutation.
		// But just to be safe, we want to reject all unexpected forms.

		// We split the second stage into 4 regexp operations in order to work around
		// crippling inefficiencies in IE's and Safari's regexp engines. First we
		// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
		// replace all simple value tokens with ']' characters. Third, we delete all
		// open brackets that follow a colon or comma or that begin the text. Finally,
		// we look to see that the remaining characters are only whitespace or ']' or
		// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

		if (/^[\],:{}\s]*$/
				.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
					.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

			// In the third stage we use the eval function to compile the text into a
			// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
			// in JavaScript: it can begin a block or an object literal. We wrap the text
			// in parens to eliminate the ambiguity.

			j = eval('(' + text + ')');

			// In the optional fourth stage, we recursively walk the new structure, passing
			// each name/value pair to a reviver function for possible transformation.

			return typeof reviver === 'function' ?
				walk({'': j}, '') : j;
		}

		// If the text is not JSON parseable, then a SyntaxError is thrown.
		this.error(new SyntaxError('JSON.parse'));

		return null;
	};

	/* exports */
	return {

		/**
		 * <p>This method parses a JSON text to produce an object or array.
		 * It can return null if has SyntaxError exception.</p>
		 *
		 * @see also: http://www.JSON.org/json2.js
		 */
		parse: parse,

		/**
		 * <p>Converts an arbitrary value to a JSON string representation.</p>
		 * @alias toJSON
		 */
		stringify: JSON ? JSON.stringify : stringify

	};

});
