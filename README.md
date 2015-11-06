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
