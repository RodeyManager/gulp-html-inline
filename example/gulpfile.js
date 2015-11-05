/**
 * Created by Rodey on 2015/11/5.
 */

var gulp        = require('gulp'),
    htmlInline  = require('../index');

gulp.task('build.html.css', function(){

    gulp.src('inlineCss.html')
        .pipe(htmlInline())
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html.js', function(){

    gulp.src('inlineScript.html')
        .pipe(htmlInline())
        .pipe(gulp.dest('dist'));

});

gulp.task('build.html', function(){
    gulp.src('inline.html')
        .pipe(htmlInline({ minifyCss: false, minifyJs: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build.html']);