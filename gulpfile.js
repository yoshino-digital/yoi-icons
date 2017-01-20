var gulp   = require('gulp');
var svgmin = require('gulp-svgmin');
 
gulp.task('compress', function() {
    
    /**
     *  Compress SVG files.
     */
 
    gulp.src('./generator/svg/*')
        .pipe(svgmin({
            plugins: [{ removeDoctype: true }, { removeComments: true }]
        }))
        .pipe(gulp.dest('./generator/svg'));

});