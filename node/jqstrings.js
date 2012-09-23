var words = require('./words.js');

var rObj = {
	string: [/\'string\'/g, /\"string\"/g],
	number: [/\'number\'/g, /\"number\"/g],
	'boolean': [/\'boolean\'/g, /\"boolean\"/g],
	object: [/\'object\'/g, /\"object\"/g],
	'undefined': [/\'undefined\'/g, /\"undefined\"/g],
	'function': [/\'function\'/g, /\"function\"/g],
	'array': [/\'array\'/g, /\"array\"/g],
	'ready': [/\'ready\'/g, /\"ready\"/g],
	input: [/\'input\'/g, /\"input\"/g],
	type: [/\'type\'/g, /\"type\"/g],
	text: [/\'text\'/g, /\"text\"/g],
	radio: [/\'radio\'/g, /\"radio\"/g],
	checkbox: [/\'checkbox\'/g, /\"checkbox\"/g],
	password: [/\'password\'/g, /\"password\"/g],
	submit: [/\'submit\'/g, /\"submit\"/g],
	button: [/\'button\'/g, /\"button\"/g],
	id: [/\'id\'/g, /\"id\"/g],
	div: [/\'div\'/g, /\"div\"/g],
	body: [/\'body\'/g, /\"body\"/g],
	html: [/\'html\'/g, /\"html\"/g],
	HTML: [/\'HTML\'/g, /\"HTML\"/g],
	parentNode: [/\'parentNode\'/g, /\"parentNode\"/g],
	nextSibling: [/\'nextSibling\'/g, /\"nextSibling\"/g],
	iframe: [/\'iframe\'/g, /\"iframe\"/g],
	before: [/\'before\'/g, /\"before\"/g],
	after: [/\'after\'/g, /\"after\"/g],
	script: [/\'script\'/g, /\"script\"/g],
	width: [/\'width\'/g, /\"width\"/g],
	height: [/\'height\'/g, /\"height\"/g],
	top: [/\'top\'/g, /\"top\"/g],
	left: [/\'left\'/g, /\"left\"/g],
	absolute: [/\'absolute\'/g, /\"absolute\"/g],
	relative: [/\'relative\'/g, /\"relative\"/g],
	'static': [/\'static\'/g, /\"static\"/g],
	fixed: [/\'fixed\'/g, /\"fixed\"/g],
	href: [/\'href\'/g, /\"href\"/g],
	border: [/\'border\'/g, /\"border\"/g],
	margin: [/\'margin\'/g, /\"margin\"/g],
	marginTop: [/\'marginTop\'/g, /\"marginTop\"/g],
	marginBottom: [/\'marginBottom\'/g, /\"marginBottom\"/g],
	marginLeft: [/\'marginLeft\'/g, /\"marginLeft\"/g],
	marginRight: [/\'marginRight\'/g, /\"marginRight\"/g],
	padding: [/\'padding\'/g, /\"padding\"/g],
	paddingTop: [/\'paddingTop\'/g, /\"paddingTop\"/g],
	paddingLeft: [/\'paddingLeft\'/g, /\"paddingLeft\"/g],
	paddingRight: [/\'paddingRight\'/g, /\"paddingRight\"/g],
	display: [/\'display\'/g, /\"display\"/g],
	olddisplay: [/\'olddisplay\'/g, /\"olddisplay\"/g],
	none: [/\'none\'/g, /\"none\"/g],
	hidden: [/\'hidden\'/g, /\"hidden\"/g],
	inline: [/\'inline\'/g, /\"inline\"/g],
	opacity: [/\'opacity\'/g, /\"opacity\"/g],
	show: [/\'show\'/g, /\"show\"/g],
	hide: [/\'hide\'/g, /\"hide\"/g],
	toggle: [/\'toggle\'/g, /\"toggle\"/g],
	json: [/\'json\'/g, /\"json\"/g],
	success: [/\'success\'/g, /\"success\"/g],
	fxshow: [/\'fxshow\'/g, /\"fxshow\"/g],
	fx: [/\'fx\'/g, /\"fx\"/g],
	'.run': [/\'.run\'/g, /\".run\"/g],
	'http:': [/\'http:\'/g, /\"http:\"/g],
	error: [/\'error\'/g, /\"error\"/g],
	abort: [/\'abort\'/g, /\"abort\"/g],
	GET: [/\'GET\'/g, /\"GET\"/g],
	POST: [/\'POST\'/g, /\"POST\"/g],
	get: [/\'get\'/g, /\"get\"/g],
	filter: [/\'filter\'/g, /\"filter\"/g],
	px: [/\'px\'/g, /\"px\"/g]
};

var keywords = ['\"string\"', '\"number\"', '\"boolean\"', '\"undefined\"', 'jQuery'];
var file = 'e:/work/base/jstest/jQuery-1.7.2.js';

words.count(rObj, file, function(result) {
	result.forEach(function(obj) {
		console.log(obj.type + ': ' + obj.num)
	});
}, 1);


