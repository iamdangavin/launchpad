<center>[Previous](security.md) | [Home](index.md) | [Next](index.md)</center>

Features
========

In case I forgot anything in the previous sections...

## Front-end Features

* CodeKit 2 support.
* Developer-mode test grid based on CSS rules to help you understand your baseline grid.  Access by pressing "g" key.

### HTML-ish

* Input placeholder polyfill because WTF IE9.
* Templates for Apple Startup Images and dummy files for Apple Touch Icons and Favicon.
* HTML5 Shiv included for IE8 (until I decide to stop supporting IE8 on the front end, which will probably be some time in late 2014).

### SASS / CSS

* Calculated percentage root font size based on SASS variable.  You enter '10px' and that gets converted to 62.5%.
* REM mixin based on root font size variable (see previous bullet) to make it dead easy to use REMs with a fallback.  E.g. <code>@include rem('padding', 5px 20px);</code>  A new version of the mixin might be better but it needs testing.
* Vertical rhythm based on SASS variables.
* Grid system.  Recently rewritten (and therefore untested) because the old one was too slow and didn't match my co-worker's concept of what grid systems do.
* Conditional comments for IE9 that don't make your HTML (specifically the actual <code>html</code> element) look like a janky mess.  Use <code>.msie-9 ~ *</code> for IE9.
* Unsupported browser "[Universal Stylesheet](https://code.google.com/p/universal-ie6-css/)."
* Built-in <code>:checked</code>-based "hamburger" menu.  You still have to style it, but the code handles some of the tedious bits.
* Basic wireframing code that you can copy/paste into your final stylesheet.

### jQuery / JavaScript

* Limited JavaScript feature detection for features that matter (screen DPI, position sticky, css transitions, and touch-capable) instead of including the full Modernizr suite.
* [60FPS scrolling](http://www.thecssninja.com/javascript/follow-up-60fps-scroll) option.  Add data-scroll-helper to the body.
* Various custom events for hooking into JavaScript.  Currently: launchpadInit, launchpadReinit.  More will be available eventually, I think.
* jQuery Custom Events for scrollStart, scrollStop, resizeStart, and resizeStop so that you don't have to shoot yourself in the foot by using resize and scroll events when you don't have to.
* jQuery-based Height Match via <code>@data-height-match-group</code> with children containing <code>@data-height-match</code> or <code>@data-height-match-children</code> to height match all children.  Use either a min-width as a number or media query for when heightmatch should work.  Media queries as height-match values are not supported by IE8 (always returns false because IE8 doesn't support Media Queries).
* Scripts are before the body close unless there is a plugin running.  Then they go at the top because plugins can't be trusted to do the right thing.


## SEO and Social Media Related Features

* Rel Canonical built in for posts, pages, and single custom post types.
* SEO Title with fallback to page title for posts, pages, and single custom post types.
* Meta Description 
  * Custom meta descriptions.
  * Generated from excerpts automatically if no custom value provided.
* Keyword density and title checks based on various best practices with suggestions on improvements.
* SERP Preview Snippet
* OpenGraph tags generated automatically.
* Twitter Card tags generated automatically.
* Google Analytics Support.
* hCard example in footer if you're into that sort of thing.
* Noindex, follow on archive pages.
* XML Sitemaps generated automatically following schema.org standards.
* AddThis support built in.


## Back-end Features

* Content caching with configurable cache timeouts and intelligent cache invalidating (i.e. on save).
* Automagic AppCache Manifest generation that pays attention to individual file size and total cache size to avoid overloading the cache and avoid the browser holding onto old caches.
* Custom rewites:
  * /images/ rewrites to the theme's /images/ folder.
  * /css/ rewrites to the theme's /css/ folder.
  * /js/ rewrites to the theme's /js/ folder.
  * /api/ rewrites to /wp-admin/admin-ajax.php for easier JavaScript API calls.
  * /support/ rewrites to the theme's /support/ folder.
  * manifest.appcache rewrites to the API call for creating the manifest.
* Phone number formatting function.
* US, Canadian, and UK postal code formatting.
* Automatic headers for X-UA-Compatible (IE=edge,chrome=1) so you don't have to put it in your markup.
* Settings for HTML5 Boilerplate's .htaccess.
* Support for saving custom fields and examples of how to set them up.
* Easy creation of custom post types.
* Easy creation of custom fields on those custom post types, and easily add metaboxes to existing post types.
* Flexible content.  Build modules in code as PHP arrays attached to post types. Includes built-in modules for:
  * Accordion: A title, WYSIWYG editor, and a repeater field with title and editor to create accordion lists.
  * Link List: A title, WYSIWYG editor, and relationship field for creating lists that link to other pages.
  * Section Navigation: Select title, starting point, and depth to render a list of child pages.
  * Simple Content: A title and WYSIWYG editor.
* Flexible content is automatically included in searches, so you don't have to worry about important content not being considered in search.  NOTE: Certain fields like Relationships use IDs. So, for example, if you build a link list, the titles of the posts you are linking to won't be considered in search because they are stored as IDs.
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
  * WordPress can consume a ton of memory.  If your peak memory usage gets within 500KB of the memory limit, the admin e-mail will get a message.
  * Use /download/path/to/local/file or /download/?file=http://path.to/file to force-download a file


## WordPress Features

* Deletes sample page and hello world post on theme activations so you don't have to do it.
* Visual editor and print stylesheets automatically generated from reset, typography, and objects SASS files.
* Support for a.button and a few other custom classes for the Visual Editor styles drop down.
* WordPress admin stylesheet.
* WordPress admin JavaScript.
* Sample admin-ajax API call that you can copy/paste to help you get going faster.
* Automatically sets up a post and home page associations.
* Automatically sets /assets/ as upload folder.
* Automatically adds header and footer navigation.
* Easily-modifiable theme options.  Fields go in an array and the code does the rest.
* Root-relative URLs in Visual Editor and beyond.
* Self-closing / void tag closing slash removal.
* Removal of title and alt attributes on images (because that is better than the default garbage most people leave).
* Change "Howdy" to "Hello" on the admin bar menu.
* Custom login skin with settings to change key colors and logo.
* Semantic rewrite of the WordPress Gallery shortcode.
* Smart 404 page.  Presents options for "Go Back" (if HTTP_REFERER is present), check URL for typos, and go to home page.  Finally, the URL is parsed for search terms and a search is executed for matching pages.  If any are found, the user is presented with the results.
* Regenerate Thumbnails.  If you add or change an image size, regenerate thumbnails under Tools > Regen Thumbnails.
* Media Replace.  If you have a file that needs to be updated in place with a new version, go to Media Library, edit the file, then use the Media Replace feature on the right sidebar.
* If your server supports exec() and your server has jpegtran or jpegoptim for jpegs or pngout, optipng, or pngcrush for pngs, Launchpad will losslessly optimize your images.
* Database and Asset Migration similar to WP Migrate DB Pro


## Security Features

* Configurable login attempts limiter.  Locks a user out based on username+IP for a configurable amount of time after a configurable number of failed attempts.  Save the theme settings to clear all lockouts.
* .htaccess features in the HTML5 Boilerplate options to prevent directory listings, prevent access to hidden files, and prevent access to certain wp-includes files.  Also includes [the 5G Blacklist](http://perishablepress.com/5g-blacklist-2013/).