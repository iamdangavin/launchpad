<?php
/**
 * .htaccess Related Functions
 *
 * Anything to do with editing the .htaccess file goes here.
 *
 * @package 	Launchpad
 * @since		1.0
 */


/**
 * Create rewrite rules
 *
 * Assigns short short absolute URL paths to make theming easier.
 * This is modified from the Roots theme.
 *
 * @param		string $content
 * @since		1.0
 */
function launchpad_rewrite_rules($content) {
	global $wp_rewrite;
	
	// WP Rewrites need the '/' removed.
	$tmp_theme = substr(THEME_PATH, 1);
	$tmp_child_theme = substr(CHILD_THEME_PATH, 1);
	
	// Set the rules we need.
	$add_rewrite = array(
		'favicon.ico' => $tmp_child_theme . '/favicon.ico',
		'css/(.*)' => $tmp_child_theme . '/css/$1',
		'sass/(.*)' => $tmp_child_theme . '/sass/$1',
	  	'js/(.*)' => $tmp_child_theme . '/js/$1',
	  	'images/(.*)' => $tmp_child_theme . '/images/$1',
	  	'support/(.*)' => $tmp_theme . '/support/$1',
		'api/(.*)' => 'wp-admin/admin-ajax.php',
		'(.*)/pdf/' => 'wp-admin/admin-ajax.php?action=generate_pdf&file=$1',
		'download/(.*)' => 'wp-admin/admin-ajax.php?action=download&file=$1',
		'manifest.appcache' => 'wp-admin/admin-ajax.php?action=cache_manifest',
		'sitemap-(\d*).xml/?' => 'wp-admin/admin-ajax.php?action=sitemap&sitemap=$1',
		'sitemap-index\.xml/?' => 'wp-admin/admin-ajax.php?action=sitemap',
	);
	
	// Apply filters so the developer can change them.
	$add_rewrite = apply_filters('launchpad_rewrite_rules', $add_rewrite);
	
	// Apply the rules.
	$wp_rewrite->non_wp_rules = array_merge($wp_rewrite->non_wp_rules, $add_rewrite);
	return $content;
}


/**
 * Try to Clean Up Sub-folder Theme Paths
 *
 * @param		string $content
 * @since		1.0
 */
function launchpad_adjust_rewrite_rules($content) {
	global $wp_rewrite, $site_options;
	
	// Check to see if the function exists.
	// For some reason it doesn't on theme activation.
	if(!function_exists('extract_from_markers')) {
		return $content;
	}
	
	// Get the path to the htaccess file.
	$home_path = function_exists('get_home_path') ? get_home_path() : ABSPATH;
	$htaccess_file = $home_path . '.htaccess';
	
	// If we can edit the htaccess file in one way or another...
	if(
		(!file_exists($htaccess_file) && is_writable($home_path)) || 
		is_writable($htaccess_file)
	) {
		// 
		$rewrite_rules = extract_from_markers($htaccess_file, 'WordPress');
		$rewrite_base = '';
		
		// Loop all the rewrites we got out of the markers.
		foreach($rewrite_rules as $rewrite_key => $rewrite_rule) {
			
			// If this is the RewriteBase setting, store the base.
			if(stristr($rewrite_rule, 'RewriteBase') !== false) {
				$rewrite_base = trim(substr($rewrite_rule, 13));
			
			// If there is a base and it appears on the site, we need to remove it.
			// WordPress duplicates the subfolder path.
			} else if($rewrite_base && substr_count($rewrite_rule, $rewrite_base)) {
				$rewrite_rule = preg_replace('|' . $rewrite_base . '|', '/', $rewrite_rule, 1);
				$rewrite_rule = preg_replace('|//+|', '/', $rewrite_rule);
				$rewrite_rules[$rewrite_key] = $rewrite_rule;
			}
		}
		
		// Also do it to the content we passed.
		foreach($content->non_wp_rules as $rewrite_key => $rewrite_rule) {
			$content->non_wp_rules[$rewrite_key] = str_replace($rewrite_base, '', $rewrite_rule);
		}
		
		// Write it back out.
		insert_with_markers($htaccess_file, 'WordPress', $rewrite_rules);
	}
	
	return $content;
}

if(is_admin() && (!defined('MULTISITE') || MULTISITE === false)) {
	add_action('generate_rewrite_rules', 'launchpad_rewrite_rules');
	add_action('generate_rewrite_rules', 'launchpad_adjust_rewrite_rules', 9999);
}



/**
 * Include HTML5 Boilerplate in HTACCESS
 * 
 * This is modified from the Roots theme.
 *
 * @param		string $content
 * @since		1.0
 */
function launchpad_add_h5bp_htaccess($content) {
	global $wp_rewrite, $site_options;
	
	// Check to see if the function exists.
	// For some reason it doesn't on theme activation.
	if(!function_exists('extract_from_markers')) {
		return $content;
	}
	
	// Get the path to the htaccess file.
	$home_path = function_exists('get_home_path') ? get_home_path() : ABSPATH;
	$htaccess_file = $home_path . '.htaccess';
	
	// If we can edit the htaccess file in one way or another...
	if(
		(!file_exists($htaccess_file) && is_writable($home_path)) || 
		is_writable($htaccess_file)
	) {
		// Extract the boilerplate.
		$h5bp_rules = extract_from_markers($htaccess_file, 'HTML5 Boilerplate');
		
		// If there are no Boilerplate Rules and the user wants them, add them.
		if (!$h5bp_rules && $site_options['html5_bp']) {
			$filename = $_SERVER['DOCUMENT_ROOT'] . '/' . THEME_PATH . '/support/H5BPv4.3_htaccess';
			$boilerplate_rules = extract_from_markers($filename, 'HTML5 Boilerplate');
			// Update the HTACCESS file.
			insert_with_markers($htaccess_file, 'HTML5 Boilerplate', $boilerplate_rules);
		
		// If there are Boilerplate rules and the user doesn't want them, remove them.
		} else if($h5bp_rules  && !$site_options['html5_bp']) {
			$boilerplate_rules = '';
			// Update the HTACCESS file.
			insert_with_markers($htaccess_file, 'HTML5 Boilerplate', $boilerplate_rules);
		}
	}
	
	return $content;
}
if(is_admin() && (!defined('MULTISITE') || MULTISITE === false)) {
	add_action('generate_rewrite_rules', 'launchpad_add_h5bp_htaccess');
}