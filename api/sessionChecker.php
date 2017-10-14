<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	//var_dump($_SESSION);
	
	//REMOVE BELOW IN PROD!!!
if ($_SERVER['SERVER_NAME'] != 'localhost') {
	
	if(!$_SESSION['login_user'] && !$_GET) {
		$httpStatusCode = 403;
		$httpStatusMsg  = 'Unauthorized access!Please login again';
		$phpSapiName    = substr(php_sapi_name(), 0, 3);
		if ($phpSapiName == 'cgi' || $phpSapiName == 'fpm') {
			header('Status: '.$httpStatusCode.' '.$httpStatusMsg);
		} else {
			$protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0';
			header($protocol.' '.$httpStatusCode.' '.$httpStatusMsg);
		}
		echo json_encode(array( 'success' => false, 'message' => $httpStatusMsg ));
		exit;
	}

}



?>
