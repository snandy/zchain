
/**
 * writing modular JavaScript with boot js
 * by @snandy 2012-1-11
 * 
 */
(function (global) {

var boot, doc = global.document;

boot = function() {
	var readyReg = /^(complete|loaded)$/,
		jsExtReg = /^\/|:|\?|\.js$/,
		isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
		globalQueue = [],
		scriptNode = doc.createElement('script'),
		head = doc.head || doc.getElementsByTagName('head')[0],
		isArray = Array.isArray || function(obj) { return obj.constructor === Array };
		
	var conf = {
			baseUrl: './'
		},
		defQueue = [],
		urlMap = {},
		defined = {},
		urlFetched = {},
		managerCounter = 0,
		modules = [],
		managers = {};

	function mixin(target, source) {
		for (var prop in source) {
			target[prop] = source[prop];
		}
		return target;
	}
	
	function normalize(name) {
		if (name && name.charAt(0) === '.' && name.indexOf('./') === 0) {
			name = name.substring(2);
		}
		return name;
	}

	function makeMap(name) {
		var normalizedName, url;
			
		if (name) {
			normalizedName = normalize(name);
			url = urlMap[normalizedName];
			if (!url) {
				url = nameToUrl(normalizedName);
				urlMap[normalizedName] = url;
			}
		}
		
		return {
			url: url,
			fullName: normalizedName
		};
	}

	function onScriptLoad(evt) {
		var node = evt.currentTarget || evt.srcElement, moduleName;
		
		if (evt.type === 'load' || (node && readyReg.test(node.readyState))) {
			moduleName = node.getAttribute('data-module');
			complete(moduleName);
			
			if (node.detachEvent && !isOpera) {
				node.detachEvent('onreadystatechange', onScriptLoad);
			} else {
				node.removeEventListener('load', onScriptLoad, false);
			}
			
			head.removeChild(node);
			node = null;
		}
	}
	
	function insertScript(url, moduleName) {
		var node = scriptNode.cloneNode(false);
			node.type = 'text/javascript';
			node.charset = 'utf-8';
			node.setAttribute('data-module', moduleName);
		
		if (node.attachEvent && !isOpera) {
			node.attachEvent('onreadystatechange', onScriptLoad);
		} else {
			node.addEventListener('load', onScriptLoad, false);
		}
		
		node.src = url;
		head.insertBefore(node, head.firstChild);
	}
	
	function exec(mod) {
		var i, ret,
			map = mod.map,
			cb = mod.callback,
			args = mod.deps,
			fullName = map.fullName,
			listeners = mod.listeners;
			
		if (typeof cb === 'function') {
			ret = mod.callback.apply(defined[fullName], args);
			if (fullName) {
				defined[fullName] = ret;
			}
		} else if (fullName) {
			ret = defined[fullName] = cb;
		}
		
		delete managers[fullName];
		
		for (i = 0; (cb = listeners[i]); i++) {
			cb(ret);
		}
	}

	function makeCallback(mod, i) {
		return function (value) {
			if (!mod.depDone[i]) {
				mod.depDone[i] = true;
				mod.deps[i] = value;
				mod.depCount -= 1;
				if (!mod.depCount) {
					exec(mod);
				}
			}
		};
	}
	
	function pushListener(cb) {
		this.listeners.push(cb);
	}

	function makeMod(map, shouldQueue) {
		var fullName = map.fullName, mod;
			
		if (fullName) {
			mod = managers[fullName];
		}
		if (!mod) {
			mod = {
				id: '' + (fullName || 'mod_' + managerCounter++),
				map: map,
				depCount: 0,
				depDone: [],
				deps: [],
				listeners: [],
				add: pushListener
			};
			if (fullName) {
				managers[fullName] = mod;
			}
			if (shouldQueue) {
				modules.push(mod);
			}
		}
		
		return mod;
	}

	function main(name, depArray, callback) {
		var moduleMap = makeMap(name),
			mod = makeMod(moduleMap),
			deps = mod.deps, i, depArg, depName;
		
		mod.callback = callback;
		
		for (i = 0; i < depArray.length; i++) {
			depArg = depArray[i];
			
			if (depArg) {
				depArg = makeMap(depArg);
				depName = depArg.fullName;
				depArray[i] = depName;
				
				if (depName in defined) {
					deps[i] = defined[depName];
				} else {
					mod.depCount += 1;
					makeMod(depArg, true).add(makeCallback(mod, i));
				}
			}
		}
		
		if (!mod.depCount) {
			exec(mod);
		}
	}

	function callMain(args) {
		main.apply(null, args);
	}

	function resume() {
		var mod, map, url, i, p, args, fullName;
		
		while (defQueue.length) {
			args = defQueue.shift();
			if (args[0]) {
				callMain(args);
			}
		}
		
		while (modules.length) {
			p = modules;
			modules = [];
			
			for (i = 0; (mod = p[i]); i++) {
				map = mod.map;
				url = map.url;
				fullName = map.fullName;
				
				if (!urlFetched[url]) {
					insertScript(url, fullName);
					urlFetched[url] = true;
				}
			}
		}
	}
	// AMD define
	function define(name, deps, callback) {
		if (typeof name !== 'string') {
			callback = deps;
			deps = name;
			name = null;
		}
		
		if (!isArray(deps)) {
			callback = deps;
			deps = [];
		}
		
		globalQueue.push([name, deps, callback]);
	}
	
	define.amd = {
		jQuery: true
	};
	function require(deps, callback) {
		if (deps && deps.length || callback) {
			main(null, deps, callback);
		}
		
		while (modules.length) {
			setGlobalQueue();
			resume();
		}
	}
	
	function setGlobalQueue() {
		if (globalQueue.length) {
			Array.prototype.splice.apply(defQueue, [defQueue.length - 1, 0].concat(globalQueue));
			globalQueue = [];
		}
	}

	function nameToUrl(moduleName) {
		var pkg, syms, parentModule, url;
			
		moduleName = normalize(moduleName);
		
		if (jsExtReg.test(moduleName)) {
			url = moduleName;
			
		} else {
			syms = moduleName.split('/');
			url = syms.join('/') + '.js';
			url = (url.charAt(0) === '/' || url.match(/^\w+:/) ? '' : conf.baseUrl) + url;
		}
		
		return conf.urlArgs ? 
				url + ((url.indexOf('?') === -1 ? '?' : '&') + conf.urlArgs) : 
				url;
	}
	
	function config(obj) {
		var prop;
		if (obj.baseUrl) {
			if (obj.baseUrl.charAt(obj.baseUrl.length - 1) !== '/') {
				obj.baseUrl += '/';
			}
		}
		
		mixin(conf, obj);
		
		if (obj.priority) {
			setGlobalQueue();
			resume();
			require(obj.priority);
			resume();
		}
		
		if (obj.deps || obj.callback) {
			require(obj.deps || [], obj.callback);
		}
	}
	
	function complete(moduleName) {
		var args;
		setGlobalQueue();

		while (defQueue.length) {
			args = defQueue.shift();
			if (args[0] === null) {
				args[0] = moduleName;
				break;
			} else if (args[0] === moduleName) {
				break;
			} else {
				callMain(args);
				args = null;
			}
		}
		
		if (args) {
			callMain(args);
		} else {
			callMain([moduleName, [],
				moduleName === "jquery" && typeof jQuery !== "undefined" ?
					function () {
						return jQuery;
					} : null]);
		}
		
		resume();
	}
	
	return {
		resume: resume,
		config: config,
		define: define,
		require: require,
		setGlobalQueue: setGlobalQueue
	};
}();

// initialization
(function(){
	var scripts = doc.getElementsByTagName('script');
	var obj = {}, 
		len = scripts.length,
		i, src, script, dataMain, mainScript, subPath;
		
	for (i = 0; i < len; i++) {
		if ((script=scripts[i]) && (dataMain = script.getAttribute('data-main'))) {
			src = dataMain.split('/');
			mainScript = src.pop();
			subPath = src.length ? src.join('/')  + '/' : './';
			obj.baseUrl = subPath;
			dataMain = mainScript.replace(/\.js$/, '');
			obj.deps = [dataMain];
			break;
		}
	}
	
	boot.config(obj);
})();

// exports
global.boot = boot;
global.define = boot.define;
global.require = boot.require;


//If modules are built into require.js, then need to make sure dependencies are traced.
//Use a setTimeout in the browser world, to allow all the modules to register
setTimeout(function(){
	boot.setGlobalQueue();
	boot.resume();
}, 0);

})(this);

define("boot", function(){});

/**
 * @module env
 * Determines information about features are supported in the current environment
 * @singleton
 * @author allex.
 */
define('env',[],function() {

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

/**
 * @module cache
 * @author zhoutao (2011-06-02)
 *
 * Cache Manager, 数据管理, 通过HTMLElement关联
 */
define('cache',[],function() {

	var idSeed = 0,
		cache = {},
		id = '_ guid _';

	// @private
	function guid(el) {
		return el[id] || (el[id] = ++idSeed);
	}

	return {
		set: function(el, key, val) {

			if (!el) {
				throw new Error('setting failed, invalid element');
			}

			var id = guid(el),
				c = cache[id] || (cache[id] = {});
			if (key) c[key] = val;

			return c;
		},

		get: function(el, key, create) {
			if (!el) {
				throw new Error('getting failed, invalid element');
			}

			var id = guid(el),
				elCache = cache[id] || (create && (cache[id] = {}));

			if (!elCache) return null;

			return key !== undefined ? elCache[key] || null : elCache;
		},

		has: function(el, key) {
			return this.get(el, key) !== null;
		},

		remove: function(el, key) {
			var id = typeof el === 'object' ? guid(el) : el,
				elCache = cache[id];

			if (!elCache) return false;

			if (key !== undefined) {
				delete elCache[key];
			} else {
				delete cache[id];
			}

			return true;
		}
	};
});


/**
 * css选择器，根据2\8原则，这里只实现最常用的三种
 * 注：当结果集只有一个元素时将直接返回该元素
 *
 * @param {Object} selector
 * @param {Object} context
 *
 * 1, 通过className获取
 * ('.cls')
 * ('.cls', el)
 * ('.cls', 'id')
 * ('span.cls')
 * ('span.cls', el)
 * ('span.cls', 'id')
 *
 * 2, 通过tagName获取
 * ('span')
 * ('span', el)
 * ('span', 'id')
 *
 * 3, 通过attribute获取
 * ('[name]')
 * ('[name]', el)
 * ('[name]', 'id')
 * ('[name=uname]')
 * ('[name=uname]', el)
 * ('[name=uname]', 'id')
 * ('input[name=uname]')
 * ('input[name=uname]', el)
 * ('input[name=uname]', 'id')
 */
define('selector',[],function() {

	// TODO: Integarate the third-party selector (Sizzle.js, http://sizzlejs.com/)

	var R = {},
		undefined,
		doc = window.document,
		RegExp = window.RegExp;

	function query(selector, context) {
		var regCls = /^([-\w]+)?\.([-\w]+)/,
			regTag = /^([\w\*]+)$/,
			regNodeAttr = /^([-\w]+)?\[([\w]+)(=(\w+))?\]/,
			context = context === undefined ? doc : 
				typeof context === 'string' ? doc.getElementById(context) : context;

		if(context.querySelectorAll) {
			if(context.nodeType == 1) {
				var old = context.id, id = context.id = '__$$__';
				try {
					return context.querySelectorAll( '#' + id + ' ' + selector );
				} catch(e){
				} finally {
					old ? context.id = old : context.removeAttribute( 'id' );
				}
			}
			return context.querySelectorAll(selector);
		}
		
		if (regCls.test(selector)) {
			var ary = selector.split('.'),
				tag = ary[0],
				cls = ary[1],
				len, all, els = [];
			if (context.getElementsByClassName) {
				var res = context.getElementsByClassName(cls);
				if (tag) {
					for (var i = 0, len = res.length; i < len; i++) {
						res[i].tagName.toLowerCase() == tag && els.push(res[i]);
					}
				}
				return res;
			} else {
				all = context.getElementsByTagName(tag || '*');
				return filter(all, 'className', cls);
			}
		}

		if (regTag.test(selector)) {
			return context.getElementsByTagName(selector);
		}
		
		if (regNodeAttr.test(selector)) {
			var ary = regNodeAttr.exec(selector),
				all = context.getElementsByTagName(ary[1] || '*');
			return filter(all, ary[2], ary[4]);
		}

	};
	
	function filter(all, attr, val) {
		var i = -1, el, r = -1, res = [], reg = new RegExp('(?:^|\\s+)' + val + '(?:\\s+|$)');
		while ((el = all[++i])) {
			if (test(el)) { res[++r] = el; }
		}
		return res;
	}
	
	function test(node) {
		var v = attr == 'className' ? node.className : node.getAttribute(attr);
		if (v) {
			if (val) {
				if (reg.test(v)) return true;
			} else {
				return true;
			}
		}
		return false;
	}
	
	// public api & alias
	R.$ = function(id) {return typeof id == 'string' ? doc.getElementById(id) : id;};
	R.$$ = query;
	R.get = function(selector, context) {
		return query(selector, context)[0] || null;
	};
	
	return R;
});

/**
 * Event manager
 * 2011-08-10 snandy
 * 
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from jQuery library (1.6.2).
 * 
 * 
 * add event : 
 * 
 * E.bind(el, 'click', fn);
 * E.bind(el, 'click.name', fn);
 * E.bind(el, 'click', fn, data);
 * 
 * remove event : 
 * 
 * E.unbind(el, 'click', fn);
 * E.unbind(el, 'click.name');
 * E.unbind(el, 'click');
 * E.unbind(el);
 * 
 * trigger event
 * 
 * E.trigger(el, 'click');
 * E.trigger(el, 'click.name');
 * E.trigger(el, 'click!');
 * 
 * 
 */

define('event',['cache'], function(cache) {
	
	var doc = window.document,
		
		w3c = !!doc.addEventListener,
	
		expando = 'snandy' + (''+Math.random()).replace(/\D/g, ''),
		
		triggered,
	
		addListener = w3c ?
			function(el, type, fn) { el.addEventListener(type, fn, false); } :
			function(el, type, fn) { el.attachEvent('on' + type, fn); },
			
		removeListener = w3c ?
			function(el, type, fn) { el.removeEventListener(type, fn, false); } :
			function(el, type, fn) { el.detachEvent('on' + type, fn); };

	
	function returnFalse() {
		return false;
	}
	
	function returnTrue() {
		return true;
	}
	
	function now() {
		return (new Date).getTime();
	}
	
	function isEmptyObject(obj){
		for (var i in obj){
			return false;
		}
		return true;
	}
	
	function addEvent (elem, types, handler, data) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}
		
		if (handler === false) {
			handler = returnFalse;
		} else if (!handler) {
			return;
		}
		
		var elemData = cache.get(elem, undefined, true),
			events   = elemData.events,
			eventHandle = elemData.handle,
			types = types.split(' ');
	
		if (!events) {
			elemData.events = events = {};
		}
		
		if (!eventHandle) {
			elemData.handle = eventHandle = function (e) {
				return triggered !== e.type ? 
					evtHandle.apply( eventHandle.elem, arguments ) : 
					undefined;
			};
		}
		
		eventHandle.elem = elem;
		
		var type, i = 0, namespaces;
		
		while ( type = types[i++] ) {
			var handleObj = {handler : handler, data : data},
				handlers  = events[type];
		
			// Namespaced event handlers
			if ( type.indexOf('.') > -1 ) {
				namespaces = type.split('.');
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).join('.');
	
			} else {
				handleObj.namespace = '';
			}
			
			if (!handlers) {
				handlers = events[type] = [];
				addListener( elem, type, eventHandle );
			}
			
			handlers.push(handleObj);
		}
		
		elem = null;
	}
	
	function trigger(elem, event, data, onlyHandlers) {
		
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;
	
		if (type.indexOf('!') >= 0) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}
	
		if (type.indexOf('.') >= 0) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split('.');
			type = namespaces.shift();
			namespaces.sort();
		}
		
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}
		
		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === 'object' ?
			// jQuery.Event object
			event[expando] ? event :
			// Object literal
			new Event(type, event) :
			// Just the event type (string)
			new Event(type);
	
		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join('.');
		event.namespace_re = new RegExp('(^|\\.)' + namespaces.join('\\.(?:.*\\.)?') + '(\\.|$)');
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}
	
		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;
		
		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? [data] : [];
		data.unshift(event);
		
		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(':') < 0 ? 'on' + type : '';
			
		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = cache.get(cur, 'handle');
	
			event.currentTarget = cur;
			if (handle) {
				handle.apply(cur, data);
			}
	
			// Trigger an inline bound script
			if ( ontype && cur[ontype] && cur[ontype].apply(cur, data) === false ) {
				event.result = false;
				event.preventDefault();
			}
	
			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );
		
		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old;
	
			if ( !(type === 'click' && elem.nodeName === 'A') ) {
	
				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[type] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ontype];
	
						if (old) {
							elem[ontype] = null;
						}
						triggered = type;
						elem[type]();
					}
				} catch (ieError) {}
	
				if (old) {
					elem[ontype] = old;
				}
				
				triggered = undefined;
			}
		}
		
		return event.result;
	}
	
	function evtHandle (event) {
		event = fixEvent( event || window.event );
		
		var handlers = ( (cache.get(this, 'events') || {} )[event.type] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );
				
		event.currentTarget = this;
		
		for (var j = 0, l = handlers.length; j < l; j++) {
			var handleObj = handlers[j];
	
			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test(handleObj.namespace) ) {
				
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;
				
				var ret = handleObj.handler.apply(this, args);
				
				if (ret !== undefined) {
					if (ret === false) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
				
				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
				
			}	
	
		}
		
		return event.result;
	}
	
	function removeEvent( elem, types, handler ) {
		// don't do events on text and comment nodes
		if (elem.nodeType === 3 || elem.nodeType === 8) {
			return;
		}
	
		if (handler === false) {
			handler = returnFalse;
		}
		
		var type, origType, i = 0, j,
			elemData = cache.get(elem),
			events = elemData && elemData.events;
	
		if (!elemData || !events) {
			return;
		}
		
		// Unbind all events for the element
		if (!types) {
			types = types || '';
			for (type in events) {
				removeEvent( elem, type );
			}
			return;
		}
		
		// Handle multiple events separated by a space
		// jQuery(...).unbind('mouseover mouseout', fn);
		types = types.split(' ');
		
		while ( (type = types[i++]) ) {
			origType = type;
			handleObj = null;
	
			eventType = events[type] || [];
	
			if (!eventType) {
				continue;
			}
			
			if (!handler) {
				for (j = 0; j < eventType.length; j++) {
					handleObj = eventType[j];
					removeEvent(elem, origType, handleObj.handler);
					eventType.splice(j--, 1);
				}
				continue;
			}
			
			for (j = 0; j < eventType.length; j++) {
				handleObj = eventType[j];
	
				if (handler === handleObj.handler) {
					// remove the given handler for the given type
					eventType.splice(j--, 1);
				}
			}
	
		}
		
		// remove generic event handler if no more handlers exist
		if (eventType.length === 0) {
			removeListener(elem, origType, elemData.handle);
			delete events[origType];
		}
		
		// Remove the expando if it's no longer used
		if ( isEmptyObject(events) ) {
			var handle = elemData.handle;
			if (handle) {
				handle.elem = null;
			}
	
			delete elemData.events;
			delete elemData.handle;
	
			if ( isEmptyObject(elemData) ) {
				cache.remove(elem, 'events');
			}
		}
		
		
	}
	Event = function(src, props) {
		// Allow instantiation without the 'new' keyword
		if (!this.preventDefault) {
			return new Event( src, props );
		}
	
		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
				src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			for (var i in props) {
				this[i] = props[i];
			}
		}
	
		// timeStamp is buggy for some events on Firefox(#3843)
		// So we won't rely on the native value
		this.timeStamp = now();
		
		// Mark it as fixed
		this[expando] = true;	
	
	};
	Event.prototype = {
		preventDefault: function() {
			this.isDefaultPrevented = returnTrue;
			var e = this.originalEvent;
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.returnValue = false;
		},
		stopPropagation: function() {
			this.isPropagationStopped = returnTrue;
			var e = this.originalEvent;
			if (e.stopPropagation) {
				e.stopPropagation();
			}		
			e.cancelBubble = true;
		},
		stopImmediatePropagation: function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse
	};	
		
	function fixEvent( evt ) {
		if ( evt[expando] ) {
			return evt;
		}
		
		var props = 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' '),
			len   = props.length;
		
		var originalEvent = evt;
		evt = new Event(originalEvent);
		
		for (var i = len, prop; i;) {
			prop = props[ --i ];
			evt[ prop ] = originalEvent[ prop ];
		}
		if (!evt.target) {
			evt.target = evt.srcElement || document;
		}
		if ( evt.target.nodeType === 3 ) {
			evt.target = evt.target.parentNode;
		}
		if ( !evt.relatedTarget && evt.fromElement ) {
			evt.relatedTarget = evt.fromElement === evt.target ? evt.toElement : evt.fromElement;
		}
		if ( evt.pageX == null && evt.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			evt.pageX = evt.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			evt.pageY = evt.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}
		if ( !evt.which && ((evt.charCode || evt.charCode === 0) ? evt.charCode : evt.keyCode) ) {
			evt.which = evt.charCode || evt.keyCode;
		}
		if ( !evt.metaKey && evt.ctrlKey ) {
			evt.metaKey = evt.ctrlKey;
		}
		if ( !evt.which && evt.button !== undefined ) {
			evt.which = (evt.button & 1 ? 1 : ( evt.button & 2 ? 3 : ( evt.button & 4 ? 2 : 0 ) ));
		}
		
		return evt;
	}
	
	
	function bind(el, type, handler, data) {
		if (!el) {
			return;
		}
		
		if (typeof type === 'object') {
			for (var key in type) {
				bind(el, key, type[key], data);
			}
			return;
		}
		
		addEvent(el, type, handler, data);
	}
	
	function unbind( el, type, handler ) {
		if (typeof type === 'object') {
			for (var key in type) {
				unbind(el, key, type[key]);
			}
	
		} else {
			removeEvent( el, type, handler );
		}
	}
	
	return {
		bind : bind,
		unbind : unbind,
		trigger : trigger
	};
	
});

/**
 * JSON.parse
 * JSON.stringify
 * 
 */
define('json',[],function() {

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

/**
 *
 * DOM util
 * Version:  0.1
 * Author: snandy
 * Blog: http://snandy.cnblogs.com
 *
 * 1, 普通属性直接name
 * 2, IE6/7中特殊属性如class, for等转义
 * 3, IE6/7中style属性使用cssText
 * 4, support对象
 * 5, class 操作 addClass/removeClass/hasClass/toggleClass/replaceClass
 * 6, 
 * 
 */

define('dom',[],function() {

	var rupper = /([A-Z]|^ms)/g,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/,
		camelRe = /(-[a-z])/gi;
		
	var cssWidth = ['Left', 'Right'],
		cssHeight = ['Top', 'Botton'];
	
	var fixAttr = {
		tabindex: 'tabIndex',
		readonly: 'readOnly',
		'for': 'htmlFor',
		'class': 'className',
		maxlength: 'maxLength',
		cellspacing: 'cellSpacing',
		cellpadding: 'cellPadding',
		rowspan: 'rowSpan',
		colspan: 'colSpan',
		usemap: 'useMap',
		valign: 'vAlign',
		frameborder: 'frameBorder',
		contenteditable: 'contentEditable'
	},
	
	getComputedStyle, currentStyle, getRealStyle, strFloat, getCSS;
	
	// 特性检测
	var support = function() {
		
		var div, p, a;
		
		div = document.createElement( 'div' );
		div.className = 'a';
		div.innerHTML = '<p style="color:red;"><a href="#" style="opacity:.45;float:left;">a</a></p>';
		div.setAttribute('class', 't');
		
		p = div.getElementsByTagName('p')[0];
		a = p.getElementsByTagName('a')[0];
	
		var 
		// http://www.cnblogs.com/snandy/archive/2011/08/27/2155300.html
		setAttr = div.className === 't',
		// http://www.cnblogs.com/snandy/archive/2011/03/11/1980545.html
		cssText = /;/.test(p.style.cssText),
		
		opacity = /^0.45$/.test(a.style.opacity),
		getComputedStyle = !!(document.defaultView && document.defaultView.getComputedStyle);
		
		return {
			setAttr : setAttr,
			cssText : cssText,
			opacity : opacity,
			classList : !!div.classList,
			cssFloat : !!a.style.cssFloat,
			getComputedStyle : getComputedStyle
			
		};
		
	}();
	
	strFloat = support.cssFloat ? 'cssFloat' : 'styleFloat';
	
	var special = {
		style : {
			get: function( el ) {
				var txt = el.style.cssText;
				if(txt) {
					txt =  support.cssText ? txt : txt + ';';
					return txt.toLowerCase();
				}
			},
			set: function( el, value ) {
				return (el.style.cssText = '' + value);
			}
		}
	};
	
	function camelFn(m, a) {
		return a.charAt(1).toUpperCase();
	}
	
	if(document.defaultView && document.defaultView.getComputedStyle) {
		
		getRealStyle = function(el) {
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			return defaultView.getComputedStyle( el, null );
		};
		
		getComputedStyle = function(el, name) {
			var ret, defaultView, computedStyle;
	
			if( !(defaultView = el.ownerDocument.defaultView) ) {
				return null;
			}
			
			if( (computedStyle = defaultView.getComputedStyle( el, null )) ) {
				ret = computedStyle.getPropertyValue( name );
				if(ret === '') {
					ret = el.style[name];
				}
			}
	
			return ret;
		};
	}
	
	if(document.documentElement.currentStyle) {
		
		getRealStyle = function(el) {
			return el.currentStyle;
		};
		
		currentStyle = function( el, name ) {
			var ret = el.currentStyle && el.currentStyle[ name ];
			return ret === "" ? "auto" : ret;
		};
	}
	
	getCSS = getComputedStyle || currentStyle;
	
	function setCSS(el, name, val) {
		name = name.replace(camelRe, camelFn);
		var cssNumber = {
			fontWeight : 1,
			zIndex : 1,
			zoom : 1
		};
		if(typeof val === 'number' && !cssNumber[name]) {
			val += 'px';
		}
		el.style[name] = val;
	}
	
	// class 模块
	var supportClassList = support.classList;
	var hasClass, addClass, removeClass, toggleClass, replaceClass;
	
	function check(el, cls) {
		if (el.nodeType !== 1 || typeof cls !== 'string') {
			return false;
		}
		return true;
	}
	if(supportClassList) {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return el.classList.contains(cls);
			else
				return false;
		};
		addClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.add(c);
				}
			}
		};
		removeClass = function(el, cls) {
			var i = 0, c;
			if( check(el, cls) ) {
				cls = cls.split(' ');
				while( c = cls[i++] ) {
					el.classList.remove(c);
				}
			}
		};
		toggleClass = function(el, cls) {
			if( check(el, cls) ) {
				el.classList.toggle(cls);
			}
		};
		
	}
	else {
		hasClass = function(el, cls) {
			if( check(el, cls) )
				return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') != -1;
			else
				return false
		};
		addClass = function(el, cls) {
			if( check(el, cls) && !hasClass(el, cls) ) {
				el.className += (el.className ? " " : "") + cls;;
			}
		};
		removeClass = function(el, cls) {
			if( check(el, cls) ) {
				el.className = el.className.replace(RegExp("\\b" + cls + "\\b", "g"), "");
			}
		};
		toggleClass = function(el, cls) {
			hasClass(el, cls) ? removeClass(el, cls) : addClass(el, cls);
		};
	}
	replaceClass = function(el, oldCls, newCls) {
		removeClass(el, oldCls);
		addClass(el, newCls);
	}
	
	// 获取元素宽高
	function getWidthOrHeight(el, name, extra) {
		// Start with offset property
		var val = name === "width" ? el.offsetWidth : el.offsetHeight,
			which = name === "width" ? cssWidth : cssHeight;
		
		// display is none
		if(val === 0) {
			return 0;
		}
		
		// css3 box-sizing
		if(extra === 'border-box') {
			return val + 'px';
		}
		
		for(var i = 0, a; a = which[i++];) {
			val -= parseFloat( getCSS(el, "border" + a + "Width") ) || 0;
			val -= parseFloat( getCSS(el, "padding" + a) ) || 0;
		}
	
		if(extra === undefined) {
			return val + 'px';
		}
	
		if(extra === 'padding' || extra === "margin" || extra === "border") {
			for(var i = 0, a; a = which[i++];) {
				val += parseFloat( getCSS( el, extra + a + (extra==='border' ? 'Width' : '')) ) || 0;
			}
			return val + 'px';
		}
		
	}
	
	function getWorH(el, wh, extra) {
		switch(extra) {
			case 'border-box' :
			case 'margin' :
			case 'padding':
			case 'border' :
				return getWidthOrHeight(el, wh, extra);
			default :
				return getWidthOrHeight(el, wh);
		}	
	}
	
	// 获取文档宽高
	function getDocWH(name) {
		var doc = document;
		var val = Math.max(
			doc.documentElement["client" + name],
			doc.body["scroll" + name], doc.documentElement["scroll" + name],
			doc.body["offset" + name], doc.documentElement["offset" + name]
		);
		return val;
	}
	
	div = p = a = null;
	
	return {
		
		support : support,
		
		setAttr : function(el, name, val) {
			if(support.setAttr) {
				el.setAttribute(name, val);
				return val;
				
			}else {
				if(special[name]) {
					return special[name].set(el, val);
					
				}else {
					el.setAttribute(fixAttr[name] || name, val);
					return val;
				}
			}
			
		},
		
		getAttr : function(el, name) {
			if(support.setAttr) {
				return el.getAttribute(name);
				
			}else {
				if(special[name]) {
					return special[name].get(el);
					
				}else {
					return el.getAttribute(fixAttr[name] || name);
				}
			}
			
		},
		
		// 布尔类型的使用property，不要使用attribute，如checkbox/radio 的checked属性
		// 类似：autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected
		setProp : function(el, name, val) {
			name = fixAttr[name] || name;
			el[name] = val;
		},
		
		getProp : function(el, name) {
			name = fixAttr[name] || name;
			return  el[name];
		},
		
		setVal : function(el, val) {
			el.value = val;
		},
		
		getVal : function(el) {
			return el.value;
		},
		
		html : function(el, val) {
			this.setProp(el, 'innerHTML', val);
		},
		
		text : function(el, val) {
			this.setProp(el, el.innerText === undefined ? 'innerText' : 'textContent', val);
		},
		
		setCssText : function(el, css) {
			var sty = el.style, str = sty.cssText || '';
			if (!support.cssText) {
				str += ';';
			}
			sty.cssText = str + css;
		},
		
		setCSS : setCSS,
		
		getCSS : getCSS,
		
		setOpacity : function(el, val) {
			if(support.opacity) {
				el.style.opacity = (val === 1 ? '' : '' + val);
			} else {
				el.style.filter = 'alpha(opacity=' + val * 100 + ');';
				el.style.zoom = 1;
			}
		},
		
		getOpacity : function(el, val) {
			if(support.getComputedStyle) {
				style = window.getComputedStyle(el, null);
				opa = style.opacity;
				// http://www.cnblogs.com/snandy/archive/2011/07/27/2118441.html
				if(opa.length>1) {
					opa = opa.substr(0,3);
				}
				return parseFloat(opa);
			}else{
				style = el.currentStyle;
				filter = style.filter;
				return filter.indexOf('opacity=') >= 0 ? parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
			}
		},
		
		setFloat : function(el, val) {
			setCSS(el, strFloat, val);
		},
		
		getFloat : function(el) {
			return getCSS(el, strFloat);
		},
		
		hasClass : hasClass,
		
		addClass : addClass,
		
		removeClass : removeClass,
		
		toggleClass : toggleClass,
		
		replaceClass : replaceClass,
		
		setWidth : function(el, size) {
			if(!isNaN(size)) {
				el.style.width = val + 'px';
			}
		},
		
		getWidth : function(el, extra) {
			return getWorH(el, 'width', extra);
		},
		
		getInnerWidth : function(el) {
			return getWorH(el, 'width', 'border-box');
		},
		
		getOuterWidth : function(el) {
			return getWorH(el, 'width', 'margin');
		},
		
		setHeight : function(el, size) {
			if(!isNaN(size)) {
				el.style.height = val + 'px';
			}
		},
		
		getHeight : function(el, extra) {
			return getWorH(el, 'height', extra);
		},
		
		getInnerHeight : function(el) {
			return getWorH(el, 'height', 'border-box');
		},
		
		getOuterHeight : function(el) {
			return getWorH(el, 'height', 'margin');
		},
		
		setWH : function(el, w, h) {
			var style = el.style;
			if(!isNaN(w) && !isNaN(h)) {
				style.width = w + 'px';
				style.height = h + 'px';
			}
		},
		
		getWH : function(el, extra) {
			return {
				width : this.getWidth(el, extra),
				height : this.getHeight(el, extra)
			};
		},
		
		getStyle : function(el) {
			return el.style;
		},
		
		getRealStyle : getRealStyle,
		
		getDocWidth : function() {
			return getDocWH('Width');
		},
		
		getDocHeight : function() {
			return getDocWH('Height');
		},
		
		getWinWidth : function() {
			return window['innerWidth'] || document.documentElement.clientWidth;
		},
		
		getWinHeight : function() {
			return window['innerHeight'] || document.documentElement.clientHeight;
		},
		
		getViewSize : function() {
			return {
				width : this.getWinWidth(),
				height : this.getWinHeight()
			}
		},
		
		getFullSize : function() {
			return {
				width : this.getDocWidth(),
				height : this.getDocHeight()
			}
		},
		
		getOffset : function(el) {
			var box;
			try {
				box = el.getBoundingClientRect();
			} catch(e) {}
			
			var doc = el.ownerDocument,
				docElem = doc.documentElement;
			var body = doc.body,
				win = doc.defaultView || doc.parentWindow,
				clientTop  = docElem.clientTop  || body.clientTop  || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0,
				scrollTop  = win.pageYOffset || docElem.scrollTop  || body.scrollTop,
				scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
				top  = box.top  + scrollTop  - clientTop,
				left = box.left + scrollLeft - clientLeft;
		
			return { top: top, left: left };
		},
		
		getRefOffset : function(el, refEl) {
			var doc = el.ownerDocument,
				docElem = doc.documentElement,
				body = doc.body,
				refEl = refEl || body,
				x = 0,
				y = 0;
			while(el && el !== refEl && el !== body && el !== docElem) {
				x += el.offsetLeft;
				y += el.offsetTop;
				el = el.offsetParent;
			}
			return {top: x, left: y};
			
		}
		
	};

});


/*******************************************************************************************************
 *
 * 1 使用新API解析JSON，对解析JSON出现可能出现的异常进行了处理
 * 2 超时处理做了修改，先给isTimeout赋值，再调用abort（不采用条件status==0指定超时）
 * 3 XHR创建方式修改（勿重复检测浏览器http://www.cnblogs.com/snandy/archive/2011/05/24/2055048.html）
 * 4 增加scope参数，success可指定上下文
 * 5 接口方式修改，增加get，post方法
 * 
 * 
 *******************************************************************************************************/

/**
 * JavaScript ajax Library v1.0
 * Blog: http://www.cnblogs.com/snandy
 * QQ群: 34580561
 * Date: 2012-01-31
 * 
 * 1,执行基本ajax请求,返回XMLHttpRequest
 * ajax.request(url, {
 *	 async   是否异步 true(默认)
 *	 method  请求方式 POST or GET(默认)
 *	 type	  数据格式 text(默认) or xml or json
 *	 encode  请求的编码 UTF-8(默认)
 *	 timeout 请求超时时间 0(默认)
 *	 data	  请求参数 (字符串或json)
 *	 scope   成功回调执行上下文
 *	 success 请求成功后响应函数 参数为text,json,xml数据
 *	 failure 请求失败后响应函数 参数为xmlHttp, msg, exp
 * });
 * 
 * 2,执行ajax请求,返回纯文本
 * ajax.text(url,{
 *		 ...
 * });
 * 
 * 3,执行ajax请求,返回JSON
 * ajax.json(url,{
 *		 ...
 * });
 * 
 * 4,执行ajax请求,返回XML
 * ajax.xml(url,{
 *		 ...
 * });
 */

define('ajax',[],function() {

	var createXHR = window.XMLHttpRequest ?
		function() {
			try{
				return new window.XMLHttpRequest();
			} catch(e) {
				
			}
		} :
		function() {
			try{
				return new window.ActiveXObject('Microsoft.XMLHTTP');
			} catch(e) {
				
			}
		};
	
	function NOOP(){}
	
	function _serialize(obj) {
		var a = [], key, val;
		for (key in obj) {
			val = obj[key];
			if (val.constructor == Array) {
				for (var i=0,len=val.length;i<len;i++) {
					a.push(key + '=' + encodeURIComponent( val[i]) );
				}
			} else {
				a.push(key + '=' + encodeURIComponent(val));
			}
		}
		
		return a.join('&');
	}
	
	function request(url,opt) {
		
		opt = opt || {};
		var async   = opt.async !== false,
			method  = opt.method	|| 'GET',
			type	= opt.type	    || 'text',
			encode  = opt.encode	|| 'UTF-8',
			timeout = opt.timeout   || 0,
			data	= opt.data,
			scope   = opt.scope,
			success = opt.success   || NOOP,
			failure = opt.failure   || NOOP;
			method  = method.toUpperCase();
			
		if (data && typeof data == 'object') {//对象转换成字符串键值对
			data = _serialize(data);
		}
		if (method == 'GET' && data) {
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
		}
		
		var xhr = createXHR();
		if (!xhr) {
			return;
		}
		
		var isTimeout = false, timer;
		if (async && timeout>0) {
			timer = setTimeout(function() {
				isTimeout = true; // 先给isTimeout赋值，不能先调用abort
				xhr.abort();
			}, timeout);
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (isTimeout) {
					failure(xhr,'request timeout');
				} else {
					_onStateChange(xhr, type, success, failure, scope);
					clearTimeout(timer);
				}
			}else{}
		};
		xhr.open(method,url,async);
		if (method == 'POST') {
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=' + encode);
		}
		xhr.send(data);
		return xhr;
	}
	
	function _onStateChange(xhr, type, success, failure, scope) {
		var s = xhr.status, result;
		if (s>= 200 && s < 300) {
			switch (type) {
				case 'text':
					result = xhr.responseText;
					break;
				case 'json':
					// http://snandy.javaeye.com/blog/615216
					result = function(str) {
						try {
							return JSON.parse(str);
						} catch(e) {
							try {
								return (new Function('return ' + str))();
							} catch(e) {
								failure(xhr,'parse json error',e);
							}
						}
					}(xhr.responseText);
					break;
				case 'xml':
					result = xhr.responseXML;
					break;
			}
			// text, 返回空字符时执行success
			// json, 返回空对象{}时执行suceess，但解析json失败，函数没有返回值时默认返回undefined
			result !== undefined && success.call(scope, result);
			
		} else {
			failure(xhr, xhr.status);
		}
		xhr = null;
	}
	
	return (function(){
		var ajax = {request:request}, types = ['text','json','xml'];
		
		for (var i=0,len=types.length; i<len; i++) {
			ajax[ types[i] ] = function(i) {
				return function(url,opt) {
					opt = opt || {};
					opt.type = types[i];
					return request(url, opt);
				}
			}(i);
		}
		
		return ajax;
	})();
});
/**
 * 
 * 
 * 
 */

define('runner',['env', 'cache', 'selector', 'event', 'json', 'dom', 'ajax'], 
function(env,   cache,   S,          E,       json,   dom,   ajax) {

	//alert(R.$('aa'))
	E.bind(R.$('aa'), 'click', function(e){
		alert(e.originalEvent)
	})

});
