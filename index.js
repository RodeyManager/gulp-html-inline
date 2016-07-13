/**
 * Created by Rodey on 2015/11/5.
 */

var fs          = require('fs'),
    path        = require('path'),
    through2    = require('through2'),
    uglifycss   = require('uglifycss'),
    jsmin       = require('jsmin2'),
    crypto      = require('crypto'),
    url         = require('url'),
    PluginError = require('gulp-util').PluginError;

var PLUGIN_NAME = 'gulp-html-inline';

var linkRegx    = new RegExp('<link\\s+[\\s\\S]*?>[\\s\\S]*?<*\\/*>*', 'gi'),
    hrefRegx    = new RegExp('\\s*(href)="+([\\s\\S]*?)"'),
    styleRegx   = new RegExp('<style\\s*[\\s\\S]*?>[\\s\\S]*?<\\/style>', 'gi'),
    jsRegx      = new RegExp('<script\\s+[\\s\\S]*?>[\\s\\S]*?<\\/script>', 'gi'),
    scriptRegx  = new RegExp('<script\\s*(^|src)*?>[\\s\\S]*?<\\/script>', 'gi'),
    srcRegx     = new RegExp('\\s*(src)="+([\\s\\S]*?)"');

var joint = function(tag, content, attrstr){
    return '<'+ tag + attrstr +'>' + content + '</'+ tag +'>';
};

var isLocal = function(href){
    return href && href.slice(0, 2) !== '//' && !url.parse(href).hostname;
};

//压缩内联css代码 | js脚本
var miniInline = function(content, type, options){
    var isMinifyJs  = options.minifyJs,
        code        = content;

    if('css' === type){
        code = uglifycss.processString(content, options);
    }
    else if('js' === type){
        if(!isMinifyJs) return content;
        code = jsmin(content, options).code.replace(/(\n|\t)*/gi, '');
    }
    return code;
};

//replace callback src | href
var replaceCallback = function(sourceRegx, match, parentFile, type, options){

    var ms = sourceRegx.exec(match),
        code = '',
        content = '',
        attrString = ' charset="utf-8" ',
        isMinifyJs  = options.minifyJs,
        basePath    = options.basePath,
        tohashRegx   = options.tohashRegx;

    if(!ms || !ms[2] || '' === ms[2]){
        return miniInline(match, type, options);
    }
    var href = ms[2] || '';

    if(!isLocal(href))      return href;
    if(/^\?/i.test(href))   return '';

    //在url地址上加上 _toInline 字段就可以直接嵌入网页
    //如果href上面不存在 _toInline 字符或者options中指定的toInlne字符
    if(href.search(options.toinlineRegx) === -1){

        var hash = '';
        //如果存在 _toHash 字符
        if(href.search(tohashRegx) !== -1){
            content = _getContents();
            if(content != null){
                hash = getFileHash(content, 8);
            }else{
                hash = getFileHash(Date.now() + '_' + Math.random() * 100000, 8);
            }
            return match.replace(tohashRegx, function(mh, $1){
                return $1 + options.queryKey +'=' + hash;
            });
        }
        return match;
    }

    content = _getContents();
    if(content == null) return match;

    if('css' === type){
        code = uglifycss.processString(content, options);
        code = joint('style', code, attrString + 'type="text/css"');
    }
    else if('js' === type){
        if(!isMinifyJs)
            return joint('script', '\n\t' + content + '\n\t', attrString + 'type="text/javascript" defer');
        code = jsmin(content, options).code.replace(/(\n|\t)*/gi, '');
        code = joint('script', code, attrString + 'type="text/javascript" defer');
    }

    return code;

    function _getContents(){
        var tempFilePath;
        if(basePath && '' !== basePath){
            tempFilePath = path.resolve(basePath, href);
        }else{
            tempFilePath = path.resolve(path.dirname(parentFile), href);
        }
        tempFilePath = tempFilePath.replace(/\?[^\?]*/gi, '');
        return getFileContent(tempFilePath);
    }
};

//根据标签类型获取内容并压缩
var execture = function(file, options){

    var parentFile = path.normalize(file.path);
    var fileContents = file.contents.toString('utf8');
    if(typeof fileContents === 'undefined'){
        fileContents = getFileContent(file.path);
    }

    //获取单个标签的替换内容（已压缩）
    var content = fileContents
        .replace(styleRegx, function($1){

            //like:
            // <style ignore>
            //  #app{
            //      width: 80%;
            //      padding: 10px;
            //  }
            // </style>
            //console.log($1);
            return miniInline($1, 'css', options);

        }).replace(scriptRegx, function($1){
            //like:
            // <script ignore>
            //      var a = 0,
            //          b = 0;
            //      var arr = [];
            //      arr.push(a);
            //      arr.push(b);
            // </script>
            //console.log($1);
            return miniInline($1, 'js', options);
        }).replace(linkRegx, function($1){

            //like: <link rel="stylesheet" href="assets/css/a.css" />
            return replaceCallback(hrefRegx, $1, parentFile, 'css', options);

        }).replace(jsRegx, function($1){

            //like: <script src="assets/js/a.js"></script>
            //console.log($1);
            return replaceCallback(srcRegx, $1, parentFile, 'js', options);

        });

    return content;
};

//获取文件内容
var getFileContent = function(file){
    if(!fs.existsSync(file)) return null;
    return fs.readFileSync(file, { encoding: 'utf8' });
    //file.contents = new Buffer(uglifycss.processString(fileContent, options));
};

var resetOptions = function(options){
    options['basePath']     = options['basePath'] || '';
    options['queryKey']     = options['queryKey'] || '_rvc';
    options['toInline']     = options['toInline'] || '_toInline';
    options['toHash']       = options['toHash'] || '_toHash';
    options['hashSize']     = options['hashSize'] || 8;
    options['toinlineRegx'] = new RegExp('(\\?|\\&)+' + options['toInline'], 'gi');
    options['tohashRegx']   = new RegExp('(\\?|\\&)+' + options['toHash'], 'gi');
    return options;
};

//获取压缩后的内容
var getContent = function(file, options){
    return execture(file, resetOptions(options));
};

//获取文件hash值
var getFileHash = function(fileContent, size){
    var fileHash = crypto.createHash('md5').update(fileContent).digest('hex').slice(0, size || 10);
    return fileHash;
};

//将压缩后的内容替换到html中
var inline = function(options){
    options = options || {};
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