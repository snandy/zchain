var fs  = require('fs'); 
var jsp = require("./uglifyJS/uglify-js").parser;
var pro = require("./uglifyJS/uglify-js").uglify;

function readFile(file) {
	return fs.readFileSync(file, 'utf8');
}

function writeFile(fname, str) {
	fs.writeFileSync(fname, str, 'utf8');
}

function exists(path) {
	if (path.charAt(path.length - 1) === '/' &&
		path.charAt(path.length - 2) !== ':') {
		path = path.substring(0, path.length - 1);
	}
	try {
		fs.statSync(path);
		return true;
	} catch (e) {
		return false;
	}
}

function isFile(path) {
	return fs.statSync(path).isFile();
}

function isDirectory(path) {
	return fs.statSync(path).isDirectory();
}

function renameFile(from, to) {
	return fs.renameSync(from, to);
}

function endsWith(str, suffix) {
	var l = str.length - suffix.length;
	return l >= 0 && str.indexOf(suffix, l) == l;
}

function mkDir(dir) {
	if (!exists(dir)) {
		fs.mkdirSync(dir, 511);
	}
}

function mkFullDir(dir) {
	var parts = dir.split('/'),
		currDir = '',
		first = true;

	parts.forEach(function (part) {
		//First part may be empty string if path starts with a slash.
		currDir += part + '/';
		first = false;

		if (part) {
			mkDir(currDir);
		}
	});
}

function rmDir(path) {
	var folders = [path];
	
	// 自执行递归调用
	~function rmFile(path) {
		var dir = fs.readdirSync(path);
		dir.forEach(function(file) {
			var fullPath = path + '/' + file;
			if ( isFile(fullPath) ) {
				fs.unlinkSync(fullPath); //直接删除文件
			} else {
				folders.push(fullPath);
				rmFile(fullPath);
			}
		});
	}(path);
	
	// rmFile(path);
	// console.log(folders)
	// 需逆序，否则删除外层文件夹会报错
	folders.reverse();
	
	folders.forEach(function(folder) {
		fs.rmdirSync(folder)
	});
}

/**
 * 保留版权信息
 * @param {string} fileContents
 * 
 */
function preserveLicenseComments(fileContents) {
	var match,
		comment = '', 
		licenseContents = '',
		licenseCommentRegExp = /\/\*[\s\S]*?\*\//g;
		
	//Pull out any license comments for prepending after optimization.
	licenseCommentRegExp.lastIndex = 0;
	while ((match = licenseCommentRegExp.exec(fileContents))) {
	    comment = match[0];
	    //Only keep the comments if they are license comments.
	    if (comment.indexOf('@license') !== -1 ||
	        comment.indexOf('/*!') === 0) {
	        licenseContents += comment + '\n';
	    }
	}
	
	return licenseContents || '';
}
/**
 * 基本压缩 去注释，换行，回车
 * https://github.com/mishoo/UglifyJS
 * 
 * @param {string} origCode
 * @param {object} conf
 * 
 * conf
 * strict: true/false 严格检查语句结尾分号，没有分号则抛异常。默认false，不检查。
 * liftVars: true/false 删除没有使用的变量和形参；删除内部未使用的函数；多个声明赋值语句以逗号分割；默认true。
 * mangle: true/false 变量名、函数名替换成精简的。默认为true。
 * 		//以下设置前提是mangle为true
 * 		mangleTopLevel: true/false 是否替换全局变量。默认为false。
 * 		mangleExcept: Array 不被替换的变量名。默认为空。['fn1']，将不会替换变量“fn1”。
 * 		mangleDefines: Object 设置想要替换的变量名。默认为空。{fn1: 'f1'}将会把代码中的变量“fn1”固定的替换成“f1”。
 * 
 * squeeze: true/false 进一步的压缩代码。默认true。
 * 		// 以下设置前提示squeeze为true
 * 		makeSeqs: true/false 同一个闭包内的连续语句以逗号分割。默认true。
 * 		deadCode: true/false 删除无法执行的代码 。默认true 。
 * 
 */
function compress(origCode, conf) {
	
	var ast, finalCode, licenseContents, mangleConfig, squeezeConfig;
	var conf             = conf || {};
	var strictSemicolons = conf.strict;
	var liftVars         = conf.liftVars !== false;
	var mangle           = conf.mangle !== false;
	var mangleTopLevel   = conf.mangleTopLevel;
	var mangleExcept     = conf.mangleExcept;
	var mangleDefines    = conf.mangleDefines;
	var squeeze          = conf.squeeze !== false;
	var makeSeqs         = conf.makeSeqs !== false;
	var deadCode         = conf.deadCode !== false;
	
	mangleConfig = {};
	squeezeConfig = {
		make_seqs: makeSeqs,
		dead_code: deadCode
	};
	
	licenseContents = preserveLicenseComments(origCode);
	
	// 基本压缩 去注释，换行，回车
	ast = jsp.parse(origCode, strictSemicolons);
	
	if (liftVars) {
		ast = pro.ast_lift_variables(ast, mangleConfig);
	}
	
	if (mangle) {
		if (mangleTopLevel) {
			mangleConfig.toplevel = true;
		}
		if (mangleExcept  && mangleExcept.constructor===Array) {
			mangleConfig.except = mangleExcept;
		}
		// 未理解该参数
		if (mangleDefines && typeof mangleDefines==='object') {
			mangleConfig.defines = mangleDefines;
		}
		ast = pro.ast_mangle(ast, mangleConfig);
	}
	
	if (squeeze) {
		ast = pro.ast_squeeze(ast, squeezeConfig);
	}
	finalCode = licenseContents + pro.gen_code(ast);
	
	return finalCode;
}

/**
 * 压缩单个文件
 * @param {string} srcFile
 * @param {string} destFile
 * @returns {string}
 * buildOne('../modJS/scripts/es5.js', 'es5.js');
 * 
 */
function buildOne(srcFile, destFile) {
	var orig, code;
	if ( !isFile(srcFile) || !endsWith(srcFile, '.js') ) {
		return '';
	}
	destFile = destFile || srcFile.replace(/.js$/, '') + '-min.js';
	orig     = readFile(srcFile);
	code     = compress(orig);
	fs.writeFile(destFile, code);
	return code;
}

/**
 * 压缩某目录下的所有JS文件到指定目录，输出目录层次与源目录一致
 * @param {string} srcPath
 * @param {string} destPath
 * 
 */
function buildDir(srcPath, destPath) {
	var src, dest;
	var dir     = fs.readdirSync(srcPath);
	var newpath = destPath || srcPath + '-built';
	fs.mkdirSync(newpath);
	dir.forEach(function(file) {
		src  = srcPath + '/' + file;
		dest = newpath + '/' + file;
		if ( isFile(src) ) {
			buildOne(src, dest);
		} else if( isDirectory(src) ) {
			buildDir(src, dest);
		}
	});
}

/**
 * 读取指定目录中JS文件，拼凑成一个字符串返回
 * @param {string} path
 * @param {boolean} mergeSub
 * @returns {string}
 * 
 */
function merge(path, mergeSub) {
	var directory = fs.readdirSync(path);
	
	var str = directory.map(function(file) {
		var realPath = path + '/' + file;
		if ( isFile(realPath) && endsWith(realPath, '.js') ) {
			return readFile(realPath);
			
		} else if ( isDirectory(realPath) ) {
			if (mergeSub) {
				return merge(realPath, mergeSub);
			} else {
				return '';
			}
		}
	}).join('');
	
	return str;
}

/**
 * 合并指定目录下的所有JS文件到指定文件
 * @param {string} srcPath
 * @param {string} destFile
 * @param {boolean} mergeSub
 * @returns {string}
 * 
 */
function mergeToOne(srcPath, destFile, mergeSub) {
	var destFile = destFile || srcPath + '-merge.js';
	var code     = merge(srcPath, mergeSub);
	writeFile(destFile, code);
	return code;
}

exports.read  = readFile;
exports.write = writeFile;
exports.merge = mergeToOne;
exports.one   = buildOne;
exports.dir   = buildDir;
exports.rmdir = rmDir;

rmDir('../modJS2');


