/**
 * Created by Rodey on 2015/11/5.
 */

var gulp    = require('gulp'),
    inline  = require('../index');

gulp.task('build.html', function(){

    gulp.src('inlineCss.html')
        .pipe(inline({ ignore: true }))
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['build.html']);