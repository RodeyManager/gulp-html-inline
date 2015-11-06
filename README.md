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
+ 支持过滤[ 在link或者script标签上添加ignore属性即可 ]

## Usage

```javascript
var gulp = require('gulp');
var htmlInline = require('gulp-html-inline');

gulp.src('inline.html')
    .pipe(htmlInline({ minifyCss: false, minifyJs: true }))
    .pipe(gulp.dest('dist'));
```

## Html
```html
    <!-- link tag -->
    <link rel="stylesheet" href="assets/css/a.css"/>
    <link rel="stylesheet" href="assets/css/b.css" ignore/>

    <!-- style tag -->
    <style ignore>
        #content{
            padding: 20px;
            border: 1px solid rgba(0,0,0,.3);
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
        }
    </style>

    <!-- script tag -->
    <script src="assets/js/a.js"></script>
    <script src="assets/js/b.js"></script>
    <script src="assets/js/c.js" ignore></script>
    <script>
        var a = 0,
                b = 1;
        var arr = [];
        arr.push(a);
        arr.push(b);
    </script>

```
```html
<!-- builder: main.min.js -->
<script src="assets/js/a.js"></script>
<script src="assets/js/b.js"></script>
<script src="assets/js/c.js"></script>
<!-- builder end -->
```

## Options
```javascript
gulp.src('./src/*.html')
        .pipe(htmlInline({
            minifyCss: true, // 选择是否压缩css
            minifyJs: true  // 选择是否压缩js
        }))
// ...
```

#License
ISC
