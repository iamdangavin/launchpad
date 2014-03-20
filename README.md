Launchpad
=========

A WordPress theme for developers.  This theme is still in beta, but is probably usable if you test settings extensively before launch.  The theme is meant to be hacked on directly.  I use CodkeKit 2 to compile SASS and handle JavaScript includes and minification.  Child-theme support is on the list for possible features, but it is probably a long way off.


Features
========

This theme has been in the works for over a year.  After working with a team that was using the [Roots WordPress theme](http://roots.io), I adopted a few conventions from there (e.g. more useful body classes, root-relative URLs, built-in custom rewrites, and HTML5 Boilerplate integration) and combined them with some of my previous developer-friendly theme ideas.  I also had some thoughts on how to make a modern website work (e.g. built-in content caching, offline support with intelligent applicationCache reloading, and AJAX page loading), so I added those to it.

I'll be building out current feature list as I get the time.


Front-end Features
==================

* CodeKit 2 support.
* Calculated percentage root font size based on SASS variable.  You enter '10px' and that gets converted to 62.5%.
* REM mixin based on root font size variable (see previous bullet) to make it dead easy to use REMs with a fallback.  E.g. <code>@include rem('padding', 5px 20px);</code>
* Vertical rhythm based on SASS variables.
* Grid system using SASS variables to convert a gutter width as a percent at a particular container width.
* Conditional comments for IE8/9 that don't make your HTML look like a janky mess.  Use <code>.msie-8 ~ *</code> as your a prefix to a selector to change styles for IE8.
* Unsupported browser "[Universal Stylesheet](https://code.google.com/p/universal-ie6-css/)."
* Developer-mode test grid based on CSS rules.  Access by pressing "g" key.
* Offline support with intelligent cache refreshing via applicationCache.
* Ajax page loads with History PushState/PopState and Google Analytics pageview events.
* Limited JavaScript feature detection for features that matter (screen DPI, position sticky, css transitions, and touch-capable) instead of including the full Modernizr suite.
* Built-in <code>:target</code>-based "hamburger" menu.
* [60FPS scrolling](http://www.thecssninja.com/javascript/follow-up-60fps-scroll) option.
* Various custom events for hooking into JavaScript.  Currently: launchpadInit, launchpadReinit, ajaxRequestStart, ajaxRequestEnd.  More will be available eventually.
* jQuery Custom Events for scrollStart, scrollStop, resizeStart, and resizeStop so that you don't have to shoot yourself in the foot by using resize and scroll events when you don't have to.
* Input placeholder polyfill.
* Templates for Apple Startup Images and dummy files for Apple Touch Icons and Favicon.
* HTML5 Shiv included for IE8.


SEO-Related Features
====================

* Rel Canonical built in for posts, pages, and single custom post types.
* Meta Description generated from excerpts automatically.
* OpenGraph tags generated automatically.
* Google Analytics Support.
* hCard example in footer.


Back-end Features
=================

* Content caching with configurable cache timeouts and intelligent cache invalidating (i.e. on save).
* Automagic AppCache Manifest generation that pays attention to individual file size and total cache size to avoid overloading the cache.
* Custom rewites:
  * /images/ rewrites to the theme's /images/ folder.
  * /css/ rewrites to the theme's /css/ folder.
  * /js/ rewrites to the theme's /js/ folder.
  * /api/ rewrites to /wp-admin/admin-ajax.php for easier JavaScript API calls.
  * /support/ rewrites to the theme's /support/ folder.
  * manifest.appcache rewrites to the API call for creating the manifest.
* Phone number formatting function.
* Automatic headers for X-UA-Compatible (IE=edge,chrome=1) so you don't have to put it in your markup.
* Settings for HTML5 Boilerplate's .htaccess.
* Support for saving custom post fields and examples of how to set them up.
* Easy creation of custom post types.


WordPress Features
==================

* Visual editor and print stylesheets automatically generated from reset, typography, and objects SASS files.
* Support for a.button and a few other custom classes for the Visual Editor styles drop down.
* WordPress admin stylesheet.
* WordPress admin JavaScript.
* Sample admin-ajax API call.
* Automatically sets up a post and home page associations.
* Automatically sets /uploads/ as upload folder.
* Automatically adds header and footer navigation.
* Easily-modifiable theme options.  Fields go in an array and the code does the rest.
* Root-relative URLs in Visual Editor and beyond.
* Self-closing / void tag closing slash removal.
* Removal of title and alt attributes on images (because that is better than the default garbage most people leave).
* Change "Howdy" to "Hello" on the admin bar menu.
* Custom login skin with settings to change key colors and logo.


Security Features
=================

* Configurable login attempts limiter.  Locks a user out based on username+IP for a configurable amount of time after a configurable number of failed attempts.  Save the theme settings to clear all lockouts.


Notes
=====

In many cases, I'm trying to force best practices.  JavaScript embeds are in the footer, for example, and you can use <code>body.no-js</code> and <code>body.js</code> as hooks for styling with Progressive Enhancement.


To Do
=====

* Add hooks in WP code for modifying things that people may want to modify.
* Add more custom events to JavaScript to aid in development.
* Anything else that needs to be done to make for easy child themes.  Child themes are currently not recommended.
* Easy way to add custom fields to post types.