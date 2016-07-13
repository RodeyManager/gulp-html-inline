# gulp-html-inline

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
![cise](http://cise.alibaba-inc.com/task/69703/status.svg)

[npm-image]: https://img.shields.io/npm/v/gulp-html-inline.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gulp-html-inline
[downloads-image]: http://img.shields.io/npm/dm/gulp-html-inline.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/gulp-html-inline

combo and minify `css` and `js` to html. no matter the file is online or not.

## Features

+ css、js自动内联
+ css、js可选择压缩
+ css、js文件的url上query为 "_toinline"，即表示内联
+ css、js文件的url上query为 "_tohash"，即表示获取文件MD5值作为缓存版本号

## Usage

```javascript
var gulp = require('gulp');
var htmlInline = require('gulp-html-inline');

gulp.src('inline.html')
    .pipe(htmlInline({ minifyJs: true }))
    .pipe(gulp.dest('dist'));
```

## Html
```html
    <!-- link tag -->
    <link rel="stylesheet" href="assets/css/a.css?_toinline"/>
    <link rel="stylesheet" href="assets/css/b.css?_tohash"/>

    <!-- style tag -->
    <style>
        #content{
            padding: 20px;
            border: 1px solid rgba(0,0,0,.3);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
    </style>

    <!-- script tag -->
    <script src="assets/js/a.js?_toinline"></script>
    <script src="assets/js/b.js?_toinline"></script>
    <script src="assets/js/c.js?_tohash" ></script>
    <script>
        var a = 0,
            b = 1;
        var arr = [];
        arr.push(a);
        arr.push(b);
    </script>

```
## Options
```javascript
gulp.src('./src/*.html')
        .pipe(htmlInline({
            queryKey: '_rvc',       //指定需要内联的url后面必须带缓存query key， 默认 _rvc
            toInline: '_toinline',  //指定需要内联的url后面必须带的query key， 默认 _toinline
            toHash: '_tohash',      //指定需要内联的url后面必须带的query key， 默认 _toinline
            hashSize: 8,            //指定hash值长度，默认 8
            minifyJs: true          //选择是否压缩js,
            //资源文件路径
            basePath: '../'
        }))
// ...
```

#License
ISC
