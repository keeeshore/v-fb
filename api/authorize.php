<?php
	session_start(); 
	//ob_start();
	require_once("config.php");	

	$value = json_decode(file_get_contents('php://input'), true);

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true");
	header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
	header('Access-Control-Max-Age: 1000');
	header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
	header('Content-type: application/json');
	
	$error = '';
	$isLoggedIn = false;

	$_SESSION['login_user'] = 'allgood';
	//header("Location:".$HOST_URL."/admin/events?user=".$_SESSION['login_user']);
	//exit();

	if ($value && $value['userName'] && $value['password']) {
		
		//$_SESSION['login_user'] = 'asd';
		//var_dump($_SESSION);
		//exit;	

		$userName = $value['userName'];
		$password = $value['password'];
		

		extract($_POST);

		$error = 'None';
		$sql = "SELECT * FROM $DB_NAME.`users` WHERE `username` = '$userName' AND `password` = '$password'";
		$result = mysql_query($sql);
		$record = mysql_num_rows($result);

		$isLoggedIn = false;
		$cookieName = "loggedIn";
		

		if ($record && $record > 0) {

			$isLoggedIn = true;	
			$_SESSION['login_user'] = 'allgood';

			setcookie($cookieName, $isLoggedIn, 0); // 86400 = 1 day			
			header("Location:".$HOST_URL."admin/login?redirect=/admin/events");

			//echo json_encode(array('success' => $isLoggedIn, 'error' => $error));
			//var_dump($_SESSION);
			//exit();
			
		} else {

			$_COOKIE['loggedIn'] = "false";
			$error = 'Unauthorized Error';

			setcookie($cookieName, $isLoggedIn, 0); 
			header("Location:".$HOST_URL."admin/login?error=Login_failed");

			//echo json_encode(array('success' => $isLoggedIn, 'error' => $error));
			//var_dump($_SESSION);
			//exit();
		}

	} else {

		$error = 'Validation Error';

	}

	//echo json_encode(array('success' => $isLoggedIn, 'error' => $error));
	exit();


?>