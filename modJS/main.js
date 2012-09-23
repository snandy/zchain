define(['event', 'selector'], function(E, S) {
	var el = S.$('sohu');
	E.bind(el, 'keypress', function() {
			require(['core/suggest'], function(Suggest){
				var sohuSuggest = new Suggest({
					input: document.getElementById('sohu'),
					data: ['sohu.com','sogou.com','chinaren.com','vip.sohu.com','sohu.net','2008.sohu.com','sms.sohu.com']
				});
			})
	});
	
});
