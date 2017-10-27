<?php
	session_start(); 
	//ob_start();
	require_once("config.php");	
	include_once("common.php");

	$error = '';
	$isLoggedIn = false;

	$_SESSION['login_user'] = 'allgood';
	//header("Location:".$HOST_URL."/admin/events?user=".$_SESSION['login_user']);
	//exit();

	$userName = $_POST["userName"];
	$password = $_POST["password"];

	//if ($value && $value['userName'] && $value['password']) {
	if ($userName && $password) {

		extract($_POST);

		$error = 'None';
		$sql = "SELECT * FROM $DB_NAME.`users` WHERE `username` = '$userName' AND `password` = '$password'";
		$result = mysql_query($sql);
		$record = mysql_num_rows($result);

		$isLoggedIn = false;
		$cookieName = "loggedIn";
		

		if ($record && $record > 0) {

			$isLoggedIn = true;	
			$_SESSION['login_user'] = $userName;

			setcookie($cookieName, 'tttt', 0); // 86400 = 1 day			
			header("Location:".$HOST_URL."/admin/events");
			exit();
			
		} else {

			$error = 'Unauthorized Error';
			unset($_SESSION['login_user']);
			setcookie($cookieName, '', 0); 
			header("Location:".$HOST_URL."/admin/login?error=Login_failed");

			//echo json_encode(array('success' => $isLoggedIn, 'error' => $error));
			//var_dump($_SESSION);
			exit();
		}

	}

	unset($_SESSION['login_user']);
	$error = 'Validation Error';
	header("Location:".$HOST_URL."/admin/login?error=".$error);
	exit();

?>