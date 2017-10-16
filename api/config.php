<?php

	if ($_SERVER['SERVER_NAME'] == 'localhost') {
		
		$DEV_ENV = true;
		$HOST_URL = "http://localhost:1023/";
		$DB_NAME = "vimonisha";
		$conn=mysql_connect("localhost", "root", "") or die("Could not connect to database");
		$db=mysql_select_db($DB_NAME, $conn);
	
	} else {
		
		$DEV_ENV = false;
		$HOST_URL = "http://kishorebalan.com/";
		$DB_NAME = "kisho2au_vimonisha";
		$conn=mysql_connect("localhost:3306", "kisho2au_kishore", "br123K!shore") or die("Could not connect to database");
		$db=mysql_select_db($DB_NAME, $conn);
		
	}


	$imgRootDir = $_SERVER['DOCUMENT_ROOT'].'/data';
	$imgEventsDir = $imgRootDir.'/events';
	$imgPhotosDir = $imgRootDir.'/photos';
	$imgPostsDir = $imgRootDir.'/posts';
	
	
 ?>