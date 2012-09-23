/**
 * writing modular JavaScript with bootjs
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


//If modules are built into boot.js, then need to make sure dependencies are traced.
//Use a setTimeout in the browser world, to allow all the modules to register
setTimeout(function(){
	boot.setGlobalQueue();
	boot.resume();
}, 0);

})(this);
