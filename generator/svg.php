<?php

    /**
     *  svg.php
     *
     *  A very simple script to output SVGs with dynamic values such as
     *  colors and size. If run by a web server, it can be called with GET
     *  vars & parameters to manipulate the output SVG. Example:
     *
     *  <img src="http://xxx.xxx/svg.php?id=someFileName&h=150&w=200&f=#ff0000&s=#0000ff" />
     *
     *  The example above produces an SVG that is 150px heigh and 200px wide, with red
     *  fill color and blue outline.
     */

    // set the header

    header('Content-type: image/svg+xml');

    // get the parameters

    $id          = processGetVariable('id', '0');
    $height      = processGetVariable('h', '100');
    $width       = processGetVariable('w', '100');
    $fillColor   = processGetVariable('f', '#ffffff');
    $strokeColor = processGetVariable('s', '#000000');

    // set the file name
    
    $fileName = $id . '.svg.php';
    
    // if it exists, include the file,
    // otherwise terminate the script
    
    // if (file_exists('./generator/svg/' . $fileName)) {
    //     include 'svg/' . $fileName;
    // } else {
    //     die();
    // }
    
    include 'svg/' . $fileName;

    // helper functions

    function processGetVariable($varName, $defaultValue) {
    
        /**
         *  Checks if $varName is a valid GET variable. Returns the
         *  variable value if valid, otherwise returns the supplied
         *  default value.
         *
         *  @param  {string} $varName      - the GET valiable name
         *  @param  {string} $defaultValue - the chosen default value
         *  @return {string}               - either the GET variable's value or the default value
         */
    
        return (isset($_GET[$varName]) AND !empty($_GET[$varName])) ? $_GET[$varName] : $defaultValue;
    
    }