'use strict';

// require modules
// ===============

var gulp        = require('gulp');
var del         = require('del');
var replace     = require('gulp-batch-replace');
var replaceExt  = require('gulp-ext-replace');
var runsequence = require('run-sequence');
var svgmin      = require('gulp-svgmin');

// tasks
// =====

gulp.task('default', function() {

    /**
    *  Default gulp task
    */

    runsequence('clean', 'compress', 'format');

});

gulp.task('clean', function() {

    /**
    *  Delete all files from ./generator/svg
    */

    return del('./generator/svg/**/*');

});

gulp.task('compress', function() {
    
    /**
     *  Compress SVG files. Move one copy of files to ./dist/svg.
     *  Move another copy of files to ./generator/svg and change
     *  their file extention from .svg to .svg.php
     */
 
    return gulp.src('./src/svg/*.svg')
        .pipe(svgmin({
            plugins: [
                { removeDoctype: true },
                { removeComments: true }
            ]
        }))
        .pipe(gulp.dest('./dist/svg'))
        .pipe(replaceExt('.svg.php'))
        .pipe(gulp.dest('./generator/svg'));

});

gulp.task('format', function() {

    /**
     *  Format SVG files into PHP files which echo a string,
     *  containing the original SVG markup. Inject PHP variables
     *  into that string to dynamically set colors and dimensions.
     */

    return gulp.src('./generator/svg/*')
        .pipe(replace([
            ["<svg ", "<?php echo '<svg "],                                                                            // PHP start-tag, PHP echo command
            ['xmlns="http://www.w3.org/2000/svg"', 'xmlns="http://www.w3.org/2000/svg" ' + "' . $ariaAttributes . '"], // $ariaAttributes
            [/width=["']([^'"]+)/, 'width="' + "' . $width . '"],                                                      // $width PHP-variable
            [/height=["']([^'"]+)/, 'height="' + "' . $height . '"],                                                   // $height PHP-variable
            [/fill=["']([^'"]+)/, 'fill="' + "' . $fillColor . '"],                                                    // $fillColor PHP-variable
            [/stroke=["']([^'"]+)/, 'stroke="' + "' . $strokeColor . '"],                                              // $strokeColor PHP-variable
            ["path d", "path " + 'fill="' + "' . $fillColor . '" + '" d'],                                             // $fillColor PHP-variable on SVG path-elements without fill-attribute
            ["circle cx", "circle " + 'fill="' + "' . $fillColor . '" + '" cx'],                                       // $fillColor PHP-variable on SVG circle-elements without fill-attribute
            ["ellipse cx", "ellipse " + 'fill="' + "' . $fillColor . '" + '" cx'],                                     // $fillColor PHP-variable on SVG ellipse-elements without fill-attribute
            ["</svg>", "' . $ariaTags . '</svg>';"]                                                                    // closing characters and $ariaTags
        ]))
        .pipe(gulp.dest('./generator/svg'));

});