<?php

/**
 * API
 *
 * Handles the AJAX API calls for the basic functionality of the front end.
 *
 * @package 	Launchpad
 * @since   	Version 1.0
 */


/**
 * Sample API Call
 *
 * @since   	Version 1.0
 */
function launchpad_hello_world() {
	echo json_encode('Hello, World!');
	exit;
}
add_action('wp_ajax_hello_world', 'launchpad_hello_world');
add_action('wp_ajax_nopriv_hello_world', 'launchpad_hello_world');


/**
 * Simple Test for User Logged In
 *
 * @since   	Version 1.0
 */
function launchpad_user_logged_in() {
	header('Content-type: application/json');
	echo json_encode(is_user_logged_in());
	exit;
}
add_action('wp_ajax_user_logged_in', 'launchpad_user_logged_in');
add_action('wp_ajax_nopriv_user_logged_in', 'launchpad_user_logged_in');

/**
 * Generate an App Cache Manifest
 *
 * @since   	Version 1.0
 */
function launchpad_cache_manifest() {
	$site_options = get_option('launchpad_site_options', '');
	
	$file_max_size = 256000;
	$cache_max_size = 52428800;
	
	$total_cache_size = 0;
	
	$file_list = array();
	$latest = filemtime(__FILE__);
	
	// Locations for images and CSS.
	$paths = array(
			'/' . THEME_PATH . '/css/' => '/css/',
			'/' . THEME_PATH . '/js/' => '/js/',
			'/' . THEME_PATH . '/images/' => '/images/'
		);
	
	// Load all the images and CSS.
	foreach($paths as $path => $rewrite_path) {
		$path_local = $_SERVER['DOCUMENT_ROOT'] . $path;
		if($rewrite_path === '/images/') {
			$files = scandir($path_local);			
		} else {
			$files = launchpad_scandir_deep($path_local);
		}
		if($files) {
			foreach($files as $file) {
				$file_cache_size = filesize($path_local . $file);
				
				if(
					substr($file, 0, 1) !== '.' && 
					!is_dir($path_local . $file) && 
					!preg_match('/.*\.(psd|map)$/', $file) &&
					$file_cache_size <= $file_max_size &&
					$total_cache_size+$file_cache_size < $cache_max_size
				) {
					$file_list[] = $rewrite_path . $file;
					$total_cache_size += $file_cache_size;
					if(filemtime($path_local . $file) > $latest) {
						$latest = filemtime($path_local . $file);
					}
				}
			}
		}
	}
	
	// Get the list of custom post types.
	$post_types = get_post_types(
			array(
				'public' => true,
				'publicly_queryable' => true,
				'_builtin' => false
			)
		);
		
	$post_types = array_values($post_types);
	$post_types[] = 'page';
	
	// Query for all custom post types and pages.
	$q = new WP_Query(
			array(
				'post_type' => $post_types,
				'posts_per_page' => -1
			)
		);
	foreach($q->posts as $p) {
		$pl = get_permalink($p->ID);
		
		// Get the assets out of the page.
		$output = file_get_contents($pl);
		$file_cache_size = strlen($output);
		
		if(
			$file_cache_size && 
			$file_cache_size <= $file_max_size &&
			$total_cache_size+$file_cache_size < $cache_max_size
		) {
			$file_list[] = $pl;
			$total_cache_size += $file_cache_size;
		
			preg_match_all('/src=[\'\"](.*?)[\'\"]/', $output, $matches);
			if($matches[1]) {
				foreach($matches[1] as $asset_path) {
					if(!in_array($asset_path, $file_list)) {
						if(substr($asset_path, 0, 1) === '/') {
							$file_cache_size = filesize($_SERVER['DOCUMENT_ROOT'] . $asset_path);
						} else {
							$file_cache_size = strlen(file_get_contents($asset_path));
						}
						
						if(
							$file_cache_size && 
							$file_cache_size <= $file_max_size &&
							$total_cache_size+$file_cache_size < $cache_max_size
						) {
							$file_list[] = $asset_path;
							$total_cache_size += $file_cache_size;
						}
					}
				}
			}
		}
		
		$pl = explode('/', $pl);
		array_pop($pl);
		while(count($pl) > 3) {
			array_pop($pl);
			$tmp_pl = implode('/', $pl) . '/';
			if(!in_array($tmp_pl, $file_list)) {
				$output = file_get_contents($tmp_pl);
				$file_cache_size = strlen($output);
				if(
					$file_cache_size && 
					$file_cache_size <= $file_max_size &&
					$total_cache_size+$file_cache_size < $cache_max_size
				) {
					$file_list[] = $tmp_pl;
					$total_cache_size += $file_cache_size;
				}
			}
		}
		if(strtotime($p->post_modified) > $latest) {
			$latest = strtotime($p->post_date);
		}
	}
	
	// Get 100 posts.
	$q = new WP_Query(
			array(
				'post_type' => 'post',
				'posts_per_page' => 100
			)
		);
	foreach($q->posts as $p) {
		$pl = get_permalink($p->ID);
		$output = file_get_contents($pl);
		$file_cache_size = strlen($output);
		
		if(
			$file_cache_size && 
			$file_cache_size <= $file_max_size &&
			$total_cache_size+$file_cache_size < $cache_max_size
		) {
			$file_list[] = $pl;
			$total_cache_size += $file_cache_size;
			
			// Get the assets out of the post.
			$output = file_get_contents($pl);
			preg_match_all('/src=[\'\"](.*?)[\'\"]/', $output, $matches);
			if($matches[1]) {
				foreach($matches[1] as $asset_path) {
					if(!in_array($asset_path, $file_list)) {
						if(substr($asset_path, 0, 1) === '/') {
							$file_cache_size = filesize($_SERVER['DOCUMENT_ROOT'] . $asset_path);
						} else {
							$file_cache_size = strlen(file_get_contents($asset_path));
						}
						
						if(
							$file_cache_size && 
							$file_cache_size <= $file_max_size &&
							$total_cache_size+$file_cache_size < $cache_max_size
						) {
							$file_list[] = $asset_path;
							$total_cache_size += $file_cache_size;
						}
					}
				}
			}
			
			$pl = explode('/', $pl);
			array_pop($pl);
			while(count($pl) > 3) {
				array_pop($pl);
				$tmp_pl = implode('/', $pl) . '/';
				if(!in_array($tmp_pl, $file_list)) {
					$output = file_get_contents($tmp_pl);
					$file_cache_size = strlen($output);
					if(
						$file_cache_size && 
						$file_cache_size <= $file_max_size &&
						$total_cache_size+$file_cache_size < $cache_max_size
					) {
						$file_list[] = $tmp_pl;
						$total_cache_size += $file_cache_size;
					}
				}
			}
		}
		if(strtotime($p->post_modified) > $latest) {
			$latest = strtotime($p->post_date);
		}
	}
	
	// Get enough archive pages to support the posts we got.
	$posts_page = get_option('page_for_posts');
	if($posts_page) {
		$posts_page = get_permalink($posts_page);
		
		$output = file_get_contents($posts_page);
		$file_cache_size = strlen($output);
		if(
			$file_cache_size && 
			$file_cache_size <= $file_max_size &&
			$total_cache_size+$file_cache_size < $cache_max_size
		) {
			$file_list[] = $posts_page;
			$total_pages = ceil($q->found_posts/get_option('posts_per_page'));
			for($i = 1; $i < $total_pages; $i++) {
				$tmp_pl = $posts_page . 'page/' . $i . '/';
				
				$output = file_get_contents($tmp_pl);
				$file_cache_size = strlen($output);
				if(
					$file_cache_size && 
					$file_cache_size <= $file_max_size &&
					$total_cache_size+$file_cache_size < $cache_max_size
				) {
					$file_list[] = $tmp_pl;
					$total_cache_size += $file_cache_size;
				}
			}
		}
	}
	
	sort($file_list);
	
	$total_cache_size_bytes = '';
	
	$size = 'bytes';
	$sizes = array('kilobytes', 'megabytes');
	if($total_cache_size/1024 > 0) {
		$total_cache_size_bytes = '(' . $total_cache_size . ' bytes)';
		while($total_cache_size/1024 > 1 && $sizes) {
			$size = array_shift($sizes);
			$total_cache_size = $total_cache_size / 1024;
		}
	}
	
	$total_cache_size = number_format($total_cache_size, 3);
	
	//header('Content-type: text/plain'); // Use this for debugging.
	header('Content-type: text/cache-manifest');
	header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', strtotime('+1 second')));
	
	echo "CACHE MANIFEST\n\n";
	echo "# Last Modified: " . date('Y-m-d H:i:s T', $latest) . " \n";
	echo "# Total Cache Size: $total_cache_size $size $total_cache_size_bytes \n\n";
	
	echo "CACHE:\n";
	echo implode("\n", array_unique($file_list));
	echo "\n\n";
	
	echo "NETWORK:\n*\n\n";
	echo "FALLBACK:\n";
	echo "/uploads/ /support/offline.png\n";
	echo "/images/ /support/offline.png\n";
	echo "/img/ /support/offline.png\n";
	echo "/ /support/offline.html\n";
	exit;
}
add_action('wp_ajax_cache_manifest', 'launchpad_cache_manifest');
add_action('wp_ajax_nopriv_cache_manifest', 'launchpad_cache_manifest');


/**
 * Obsolete an App Cache Manifest
 *
 * @since   	Version 1.0
 */
function launchpad_cache_manifest_obsolete() {
	header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', strtotime('-1 month')));
	http_response_code(404);
	exit;
}
add_action('wp_ajax_cache_manifest_obsolete', 'launchpad_cache_manifest_obsolete');
add_action('wp_ajax_nopriv_cache_manifest_obsolete', 'launchpad_cache_manifest_obsolete');
