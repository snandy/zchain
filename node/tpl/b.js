var fs  = require('fs')
var htmlCompress = require('html-compress')

function readFile(file) {
    return fs.readFileSync(file, 'utf8')
}

var html = readFile('b.html')
// console.log(html.replace('\n', ''))
html = htmlCompress.compress(html, {})
console.log(html.replace(/\n/g, ''))