/*jslint browser: true, devel: true, sloppy: true, todo: true, white: true */

/**
 * Front End JavaScript
 *
 * Handles all the JavaScript needs of the front end.
 *
 * @package 	Launchpad
 * @since   	Version 1.0
 */



/**
 * Manage Ajax Page Loads
 *
 * @since   	Version 1.0
 */
function initAjax() {
	var body = $(document.body);
	
	function handlePopState(e) {
		if(history.ready) {
			if(window.dev) {
				console.log('Handling popState.');
			}
			e.preventDefault();
			handleLinkClick.call(
					$('<a href="' + location.href + '"></a>').get(0),
					{preventDefault: function() {}, pushState: false}
				);
		} else {
			if(window.dev) {
				console.log('History is ready for pushState.');
			}
			history.ready = true;
		}
	}
	
	function handleLinkClick(e) {
		var me = $(this),
			href = me.attr('href');
		if(href.indexOf('wp-admin') !== -1) {
			return;
		}
		if(href.substr(0, 1) === '/' || location.href.split('/')[2] === href.split('/')[2]) {
			if(window.dev) {
				console.log('Initializing ajax request.');
			}
			
			e.preventDefault();
			body.trigger('ajaxRequestStart');
			
			$.get(
					href + (href.indexOf('?') === -1 ? '?' : '&') + 'launchpad_ajax=true'
				)
				.done(
					function(data) {
						var title = data.match(/<title>(.*?)<\/title>/),
							bodyclass = data.match(/<body.*?class="(.*?)".*?>/),
							htmlclass = data.match(/<html.*?class="(.*?)".*?>/),
							content = $(
									$.parseHTML(
										'<div>' +
										data.replace(/[\s\S]+<body.*?>/, '').replace(/<\/body>[\s\S]+/, '') +
										'</div>'
									)
								);
						
						if(content.length) {
							if(window.dev) {
								console.log('Swapping ajax results.');
							}
							if(title && title.length > 1) {
								document.title = $('<span>' + title[1] + '</span>').html();
							}
							if(htmlclass && htmlclass.length > 1) {
								document.documentRoot.className = htmlclass[1];
							}
							if(bodyclass && bodyclass.length > 1) {
								document.body.className = bodyclass[1];
							}
							body.html(content.html());
							
							_gaq.push(['_trackPageview', href]);
							
							if(history.pushState && e.pushState !== false) {
								if(window.dev) {
									console.log('Handling pushState.');
								}
								history.pushState('', '', href);
							}
						} else {
							if(window.dev) {
								console.log('Ajax results were not compatible with theme. Manually redirecting.');
								location.href = href;
							}
						}
					}
				)
				.fail(
					function() {
						if(window.dev) {
							console.log('Ajax request failed.');
						}
						location.href = href;
					}
				).always(
					function() {
						if(window.dev) {
							console.log('Ajax request complete.');
						}
						body.trigger('ajaxRequestEnd');
					}
				);
		}
	}
	
	body.on('click', 'a', handleLinkClick);
	$(window).on('popstate', handlePopState);
}


/**
 * Attempt to Manage ApplicationCache Refresh Intelligently
 *
 * @since   	Version 1.0
 */
function initMonitorLogin() {
	var login_interval = false,
		cache_update_interval = false,
		logged_in = false,
		is_first_run = true;
	
	function updateCache() {
		if(logged_in && navigator.onLine && $('html[manifest]').length) {
			if(window.dev) {
				console.log('Forcing AppCache to update because user is logged in.');
			}
			applicationCache.update();
		}
	}
	
	function checkLogin() {
		if(navigator.onLine) {
			$.get('/api/?action=user_logged_in').done(
				function(data) {
					logged_in = data;
					if(logged_in) {
						if(!cache_update_interval) {
							if(window.dev) {
								console.log('Starting to invalidate AppCache every 60 seconds because user is logged in.');
							}
							updateCache();
							cache_update_interval = setInterval(updateCache, 60000);
						}
					} else if(cache_update_interval) {
						if(window.dev) {
							console.log('Removing AppCache invalidation interval because user is not logged in.');
						}
						clearInterval(cache_update_interval);
						cache_update_interval = false;
					} else if(is_first_run) {
						if(window.dev) {
							console.log('User is not logged in.  Allowing AppCache to self-manage.');
						}
					}
					is_first_run = false;
				}
			);
		} else {
			clearInterval(cache_update_interval);
		}
	}
	
	checkLogin();
	login_interval = setInterval(checkLogin, 60000);
}

/**
 * Manage Height Matching
 *
 * @since   	Version 1.0
 */
function initHeightMatch() {
	function heightMatch() {
		$('.height-match-group').css('height', 'auto').each(
				function() {
					var me = $(this),
						height = 0;
					me.children('.height-match').css('height', 'auto').each(
							function() {
								var h = $(this).outerHeight();
								if(h > height) {
									height = h;
								}
							}
						).add(me).css('height', height);
				}
			);
	}
	
	$('.height-match-children').removeClass('height-match-children')
		.addClass('height-match-group')
		.children().each(
			function() {
				$(this).addClass('height-match');
			}
		);
	
	heightMatch();
	$(window).on(
			'resizeEnd',
			heightMatch
		);
}


/**
 * Detect CSS Transition Support
 *
 * @since   	Version 1.0
 */
function detectTouchCapable() {
	if(window.supports.touch !== undefined) {
		if(window.supports.touch) {
			$(document.body).addClass('touch');
		} else {
			$(document.body).addClass('no-touch');
		}
		return;
	}
	if(window.hasOwnProperty && window.hasOwnProperty('ontouchstart')) {
		$(document.body).addClass('touch');
		window.supports.touch = true;
	} else {
		$(document.body).addClass('no-touch');
		window.supports.touch = false;
	}
	
	_gaq.push(['_setCustomVar', 1, 'Browser Support', 'Touch', window.supports.touch]);
}

/**
 * Detect CSS Transition Support
 *
 * @since   	Version 1.0
 */
function detectTransitions() {
	var test;
	if(window.supports.transitions !== undefined) {
		if(window.supports.transitions) {
			$(document.body).addClass('css-transitions');
		}
		return;
	}
	test = document.createElement('p').style;
	if('transition' in test || 'WebkitTransition' in test || 'MozTransition' in test || 'msTransition' in test) {
		$(document.body).addClass('css-transitions');
		window.supports.transitions = true;
	} else {
		window.supports.transitions = false;
	}
	
	_gaq.push(['_setCustomVar', 1, 'Browser Support', 'CSS Transitions', window.supports.transitions]);
}

/**
 * Detect CSS Position Sticky
 *
 * @since   	Version 1.0
 */
function detectPositionSticky() {
	var test;
	if(window.supports.sticky !== undefined) {
		if(window.supports.sticky) {
			$(document.body).addClass('css-sticky');
		} else {
			$(document.body).addClass('css-not-sticky');
		}
		return;
	}
	test = $('<div style="position: absolute; position: -webkit-sticky; position: -moz-sticky; position: -ms-sticky; position: sticky; "></div>');
	
	if(test.css('position') !== 'absolute') {
		window.supports.sticky = true;
		$(document.body).addClass('css-sticky');
	} else {
		window.supports.sticky = false;
		$(document.body).addClass('css-not-sticky');
	}
	
	_gaq.push(['_setCustomVar', 1, 'Browser Support', 'Sticky Positioning', window.supports.sticky]);
}

/**
 * Detect Screen DPI
 *
 * @since   	Version 1.0
 */
function detectDPI() {
	window.supports.dpi = 1;
	if(window.devicePixelRatio !== undefined) {
		window.supports.dpi = window.devicePixelRatio;
	}
	_gaq.push(['_setCustomVar', 1, 'Browser Support', 'Device Pixel Ratio', window.supports.dpi]);
}

/**
 * Hide or show the grid
 * 
 * It is helpful to have a grid overlay when dealing with alignment.  This shows a grid when the user presses "G"
 * if the site is deemed to be in development mode (indicated by .dev in the domain name).
 *
 * @param		object e The event object
 * @since   	Version 1.0
 */
function handleGrid(e) {
	var win = $(window),
		body = $(document.body),
		coverel = win.height() > body.height() ? win : body,
		grid = body.css('line-height'), c, l;
	if(e.which === 71 && $(e.target).is('body')) {
		if(body.hasClass('grid')) {
			$('.grid-item').remove();
			body.removeClass('grid');
		} else {
			l = $('<p>');
			$(document.body).append(l);
			grid = +l.css('line-height').replace('px', '');
			l.remove();
			body.addClass('grid');
			for(c = grid, l = coverel.width(); c < l; c += grid) {
				body.append($('<div class="grid-item vertical"></div>').css('left', c + 'px'));
			}
			for(c = grid, l = coverel.height(); c < l; c += grid) {
				body.append($('<div class="grid-item horizontal"></div>').css('top', c + 'px'));
			}
		}
	}
}


/**
 * Re-initialize the Front End
 *
 * Some events do not bubble, so we need to initialize them every time we load new content.  Also, we need to update body classes.
 *
 * @since   	Version 1.0
 */
function reinit() {
	if(window.dev) {
		console.log('Executing reinit.');
	}
	document.body.className = document.body.className.replace(/no-js/g, 'js');
	if(window.navigator.standalone) {
		document.body.className += ' apple-standalone';
	}
	detectDPI();
	detectPositionSticky();
	detectTransitions();
	detectTouchCapable();
	$(document.body).trigger('launchpadReinit');
}


/**
 * Initialize the Front End
 *
 * @since   	Version 1.0
 */
function init() {
	var scrollingIsJanky = false,
		doNotSupport = [/MSIE [1234567]\./],
		l, i;
	
	window.supports = {};
	
	if(window.dev) {
		window.dev = (window.console && window.dev);
	}
	
	if(!window._gaq) {
		window._gaq = [];
	}
	
	for(i = 0, l = doNotSupport.length; i < l; i++) {
		if(navigator.userAgent.match(doNotSupport[i])) {
			$('#screen-css').remove();
			$('head').append($('<link rel="stylesheet" type="text/css" id="screen-css" media="screen, projection, handheld, tv" href="/css/unsupported.css">'));
			return;
		}
	}
	
	initHeightMatch();
	if($('[data-ajax="true"]').length) {
		initAjax();
	}
	
	$(document.body).on(
			'click',
			'*',
			function(e) {
				var i = $(this),
					nav = $('#navigation');
				if(i.is('a.hamburger')) {
					e.preventDefault();
					nav.toggleClass('target');
					if(location.hash === '#navigation' && !nav.hasClass('target')) {
						location.hash = '';
					}
				} else {
					nav.removeClass('target');
					if(location.hash === '#navigation') {
						location.hash = '';
					}
				}
			}
		).on('ajaxRequestEnd', reinit);
	
	if(window.applicationCache && $('html[manifest]').length) {
		
		// Watch to see if the user logs in or out so we can manage their cache.
		initMonitorLogin();
	
		// Handle online/offline transitions.
		$(window).on(
				'offline',
				function() {
					if(window.dev) {
						console.log('Browser is offline.');
					}
					$(document.body).append(
						$('<div id="offline-notification" class="system-notification">✱ You are currently offline.</div>')
					);
				}
			).on(
				'online',
				function() {
					if(window.dev) {
						console.log('Browser is online.');
					}
					$('#offline-notification').remove();
					try {
						applicationCache.update();
					} catch(err) {
						if(window.dev) {
							console.log('Attempting to force an update to the appCache threw an error, but we caught it.', err);
						}
					}
				}
			);
		
		// Handle appcache updates.
		if(!navigator.onLine) {
			$(window).trigger('offline');
		} else {
			if(window.dev) {
				console.log('Browser lacks cache. Initiating appcache update.');
			}
			$(window).trigger('online');
		}
		
		// Add listeners for cache updates.
		applicationCache.addEventListener(
				'updateready',
				function() {
					if(applicationCache.status === applicationCache.UPDATEREADY) {
						if(window.dev) {
							console.log('Appcache updated. Swapping now.');
						}
						applicationCache.swapCache();
					}
				}
			);
		if(window.dev) {
			applicationCache.addEventListener(
					'progress',
					function(e) {
						console.log('Appcache loading ' + (e.loaded+1) + ' of ' + e.total + '.');
					}
				);
			applicationCache.addEventListener(
					'obsolete',
					function() {
						console.log('Appcache has been obsoleted.');
					}
				);
		}
	}
	
	/**
	 * 60 Frames Per Second Scrolling
	 * 
	 * This is a supposed fix to allow 60FPS scrolling.  
	 * Enable at your own risk, probably when your scrolling gets janky.
	 *
	 * @link	http://www.thecssninja.com/javascript/follow-up-60fps-scroll
	 */
	if(scrollingIsJanky) {
		$(window).on(
				'scrollStart scrollEnd',
				function(e) {
					switch(e.type) {
						case 'scrollStart':
							$(document.body).append(
								$('<div id="launchpad-cover"></div>').css(
									{
										'-webkit-transform': 'translate3d(0,0,0)',
										'transform': 'translate3d(0,0,0)',
										'position': 'fixed',
										'top': '0',
										'right': '0',
										'left': '0',
										'bottom': '0',
										'opacity': '0',
										'z-index': '9',
										'pointer-events': 'none'
									}
								)
							);
						break;
						case 'scrollEnd':
							$('#launchpad-cover').remove();
						break;
					}
				}
			);
	}
	
	if(window.dev === true) {
		$(document).on('keyup', 'body', handleGrid);
	}
	$(document.body).trigger('launchpadInit');
	reinit();
}
jQuery(document).ready(init);


/**
 * Custom jQuery Events
 *
 * @since   	Version 1.0
 */
(function($, window, undefined) {
	'use strict';

	var customEvents = ['scrollStart', 'scrollEnd', 'resizeStart', 'resizeEnd'],
		timeoutResize = 250,
		timeoutScroll = 100;
	
	$.event.special.scrollStart = {
		enabled: true,
		setup: function() {
			var me = this,
				jqme = $(me),
				timer;
			
			function trigger() {
				$.event.dispatch.call(me, 'scrollStart');
			}
			
			if(typeof jqme.data('track-scroll') === 'undefined') {
				jqme.data('track-scroll-start', false);
			}
			
			jqme.bind('touchmove.scrollstart scroll.scrollstart', function() {
				if(!jqme.data('track-scroll-start')) {
					jqme.data('track-scroll-start', true);
					trigger();
				}
				
				clearTimeout(timer);
				timer = setTimeout(
						function() {
							jqme.data('track-scroll-start', false);
						}, timeoutScroll
					);
			});
		},
		teardown: function() {
			$(this).unbind('touchmove.scrollstart scroll.scrollstart');
		}
	};
	
	$.event.special.scrollEnd = {
		enabled: true,
		setup: function() {
			var me = this,
				jqme = $(me),
				timer;
			
			function trigger() {
				$.event.dispatch.call(me, 'scrollEnd');
			}
			
			if(typeof jqme.data('track-scroll-end') === 'undefined') {
				jqme.data('track-scroll-end', false);
			}
			
			jqme.bind('touchmove.scrollend scroll.scrollend', function() {
				if(!jqme.data('track-scroll-end')) {
					jqme.data('track-scroll-end', true);
				}
				
				clearTimeout(timer);
				timer = setTimeout(
						function() {
							jqme.data('track-scroll-end', false);
							trigger();
						}, timeoutScroll
					);
			});
		},
		teardown: function() {
			$(this).unbind('touchmove.scrollend scroll.scrollend');
		}
	};
	
	$.event.special.resizeStart = {
		enabled: true,
		setup: function() {
			var me = this,
				jqme = $(me),
				timer;
				
			function trigger() {
				$.event.dispatch.call(me, 'resizeStart');
			}
			
			if(typeof jqme.data('track-resize') === 'undefined') {
				jqme.data('track-resize-start', false);
			}
			
			jqme.bind('resize.resizestart', function() {
				if(!jqme.data('track-resize-start')) {
					jqme.data('track-resize-start', true);
					trigger();
				}
				
				clearTimeout(timer);
				timer = setTimeout(
						function() {
							jqme.data('track-resize-start', false);
						}, timeoutResize
					);
			});
		},
		teardown: function() {
			$(this).unbind('resize.resizestart');
		}
	};
	
	$.event.special.resizeEnd = {
		enabled: true,
		setup: function() {
			var me = this,
				jqme = $(me),
				timer;
			
			function trigger() {
				$.event.dispatch.call(me, 'resizeEnd');
			}
			
			if(typeof jqme.data('track-resize-end') === 'undefined') {
				jqme.data('track-resize-end', false);
			}
			
			jqme.bind('resize.resizeend', function() {
				if(!jqme.data('track-resize-end')) {
					jqme.data('track-resize-end', true);
				}
				
				clearTimeout(timer);
				timer = setTimeout(
						function() {
							jqme.data('track-resize-end', false);
							trigger();
						}, timeoutResize
					);
			});
		},
		teardown: function() {
			$(this).unbind('resize.resizeend');
		}
	};
	
	$.each(
		customEvents,
		function(i, name) {
			$.fn[name] = function(handler) {
				return handler ? this.bind(name, handler) : this.trigger(name);
			};
		}
	);
	

})(jQuery, this);



/**
 * Placeholder Polyfill
 * 
 * Required until we drop IE9.
 *
 * @since   	Version 1.0
 */
(function () {
	function placeHolderFocus(e) {
		e = e || event;
		var t = e.target || e.srcElement,
			placeholder = t.getAttribute('placeholder');
		if(t.value === placeholder) {
			t.value = '';
		}
	}
	function placeHolderBlur(e) {
		e = e || event;
		var t = e.target || e.srcElement,
			placeholder = t.getAttribute('placeholder');
		if(t.value === '') {
			t.value = placeholder;
		}
	}
	function init() {
		var standards = window.addEventListener,
			els = document.getElementsByTagName('*'),
			l = els.length, c = 0, cur;
		for(c; c < l; c = c+1) {
			cur = els[c];
			switch(cur.nodeName.toLowerCase()) {
				case 'input':
				case 'textarea':
					if(cur.getAttribute('placeholder')) {
						if(standards) {
							cur.addEventListener('focus', placeHolderFocus);
							cur.addEventListener('blur', placeHolderBlur);
						} else {
							cur.attachEvent('onfocus', placeHolderFocus);
							cur.attachEvent('onblur', placeHolderBlur);
						}
						if(cur.value === '') {
							cur.value = cur.getAttribute('placeholder');
						}
					}
				break;
			}
		}
	}
	if(!('placeholder' in document.createElement('input'))) {
		init();
	}
}());