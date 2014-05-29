Launchpad
=========

Launchpad is an extremely opinionated WordPress theme for developers.  This theme is still in beta, but is probably usable if you test settings extensively before launch.  The theme is meant to be hacked on directly.  

I am currently developing the first production site based on Launchpad and the second is in development by @iamdangavin.  Feedback from this process is being integrated back into Launchpad as issues arise.

I use CodeKit 2 to compile SASS and handle JavaScript includes and minification.  Child-theme support is on the list for possible features, but it is probably a long way off.


Features
========

This theme has been in the works for over a year.  After working with a team that was using the [Roots WordPress theme](http://roots.io), I adopted a few conventions from there (e.g. more useful body classes, root-relative URLs, built-in custom rewrites, and HTML5 Boilerplate integration) and combined them with some of my previous developer-friendly theme ideas.  I also had some thoughts on how to make a modern website work (e.g. built-in content caching, offline support with intelligent applicationCache reloading, and AJAX page loading), so I added those to it.

I'll be building out the feature list as I get the time.


## Front-end Features

* CodeKit 2 support.
* Developer-mode test grid based on CSS rules.  Access by pressing "g" key.

### HTML-ish

* Offline support with intelligent cache refreshing via applicationCache.
* Input placeholder polyfill.
* Templates for Apple Startup Images and dummy files for Apple Touch Icons and Favicon.
* HTML5 Shiv included for IE8.

### SASS / CSS

* Calculated percentage root font size based on SASS variable.  You enter '10px' and that gets converted to 62.5%.
* REM mixin based on root font size variable (see previous bullet) to make it dead easy to use REMs with a fallback.  E.g. <code>@include rem('padding', 5px 20px);</code>
* Vertical rhythm based on SASS variables.
* Grid system.  Recently rewritten.
* Conditional comments for IE8/9 that don't make your HTML look like a janky mess.  Use <code>.msie-8 ~ *</code> as your a prefix to a selector to change styles for IE8.
* Unsupported browser "[Universal Stylesheet](https://code.google.com/p/universal-ie6-css/)."

### jQuery / JavaScript

* Ajax page loads with History PushState/PopState and Google Analytics pageview events.
* Limited JavaScript feature detection for features that matter (screen DPI, position sticky, css transitions, and touch-capable) instead of including the full Modernizr suite.
* Built-in <code>:target</code>-based "hamburger" menu.
* [60FPS scrolling](http://www.thecssninja.com/javascript/follow-up-60fps-scroll) option.
* Various custom events for hooking into JavaScript.  Currently: launchpadInit, launchpadReinit, ajaxRequestStart, ajaxRequestEnd.  More will be available eventually.
* jQuery Custom Events for scrollStart, scrollStop, resizeStart, and resizeStop so that you don't have to shoot yourself in the foot by using resize and scroll events when you don't have to.
* jQuery-based Height Match via <code>@data-height-match-group</code> with children containing <code>@data-height-match</code> or <code>@data-height-match-children</code> to height match all children.  Use either a min-width as a number or media query for when heightmatch should work.


## SEO and Social Media Related Features

* Rel Canonical built in for posts, pages, and single custom post types.
* SEO Title with fallback to page title for posts, pages, and single custom post types.
* Meta Description 
  * Custom meta descriptions.
  * Generated from excerpts automatically if no custom value provided.
* Keyword density and title checks based on various best practices with suggestions.
* SERP Preview Snippet
* OpenGraph tags generated automatically.
* Twitter Card tags generated automatically.
* Google Analytics Support.
* hCard example in footer.
* Noindex, follow on listing pages.
* XML Sitemaps


## Back-end Features

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
* Easy creation of custom fields on those custom post types, and easily add metaboxes to existing post types.
* Flexible content.  Build modules in code as PHP arrays attached to post types. Includes built-in modules for:
  * Accordion: A title, WYSIWYG editor, and a repeater field with title and editor to create accordion lists.
  * Link List: A title, WYSIWYG editor, and relationship field for creating lists that link to other pages.
  * Section Navigation: Select title, starting point, and depth to render a list of child pages.
  * Simple Content: A title and WYSIWYG editor.
* Metabox and Flexible Content Fields:
  * Basic HTML inputs:
    * Checkbox
    * Multiple Select
    * Select
    * Text
    * Textarea
  * Visual Editor
  * Repeaters (Fields of Fields)
  * Relationships (Attach one or more posts in one or more post types)
  * Taxonomy (Select one or more taxonomies)
  * Menu selector (Select a menu created in Appearance > Menus)
* A ton of filters for modifying stuff.  See the functions-custom.php file for details.  More details eventually and more coming.


## WordPress Features

* Deletes sample page and hello world post on theme activations so you don't have to do it.
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
* Semantic rewrite of the WordPress Gallery shortcode.
* Smart 404 page.  Presents options for "Go Back" (if HTTP_REFERER is present), check URL for typos, and go to home page.  Finally, the URL is parsed for search terms and a search is executed for matching pages.  If any are found, the user is presented with the results.


## Security Features

* Configurable login attempts limiter.  Locks a user out based on username+IP for a configurable amount of time after a configurable number of failed attempts.  Save the theme settings to clear all lockouts.


Notes
=====

In many cases, I'm trying to force best practices.  JavaScript embeds are in the footer, for example, and you can use <code>body.no-js</code> and <code>body.js</code> as hooks for styling with Progressive Enhancement.


To Do For 1.0
=============

* Fix mobile login screen.
* Flexible content modules and field types.
  * What other modules should be built-in?
  * Other field types?
* Add "basic" stylesheet that handles wireframe related things (i.e. Built-in nav classes with drop downs).
* Add more custom events to JavaScript to aid in development.
* Anything else that needs to be done to make for easy child themes.  Child themes are currently not recommended.
  * Probably have the core theme and a child theme.
  * CSS and JS may be part of the second theme.
  * Probably need to use locate_template instead of include.
* SEO+Social Stuff
  * Flipboard
* Do a COMPLETE feature review to make sure everything still works.
* More code documentation.
* Decide about re-organizing /functions/


To Do For 2.0
=============

* Continue improving flexible content if more needs have arisen.
* Make Gravity Forms output better and include generic form stylesheets in _objects.scss.
  * add_filter('gform_field_content', 'launchpad_fix_gravity_forms_output', 10, 5);
  * http://www.gravityhelp.com/documentation/page/Gform_field_content
* Ad Designer.
  * Create ads as post type.
  * Design ads in the browser.  Fonts in theme and positioning.
  * Developer-approved CSS / JS handles how they work.
  * Skate Integrated (Once Skate is 2.0)
* Custom Headers
  * Single Image
  * Ads
* Something about widgets.
* Updates through WP Admin.
* "Search Everything" type of functionality so that search includes flexible content modules / custom fields