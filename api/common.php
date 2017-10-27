<?php

	$IMG_ROOT = $_SERVER['DOCUMENT_ROOT'];
	$IMG_EVENTS_DIR = '../events-assets';
	$IMG_POSTS_DIR = '../posts-assets';
	$IMG_PHOTOS_DIR = '../photos-assets';

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true");
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Access-Control-Max-Age: 1000');
	header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
	header('Content-type: application/json');


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