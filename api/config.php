<?php

	if ($_SERVER['SERVER_NAME'] == 'localhost') {
		
		$DEV_ENV = true;
		$HOST_URL = "http://localhost:3131/";
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
	
	
 ?>