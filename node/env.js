/**
 * @module env
 * Determines information about features are supported in the current environment
 * @singleton
 * @author allex.
 */
define(function() {

	var doc = window.document,
		navigator = window.navigator,
		ua = navigator.userAgent,
		platform = navigator.platform,
		RegExp = window.RegExp,

		rdot = /\./g,
		numberify = function(s) { var c = 0;
			return parseFloat(s.replace(rdot, function() {
				return (c++ === 1) ? '' : '.';
			}));
		},
		o = {},
		rv, ver, name = 'unknow';

	// Operating System detections
	if ((/Windows|Win32/).test(ua)) {
		name = 'win';
		if (/Windows NT\s([^;]+)/.test(ua)) {
			switch (RegExp['$1']) {
				case '5.0':
				case '5.1': name = 'win2k'; break;
				case '6.0': name = 'vista'; break;
				case '6.1': name = 'win7'; break;
			}
		}
	} else if ((/Macintosh/).test(ua)) {
		name = 'mac';
	} else if (platform === 'X11') {
		name = 'unix';
	} else if ((/rhino/i).test(ua)) {
		name = 'rhino';
	} else if (platform === 'iPad' || platform === 'iPhone' || /i(?:Phone|Pad)/.test(ua)) {
		name = 'iOS';
	}
	o.os = name;

	// Browser detections

	// Modern KHTML browsers should qualify as Safari X-Grade
	if ((/KHTML/).test(ua)) {
		o.webkit = 1;
	}

	(o.webkit = /AppleWebKit\/([^\s]*)/.test(ua))
	  || (o.ie = /MSIE\s([^;]*)/.test(ua))
	  || (o.opera = /Opera[\s\/]([^\s]*)/.test(ua))
	  || (o.gecko = /Gecko\/([^\s]*)/.test(ua))
	  || (o.unknown = true);

	rv = RegExp['$1'];

	if (o.webkit) {
		o.webkit = numberify(rv);

		if (/Safari\/([^\s]*)/.test(ua)) {
			name = 'safari';
			ver = 'Version';
			if (/Chrome\/([^\s]*)/.test(ua)) { // Chrome
				name = 'chrome';
				ver = 'Chrome';
			}
			o[name] = numberify(new RegExp(ver + '\/([^\s]*)').test(ua) && RegExp['$1']);
		}

	} else if (o.gecko) {
		// Gecko detected, look for revision
		rv = /rv:([^\s\)]*)/.test(ua) && RegExp['$1'];
		if (/Firefox\/([^\s]*)/.test(ua)) {
			o.firefox = numberify(RegExp['$1']);
		}
	}

	rv = rv || RegExp['$1'];
	if (rv) {
		o.version = numberify(rv);
	}

	if (o.ie) {
		o.ie = o.version;

		// In cases where the page has an HTTP header or META tag with
		// X-UA-Compatible, then it is in emulation mode, for a previous
		// version. Make sure ie reflects the desired version.
		// document.documentMode of 5 means quirks mode.
		// http://msdn.microsoft.com/en-us/library/cc196988%28VS.85%29.aspx
		if (o.ie >= 8 && doc.documentMode !== 5) {
			o.ie = doc.documentMode;
		}

		/* Fix to Improve IE6, remove css image flicker */
		if (o.ie <= 6) try {
			doc.execCommand('BackgroundImageCache', false, true);
		} catch(e) {}
	}

	// By default, all browsers use the W3C box model, with the exception of IE
	// in "Quirks Mode" (IE5.5 Mode), which uses the traditional one.
	// see also http://www.quirksmode.org/css/box.html
	o.isStrict = (doc.compatMode === 'CSS1Compat');

	return o;
});
