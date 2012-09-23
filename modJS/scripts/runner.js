/**
 * 
 * 
 * 
 */

define(['env', 'cache', 'selector', 'event', 'json', 'dom', 'ajax'], 
function(env,   cache,   S,          E,       json,   dom,   ajax) {

	//alert(R.$('aa'))
	E.bind(R.$('aa'), 'click', function(e){
		alert(e.originalEvent)
	})

});
