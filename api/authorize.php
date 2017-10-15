<?php

	ob_start();
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
	session_start();

	if ($value && $value['userName'] && $value['password']) {
		
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

		if ($record && $record > 0) {
			$_SESSION['login_user'] = $userName.$password;
			//header("Location:".$HOST_URL."/admin/events?user=".$_SESSION['login_user']);
			//echo json_encode(array('success' => $_SESSION['login_user'], 'error' => $error));
			//exit();
			$isLoggedIn = true;
		} else {
			unset($_SESSION['login_user']);
			$error = 'Unauthorized Error';
			//header("Location:".$HOST_URL."/login?error=Login-fail");
			//exit();
		}

	} else {
		$error = 'Validation Error';
	}

	echo json_encode(array('success' => $isLoggedIn, 'error' => $error));


?>