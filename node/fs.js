var fs = require('fs');


// delete a file with asynchronous
// fs.unlink('a.txt', function(ex) {
	// console.log(ex)
// });

// delete a.txt with synchronous
// fs.unlinkSync('a.txt');


// fs.renameSync('a.txt', 'aa.t');

// var txt1 = fs.readFileSync('$.js', 'utf8');
// var txt2 = fs.readFileSync('env.js', 'utf8');
// fs.writeFileSync('all.js', txt1+txt2, 'utf8');

// fs.mkdirSync('json');

// var str = fs.readdirSync('.');
// console.log(str)

fs.readdir('../modJS', function(ex, files) {
	console.log(files);
});

// var path = fs.realpathSync('..');
// console.log(path);

// var dir = fs.readdirSync('.');
// var all = dir.map(function(k, i) {
	// return fs.readFileSync(k, 'utf8');
// 	
// });
// fs.writeFileSync('all.txt', all.join(''), 'utf8');

// var obj = fs.statSync('ajax');
// console.log(obj.isDirectory())

// console.log(process.platform)

// var txt = fs.readFileSync('10w.txt', 'utf8')
// console.log(txt.length)

function a() {
	console.log(this);
}
// a.call(undefined)
// console.log(global)

var foo = {bar: 'foobar'};
// console.log('Hello %s, this is my object: %j', 'World', foo);
