/**
 * Created by Rodey on 2015/11/5.
 */

var gulp        = require('gulp'),
    htmlInline  = require('../index');

var basePath = process.cwd();
console.log(basePath);

gulp.task('build.html.css', function(){

    gulp.src('inlineCss.html')
        .pipe(htmlInline({
            //basePath: basePath,
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html.style', function(){

    gulp.src('inlineStyle.html')
        .pipe(htmlInline({
            basePath: basePath
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html.js', function(){

    gulp.src('inlineJs.html')
        .pipe(htmlInline({
            minifyJs: true
        }))
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html.script', function(){

    gulp.src('inlineScript.html')
        .pipe(htmlInline())
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html', function(){
    gulp.src('inline.html')
        .pipe(htmlInline({
            basePath: basePath,
            minifyJs: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build.html', 'build.html.css', 'build.html.style', 'build.html.js', 'build.html.script']);