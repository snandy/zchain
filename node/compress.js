var build  = require('./build');

var intro = function() {
	var date = new Date,
		h = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds();
	
	h = h<10 ? '0'+h : h;
	m = m<10 ? '0'+m : m;
	s = s<10 ? '0'+s : s;
	
	var str = 	'/**\n' +
				' * Author: @snandy\n' +
				' * Date: ' + date.getFullYear() + '-' + 
							  (date.getMonth()+1) + '-' + 
							  date.getDate() + ' ' +
							  h + ':' +
							  m + ':' +
							  s + '\n' +
				' */\n';
	
	return str;
}();

// mkFullDir('a/b/c/d.js')
// writeFile('merge.js', compress(merge('ajax')))

var source = 'a.js';
var target = 'x.js';

var source = 'E:/work/base/jstest/jquery-1.7.2.js';
var target = 'E:/work/base/jstest/xx.js';


// var str = build.merge('../base');
// var str = build.one(source);
build.dir('../modJS', '../mod-build');
// build.write('xx.js', str);

var util = require('util');
// console.log(util)
// console.log('dssdsds');
// util.puts('dssdsds');
