/**
 * Created by Rodey on 2015/11/5.
 */

var fs          = require('fs'),
    path        = require('path'),
    uglifyjs    = require('uglify-js'),
    jsmin       = require('jsmin2');

var getFileContent = function(file){
    if(!fs.existsSync(file)) throw new Error('File not find: ' + file);
    var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    return fileContent;
};

var src = 'assets/js/b.js';

var extname = path.extname(path.parse(src).name);

//console.log(extname.match(/(.js|.css)/gi)[0]);
//console.log(getFileContent(src));
console.log(jsmin(getFileContent(src)).code);

