<?php

	$IMG_ROOT = $_SERVER['DOCUMENT_ROOT'];
	$IMG_EVENTS_DIR = '../events-assets';
	$IMG_POSTS_DIR = '../posts-assets';
	$IMG_PHOTOS_DIR = '../photos-assets';



	function saveImage ($inPath, $outPath) { 
		//Download images from remote server
		//echo "saveImage-----inPath = ".$inPath."\r\n"; 
		//echo "saveImage-----outPath = ".$outPath."\r\n"; 
		$in = fopen($inPath, "rb");		
		$out = fopen($outPath, "wb");

		while ($chunk = fread($in, 8192)) {
			fwrite($out, $chunk, 8192);
		}

		fclose($in);
		fclose($out);
	}

?>