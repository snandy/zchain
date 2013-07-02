/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

    var done = false, top = true,

    doc = win.document, root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
        if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
        (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
        if (!done && (done = true)) fn.call(win, e.type || e);
    },

    poll = function() {
        try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
        init('poll');
    };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
        if (doc.createEventObject && root.doScroll) {
            try { top = !win.frameElement; } catch(e) { }
            if (top) poll();
        }
        doc[add](pre + 'DOMContentLoaded', init, false);
        doc[add](pre + 'readystatechange', init, false);
        win[add](pre + 'load', init, false);
    }

}

/*
    jQuery's document.ready/$(function(){}) should
    you wish to use a cross-browser DOMReady solution
    without opting for a library.

    Demo: http://jsfiddle.net/zKLpb/

    usage:
    $(function(){
        // your code
    });

    Parts: jQuery project, Diego Perini, Lucent M.
    This version: Addy Osmani
*/
(function( window ) {
    "use strict";

    // Define a local copy of $
    var $ = function( callback ) {
            readyBound = false;
            $.isReady = false;
            if ( typeof callback === "function" ) {
                DOMReadyCallback = callback;
            }
            bindReady();
        },

        // Use the correct document accordingly with window argument (sandbox)
        document = window.document,
        readyBound = false,
        DOMReadyCallback = function() {},

        // The ready event handler
        DOMContentLoaded = function() {
            if ( document.addEventListener ) {
                    document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            } else {
                    // we're here because readyState !== "loading" in oldIE
                    // which is good enough for us to call the dom ready!
                    document.detachEvent( "onreadystatechange", DOMContentLoaded );
            }
            DOMReady();
        },

        // Handle when the DOM is ready
        DOMReady = function() {
            // Make sure that the DOM is not already loaded
            if ( !$.isReady ) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( !document.body ) {
                    return setTimeout( DOMReady, 1 );
                }
                // Remember that the DOM is ready
                $.isReady = true;
                // If there are functions bound, to execute
                DOMReadyCallback();
                // Execute all of them
            }
        }, // /ready()

        bindReady = function() {
            var toplevel = false;

            if ( readyBound ) {
                return;
            }
            readyBound = true;

            // Catch cases where $ is called after the
            // browser event has already occurred.
            if ( document.readyState !== "loading" ) {
                DOMReady();
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", DOMContentLoaded, false );
                // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", DOMContentLoaded );
                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", DOMContentLoaded );
                // If IE and not a frame
                // continually check to see if the document is ready
                try {
                    toplevel = window.frameElement == null;
                } catch (e) {}
                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                }
            }
        },

        // The DOM ready check for Internet Explorer
        doScrollCheck = function() {
            if ( $.isReady ) {
                return;
            }
            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch ( error ) {
                setTimeout( doScrollCheck, 1 );
                return;
            }
            // and execute any waiting functions
            DOMReady();
        };

    // Is the DOM ready to be used? Set to true once it occurs.
    $.isReady = false;

    // Expose $ to the global object
    window.$ = $;

})( window );


// http://dustindiaz.com/smallest-domready-ever for lower IE
function domReady(fn){
    // "uninitalized"、"loading"、"interactive"、"complete" 、"loaded"
    /in/.test(document.readyState) ?
    setTimeout(function(){domReady(fn);},5) :
    fn();
}