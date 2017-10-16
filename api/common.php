<?php

	$IMG_ROOT = $_SERVER['DOCUMENT_ROOT'];
	$IMG_EVENTS_DIR = '/events-assets';
	$IMG_POSTS_DIR = '/posts-assets';
	$IMG_PHOTOS_DIR = '/photos-assets';



	function saveImage($inPath,$outPath) { 
		//Download images from remote server
		$in = fopen($inPath, "rb");
		$out = fopen($_SERVER['DOCUMENT_ROOT'].$outPath, "wb");
		while ($chunk = fread($in,8192)) {
			fwrite($out, $chunk, 8192);
		}
		fclose($in);
		fclose($out);
	}

?>