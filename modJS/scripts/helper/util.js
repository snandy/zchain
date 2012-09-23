define(function() {

	return {
		trim: function(str) {
			return str.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		stripTags: function(str) {
			return str.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, '');
		},
		escapeHTML: function(str) {
			return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		},
		unescapeHTML: function(str) {
			str = this.stripTags();
			return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
		},
		camelize: function(str) {
			return str.replace(/-+(.)?/g, function(match, chr) {
				return chr ? chr.toUpperCase() : '';
			});
		},
		underscore: function(str) {
		    return str.replace(/::/g, '/')
		               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
		               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
		               .replace(/-/g, '_')
		               .toLowerCase();			
		},
		include: function (str, pattern) {
		    return str.indexOf(pattern) > -1;
		},
		startsWith: function(str, pattern) {
			return str.lastIndexOf(pattern, 0) === 0;
		},
		endsWith: function(str, pattern) {
		    var d = str.length - pattern.length;
		    // We use `indexOf` instead of `lastIndexOf` to avoid tying execution
		    // time to string length when string doesn't end with pattern.
		    return d >= 0 && this.indexOf(pattern, d) === d;			
		}


	};

	
});