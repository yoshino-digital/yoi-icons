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
     *  Compress SVG files and change the file extention
     *  from .svg to .svg.php
     */
 
    return gulp.src('./src/svg/*.svg')
        .pipe(svgmin({
            plugins: [
                { removeDoctype: true },
                { removeComments: true }
            ]
        }))
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
            ["<svg ", "<?php echo '<svg "],                                         // insert PHP start-tag and echo command
            [/width=["']([^'"]+)/, 'width="' + "' . $width . '"],                   // insert $width PHP-variable
            [/height=["']([^'"]+)/, 'height="' + "' . $height . '"],                // insert $height PHP-variable
            [/fill=["']([^'"]+)/, 'fill="#' + "' . $fillColor . '"],                // insert $fillColor PHP-variable
            [/stroke=["']([^'"]+)/, 'stroke="#' + "' . $strokeColor . '"],          // insert $strokeColor PHP-variable
            ["path d", "path " + 'fill="#' + "' . $fillColor . '" + '" d'],         // insert $fillColor PHP-variable on SVG path-elements without fill-attribute
            ["circle cx", "circle " + 'fill="#' + "' . $fillColor . '" + '" cx'],   // insert $fillColor PHP-variable on SVG circle-elements without fill-attribute
            ["ellipse cx", "ellipse " + 'fill="#' + "' . $fillColor . '" + '" cx'], // insert $fillColor PHP-variable on SVG ellipse-elements without fill-attribute
            ["</svg>", "</svg>'; ?>"]
        ]))
        .pipe(gulp.dest('./generator/svg'));

});