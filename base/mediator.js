/**
 * http://arguments.callee.info/2009/05/18/javascript-design-patterns--mediator/
 */

Mediator = function() {
	
	var debug = function() {
		// console.log or air.trace as desired
	};
	
	var components = {};
	
	var broadcast = function(event, args, source) {
		var e = event || false;
		var a = args || [];
		if (!e) {
			return;
		}
		//debug(["Mediator received", e, a].join(' '));
		for (var c in components) {
			if (typeof components[c]["on" + e] == "function") {
				try {
					//debug("Mediator calling " + e + " on " + c);
					var s = source || components[c];
					components[c]["on" + e].apply(s, a);
				} catch (err) {
					debug(["Mediator error.", e, a, s, err].join(' '));
				}
			}
		}
	};
	
	var addComponent = function(name, component, replaceDuplicate) {
		if (name in components) {
			if (replaceDuplicate) {
				removeComponent(name);
			} else {
				throw new Error('Mediator name conflict: ' + name);
			}
		}
		components[name] = component;
	};
	
	var removeComponent = function(name) {
		if (name in components) {
			delete components[name];
		}
	};
	
	var getComponent = function(name) {
		return components[name] || false;
	};
	
	var contains = function(name) {
		return (name in components);
	};
	
	return {
		name	  : "Mediator",
		broadcast : broadcast,
		add	   : addComponent,
		rem	   : removeComponent,
		get	   : getComponent,
		has	   : contains
	};
}();

Mediator.add('TestObject', function() {
	var someNumber = 0; // sample variable
	var someString = 'another sample variable';
	return {
		onInitialize: function() {
			// this.name is automatically assigned by the Mediator
			alert(this.name + " initialized.");
		},
		onFakeEvent: function() {
			someNumber++;
			alert("Handled " + someNumber + " times!");
		},
		onSetString: function(str) {
			someString = str;
			alert('Assigned ' + someString);
		}
	}
}());
Mediator.broadcast("Initialize");				 // alerts "TestObject initialized"
Mediator.broadcast('FakeEvent');				  // alerts "Handled 1 times!" (I know, bad grammar)
Mediator.broadcast('SetString', ['test string']); // alerts "Assigned test string"
Mediator.broadcast('FakeEvent');				  // alerts "Handled 2 times!"
Mediator.broadcast('SessionStart');			   // this call is safely ignored
Mediator.broadcast('Translate', ['this is also safely ignored']);

