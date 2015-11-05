/**
 * Created by Rodey on 2015/11/5.
 */

var fs          = require('fs'),
    path        = require('path'),
    through2    = require('through2'),
    Stream      = require('stream'),
    cheerio     = require('cheerio'),
    uglifycss   = require('uglifycss'),
    PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-inline';

var linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    scriptRegx  = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

var getFileContent = function(file){
    if(!fs.existsSync(file)) throw new Error('File not find: ' + file);
    var fileContent = fs.readFileSync(file, { encoding: 'utf8' });
    return fileContent;
    //file.contents = new Buffer(uglifycss.processString(fileContent, options));
};

var getContent = function(file){
    var parentFile = path.normalize(file.path);
    //console.log(parentFile);
    //console.dir(file.contents.toString());
    var fileContents = file.contents.toString('utf8');
    var $ = cheerio.load(fileContents);
    var content = fileContents.replace(linkRegx, function($1){
        var ms = hrefRegx.exec($1),
            attr = ms[1] || '',
            href = ms[2] || '';
        var file = path.normalize(path.dirname(parentFile) + path.sep + href);
        if(/ignore/gi.test($1))
            return $1;
        console.log($1);
        return '<style>' + uglifycss.processString(getFileContent(file)) + '</style>';
    });
    return content;
};

var inlineCss = function(options){
    var ignore = options && !!options.ignore || false;
    var basePath = options && options.basePath;

    return through2.obj(function(file, enc, next){

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Stream content is not supported'));
            return next(null, file);
        }
        if (file.isBuffer()) {
            try {
                var content = getContent(file);
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

module.exports = inlineCss;