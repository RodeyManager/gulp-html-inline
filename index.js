/**
 * Created by Rodey on 2015/11/5.
 */

var fs          = require('fs'),
    path        = require('path'),
    through2    = require('through2'),
    Stream      = require('stream'),
    cheerio     = require('cheerio'),
    uglifycss   = require('uglifycss'),
    jsmin       = require('jsmin2'),
    PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-inline';

var linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    scriptRegx  = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

//replace callback
var replaceCallback = function(sourceRegx, match, parentFile, type, options){
    var ms = sourceRegx.exec(match), code = '',
        isMinifyCss = options && !!options.minifyCss,
        isMinifyJs  = options && !!options.minifyJs,
        attr = ms[1] || '',
        href = ms[2] || '',
        sourceFile = path.normalize(path.dirname(parentFile) + path.sep + href),
        content = getFileContent(sourceFile);

    if(/ignore/gi.test(match))
        return match;
    if(type === 'css'){
        if(!isMinifyCss) return content;
        code = uglifycss.processString(content, options);
        return '<style>' + code + '</style>'
    }

    if(type === 'js' && isMinifyJs){
        if(!isMinifyJs) return content;
        code = jsmin(content, options).code.replace(/\n*\t*/gi, '');
        return '<script>' + code + '</script>';
    }

};

//根据标签类型获取内容并压缩
var execture = function(file, options){
    //console.log(options);
    var parentFile = path.normalize(file.path);
    var fileContents = file.contents.toString('utf8');
    //获取单个标签的替换内容（已压缩）
    var content = fileContents.replace(linkRegx, function($1){

        return replaceCallback(hrefRegx, $1, parentFile, 'css', options);
    }).replace(scriptRegx, function($1){

        return replaceCallback(srcRegx, $1, parentFile, 'js', options);
    });
    return content;
};

//获取文件内容
var getFileContent = function(file){
    if(!fs.existsSync(file)) throw new Error('File not find: ' + file);
    var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    return fileContent;
    //file.contents = new Buffer(uglifycss.processString(fileContent, options));
};

//获取压缩后的内容
var getContent = function(file, options){

    var content = execture(file, options);
    return content;
};

//将压缩后的内容替换到html中
var inline = function(options){
    var options = options || {},
        basePath = options.basePath;
    //是否压缩css, 默认压缩
    options.minifyCss = 'undefined' === typeof(options.minifyCss) ? true : options.minifyCss;
    //是否压缩js, 默认压缩
    options.minifyJs = 'undefined' === typeof(options.minifyJs) ? true : options.minifyJs;

    return through2.obj(function(file, enc, next){

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }
        if (file.isBuffer()) {
            try {
                var content = getContent(file, options);
                //console.log(content);
                file.contents = new Buffer(content);
            }
            catch (err) {
                this.emit('error', new PluginError(PLUGIN_NAME, ''));
            }
        }
        this.push(file);
        return next();


    });

};

module.exports = inline;