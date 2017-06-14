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
    
    // header
    // ======
    
    // Set the header to allow cross-domain ajax calls.
    // This example is pre-configured for use with browser-sync (browsersync.io) and localhost on port 3000.
    // Make sure you set browser-sync's CORS option to TRUE (browsersync.io/docs/options#option-cors).
    
    header('Access-Control-Allow-Origin: http://localhost:3000');
    
    // settings
    // ========
    
    $defaultId          = 0;
    $defaultWidth       = 32;
    $defaultheight      = 32;
    $defaultFillColor   = '#6754a1';
    $defaultStrokeColor = '#6754a1';
    
    // generate the svg file
    // =====================
    
    if (requestIsAllowed()) {

        // set the header

        header('Content-type: image/svg+xml');

        // get the parameters

        $id          = processGetVariable('id', $defaultId);
        $height      = processGetVariable('h', $defaultWidth);
        $width       = processGetVariable('w', $defaultheight);
        $fillColor   = processGetVariable('f', $defaultFillColor);
        $strokeColor = processGetVariable('s', $defaultStrokeColor);
        $ariaHidden  = processGetVariable('hidden', true);
        $ariaTitle   = processGetVariable('title', false);
        $ariaDescr   = processGetVariable('descr', false);
        
        // set aria-related attributes

        $ariaAttributes  = 'role="img"';
        $ariaAttributes .= ($ariaTitle || $ariaDescr ? ' aria-labelledby="' : '');
        $ariaAttributes .= ($ariaTitle ? 'title' : '');
        $ariaAttributes .= ($ariaTitle && $ariaDescr ? ' ' : '');
        $ariaAttributes .= ($ariaDescr ? 'desc' : '');
        $ariaAttributes .= ($ariaTitle || $ariaDescr ? '"' : '');
        $ariaAttributes .= ($ariaHidden == 'true' ? ' aria-hidden="true"' : '');

        // set aria-related tags

        $ariaTags        = '';
        $ariaTags       .= ($ariaTitle != false ? ' <title id="title">' . $ariaTitle . '</title>' : '');
        $ariaTags       .= ($ariaDescr != false ? ' <desc id="desc">' . $ariaDescr . '</desc>' : '');
        
        // set the file name
    
        $fileName = 'svg/' . $id . '.svg.php';
        
        // require the file
    
        require $fileName;
        
    } else {
        
        // if the request to this script does not come from one
        // of the allowed hosts, stop execution
        
        die();
        
    }

    // helper functions
    // ================

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
    
    function requestIsAllowed() {
        
        /**
         *  Checks if the request to this script comes from a trusted
         *  host/domain name.
         *
         *  @return {bool} - true if the request is truested, false if not
         */
        
        $requestingHostName = $_SERVER['HTTP_HOST'];
        $trustedHostNames   = ['localhost', 'cdn.yoshino.digital'];
        
        if (in_array($requestingHostName, $trustedHostNames)) {
            return true;
        } else {
            return false;
        }
    
    }