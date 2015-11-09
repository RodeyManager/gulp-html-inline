/**
 * Created by Rodey on 2015/11/5.
 */

var fs          = require('fs'),
    path        = require('path'),
    uglifycss   = require('uglifycss'),
    jsmin       = require('jsmin2');

var linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    styleRegx   = new RegExp('<style\\s*[\\s\\S]*?>[\\s\\S]*?<\\/style>', 'gi'),
    scriptRegx  = new RegExp('<script\\s*[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

var getFileContent = function(file){
    if(!fs.existsSync(file)) throw new Error('File not find: ' + file);
    var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    return fileContent;
};

var src = 'assets/js/b.js',
    html = 'inline.html';

var extname = path.extname(path.parse(src).name);

//console.log(extname.match(/(.js|.css)/gi)[0]);
//console.log(getFileContent(src));
//console.log(jsmin(getFileContent(src)).code);

var content = getFileContent(html);
content = content.replace(styleRegx, function($1){
    var ms = $1.match(/<[\s\S]*?<*\/*[\s\S]*?>/gi);
    console.log(ms);
    if(ms && ms[0].indexOf('ignore') !== -1)
        return $1;
    var mini = uglifycss.processString($1);
    return mini;
}).replace(linkRegx, function($1){
    var ms = $1.match(/<(link|style)*?<*\/*[\s\S]*?>/gi);
    //console.log(ms);
});
//console.log(content);

/*var content = getFileContent(html);
 content = content.replace(scriptRegx, function($1){

 var ms = $1.match(/<script\s*[\s\S]*?>/gi);
 if(ms && ms[0].indexOf('ignore') !== -1)
 return $1;
 var mini = jsmin($1).code;
 console.log(mini);
 return mini;
 });

 console.log(content);*/

