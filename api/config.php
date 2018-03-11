<?php

	if ($_SERVER['SERVER_NAME'] == 'localhost') {
		
		$DEV_ENV = true;
		$HOST_URL = "http://localhost:3131";
		$DB_NAME = "kisho2au_vimonisha";		
		$conn=mysql_connect("localhost", "root", "") or die("Could not connect to database");

		//$DB_NAME = "vimonisha";
		//$conn = mysql_connect("vimonisha-db.c94supyp7kgw.ap-southeast-2.rds.amazonaws.com:3306", "kishore", "aws123K!shore") or die("Could not connect to database");

		$db = mysql_select_db($DB_NAME, $conn);
	
	} else {
		
		$DEV_ENV = false;
		$HOST_URL = "http://ec2-52-64-110-213.ap-southeast-2.compute.amazonaws.com";
		//$DB_NAME = "kisho2au_vimonisha";
		//$conn=mysql_connect("localhost:3306", "kisho2au_kishore", "br123K!shore") or die("Could not connect to database");

		$DB_NAME = "vimonisha";
		$conn = mysql_connect("vimonisha-db.c94supyp7kgw.ap-southeast-2.rds.amazonaws.com:3306", "kishore", "aws123K!shore") or die("Could not connect to database");

		$db=mysql_select_db($DB_NAME, $conn);
		
	}


	$imgRootDir = $_SERVER['DOCUMENT_ROOT'];
	$imgEventsDir = $imgRootDir.'/events';
	$imgPhotosDir = $imgRootDir.'/photos';
	$imgPostsDir = $imgRootDir.'/posts';
	
	
 ?>