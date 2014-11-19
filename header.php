<?php

/**
 * The default page header
 *
 * @package 	Launchpad
 * @since		1.0
 */

global $site_options;

$ajax = '';
if(isset($site_options['ajax_page_loads']) && $site_options['ajax_page_loads'] === true) {
	$ajax = 'true';
}

$offline = '';
if(isset($site_options['offline_support']) && $site_options['offline_support'] === true) {
	$offline = '/manifest.appcache';
}

$excerpt = launchpad_seo_excerpt();

?><!DOCTYPE html>
<html lang="en"<?php echo $offline ? ' manifest="' . $offline . '"' : '' ?>>
	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<title><?php launchpad_title(true); ?></title>
		
		<!--[if lt IE 9]><script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
		<link rel="stylesheet" type="text/css" id="screen-css" media="screen, projection, handheld, tv" href="/css/screen.css">
		<link rel="stylesheet" type="text/css" media="print" href="/css/print.css">
		<?php if(file_exists($_SERVER['DOCUMENT_ROOT'] . '/design-tweaks.css')) { ?>
		
		<link rel="stylesheet" type="text/css" id="screen-css" media="screen, projection, handheld, tv" href="/design-tweaks.css">
		<?php } ?>
		
		<link rel="icon" href="/images/icons/favicon.png">
		<link rel="icon" href="/images/icons/favicon_2x.png" media="(-webkit-min-device-pixel-ratio: 2)">
		
		<link rel="alternate" type="application/rss+xml" title="<?php bloginfo('name') ?> RSS Feed" href="/feed/">
		<?php if(is_single() || is_page()) { ?>
		
		<link rel="canonical" href="http://<?php echo $_SERVER['HTTP_HOST'] ?><?php the_permalink(); ?>">
		<?php } ?>
		
		<link rel="apple-touch-icon" sizes="57x57"   href="/images/icons/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="72x72"   href="/images/icons/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="114x114" href="/images/icons/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="/images/icons/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="/images/icons/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="/images/icons/apple-touch-icon-152x152.png">
		
		<link href="/images/icons/startup-iphone-320x460.jpg" rel="apple-touch-startup-image" media="(device-width: 320px)">
		<link href="/images/icons/startup-iphone4-640x920.jpg" rel="apple-touch-startup-image" media="(device-width: 320px) and (-webkit-min-device-pixel-ratio: 2)">
		<link href="/images/icons/startup-iphone5-640x1096.jpg" rel="apple-touch-startup-image" media="(device-width: 320px) and (device-height: 568px) and (-webkit-min-device-pixel-ratio: 2)">
		<link href="/images/icons/ipad-portrait-768x1004.jpg" rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait)">
		<link href="/images/icons/ipad-landscape-1024x748.jpg" rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape)">
		<link href="/images/icons/ipad-retina-portrait-1536x2008.jpg" rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)">
		<link href="/images/icons/ipad-retina-landscape-2048x1496.jpg" rel="apple-touch-startup-image" media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)">
		
		<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0">
		<meta name="apple-mobile-web-app-title" content="<?php bloginfo('name') ?>">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		
		<meta name="description" content="<?php echo $excerpt; ?>">
		<?php
		
		if(!get_option('blog_public')) {
			echo '<meta name="robots" content="noindex, nofollow">';			
		} else if(!$wp_query->is_single && !$wp_query->is_singular && !is_front_page()) {
			echo '<meta name="robots" content="noindex, follow">';
		}
		
		?>
		<?php if(isset($site_options['fb_app_id']) && $site_options['fb_app_id']) { ?>
		
		<meta property="fb:app_id" content="<?php echo $site_options['fb_app_id'] ?>">
		<?php } ?>
		<?php if(isset($site_options['fb_admin_id']) && $site_options['fb_admin_id']) { ?>
		<?php foreach(explode(',', $site_options['fb_admin_id']) as $fb_admin_id) { ?>
		
		<meta property="fb:admins" content="<?php echo trim($fb_admin_id) ?>">
		<?php } ?>
		<?php } ?>
		
		<?php
		
		$card_type = 'website';
		if(is_single() || is_singular()) {
			$card_type = 'article';
		}
		
		?>
		
		<meta property="og:title" content="<?php launchpad_title(true); ?>">
		<meta property="og:description" content="<?php echo $excerpt; ?>">
		<meta property="og:type" content="<?php echo $card_type ?>">
		<meta property="og:url" content="http://<?php echo $_SERVER['HTTP_HOST'] ?><?php the_permalink(); ?>">
		<meta property="og:site_name" content="<?php bloginfo('name') ?>">
		<?php
		
		if(has_post_thumbnail()) {
			$thumbnail = get_post_thumbnail_id();
			$thumbnail = wp_get_attachment_image_src($thumbnail, 'opengraph');
			if($thumbnail) {
				?>
				
		<meta property="og:image" content="http://<?php echo $_SERVER['HTTP_HOST'] ?><?php echo $thumbnail[0] ?>">
		<meta property="og:image:width" content="<?php echo $thumbnail[1] ?>">
		<meta property="og:image:height" content="<?php echo $thumbnail[2] ?>">
				<?php
			}
		}
		
		?>

		<?php
		
		$card_type = 'summary';
		if((is_single() || is_singular()) && has_post_thumbnail()) {
			$card_type = 'summary_with_large_image';
		}
		
		?>

		<meta property="twitter:card" content="<?php echo $card_type ?>">
		<meta property="twitter:url" content="http://<?php echo $_SERVER['HTTP_HOST'] ?><?php the_permalink(); ?>">
		<meta property="twitter:title" content="<?php launchpad_title(true); ?>">
		<meta property="twitter:description" content="<?php echo $excerpt; ?>">
		<?php
		
		if(has_post_thumbnail()) {
			$thumbnail = get_post_thumbnail_id();
			$thumbnail = wp_get_attachment_image_src($thumbnail, 'large'); // Large to hopefully stay under 1MB.
			if($thumbnail) {
				?>

		<meta property="twitter:image" content="http://<?php echo $_SERVER['HTTP_HOST'] ?><?php echo $thumbnail[0] ?>">
		<meta property="twitter:image:width" content="<?php echo $thumbnail[1] ?>">
		<meta property="twitter:image:height" content="<?php echo $thumbnail[2] ?>">
				<?php
			}
		}
		
		?>
		<?php if(isset($site_options['twitter_card_username']) && $site_options['twitter_card_username']) { ?>
		
		<meta property="twitter:site" content="@<?php echo $site_options['twitter_card_username'] ?>">
		<?php } ?>

		<?php if(defined('GA_ID') && GA_ID != '') { ?>

		<script id="google-analytics">
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		  ga('create', '<?php echo GA_ID ?>', 'auto');
		  ga('send', 'pageview');
		</script>
		<?php 
		
		}

		if(stristr($_SERVER['HTTP_HOST'], '.dev') !== false || stristr($_SERVER['HTTP_HOST'], '.git') !== false) {
			echo "<script>window.dev = true;</script>\n";
		}
		
		wp_head(); 
		
		
		?>

	</head>
	<body <?php body_class('no-js'); ?> data-ajax="<?php echo $ajax; ?>">
		<script>document.body.className = document.body.className.replace(/no-js/g, 'js');</script>
		<!--[if IE 9]><span class="msie-9"></span><![endif]-->
		<!--[if IE 8]><span class="msie-8"></span><![endif]-->
		<a href="#main" id="skip-to-content">Skip to Content</a>
		<header id="header" role="banner">
			<h1 id="logo"><a href="/"><?php bloginfo('name') ?></a></h1>
		</header>
		<nav id="navigation" role="navigation">
			<a href="#navigation" class="hamburger">Show Menu</a>
			<a href="#header" class="hamburger">Hide Menu</a>
			<?php launchpad_wp_nav_menu(array('theme_location' => 'primary', 'menu_class' => 'nav-header', 'container' => false)); ?>
		</nav>
		<section id="main" class="main" role="main" aria-live="polite" aria-relevant="text">
