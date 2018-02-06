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
	$recaptha = $_POST["g-recaptcha-response"];


	$url = 'https://www.google.com/recaptcha/api/siteverify';
	$secret = '6Lelvj8UAAAAANHT_JxRUVSka6Dz5NPl74JLeeX_';

	$myvars = 'secret=' . $secret . '&response=' . $recaptha;

	$ch = curl_init($url);
	curl_setopt( $ch, CURLOPT_POST, 1);
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $myvars);
	curl_setopt( $ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt( $ch, CURLOPT_HEADER, 0);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1);

	$response = curl_exec($ch);

	//$json = $response;

	$result = json_decode($response);
	$success = false;

	if ($result) {
	  	$success = $result->success;
	}
	//echo json_encode(array( 'result' => $result->success ));
	//exit;

	//if ($value && $value['userName'] && $value['password']) {
	if ($userName && $password && $success) {

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

			setcookie($cookieName, $userName, 0); // 86400 = 1 day	
			header("Location:".$HOST_URL."/admin/update-all");
			exit();
			
		} else {

			$error = 'unauthorized_error';
			unset($_SESSION['login_user']);
			setcookie($cookieName, '', 0); 
			header("Location:".$HOST_URL."/admin/login?error=".$error);

			//echo json_encode(array('success' => $isLoggedIn, 'error' => $error));
			//var_dump($_SESSION);
			exit();
		}

	}

	if (!$success) {
		$error = 'captcha_error';
	} else {
		$error = 'validation_error';
	}

	unset($_SESSION['login_user']);	
	header("Location:".$HOST_URL."/admin/login?error=".$error);
	exit();

?>