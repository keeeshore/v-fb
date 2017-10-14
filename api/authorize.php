<?php

	ob_start();
	require_once("config.php");	

	//$value = json_decode(file_get_contents('php://input'), true);
	//$userName = $value['userName'];
	//$password = $value['password'];
	session_start();
	//var_dump($_SESSION);
	//exit;

	extract($_POST);

	$error = 'None';
	$sql = "SELECT * FROM $DB_NAME.`users` WHERE `username` = '$userName' AND `password` = '$password'";
	$result = mysql_query($sql);
	$record = mysql_num_rows($result);

	$isLoggedIn = false;

	if ($record && $record > 0) {
		$_SESSION['login_user'] = $userName.$password;
		header("Location:".$HOST_URL."/admin/events?user=".$_SESSION['login_user']);
		exit();
		$isLoggedIn = true;
	} else {	
		unset($_SESSION['login_user']);
		$error = 'SESSION IS UNSET';
		header("Location:".$HOST_URL."/login?error=Login-fail");
		exit();
	}

	//echo json_encode(array('success' => $_SESSION['login_user'], 'error' => $error));


?>