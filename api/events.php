<?php
ob_start();
require_once("./config.php");
	
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header('Content-type: application/json');

/*session_start();
if(!$_SESSION['admin_login']) {
	header("Location:index.php?feedback=Unauthorized access!!");
	exit;
}*/

extract($_POST);
extract($_GET);

//$dt = '11-08-2017, 06:04';
//echo strtotime("11-08-2017 06:04");
//echo date('Y-m-d H:i:s', strtotime("11-08-2017 06:04"));
//echo file_get_contents('php://input'); //WORKING

$result = json_decode(file_get_contents('php://input'), true);

foreach ($result['events'] as $key => $value) {
	
	$description = $value['name'];
	$picture = $value['cover']['source'];
	$id = $value['id'];
	$endTime = date('Y-m-d H:i:s', strtotime($value['endTime']));
	
	$sql = "INSERT INTO $DB_NAME.`posts` (`id`, `description`, `picture`, `uid`, `createdtime`) VALUES ('', '$description', '$picture', '$id', '$endTime')";

	$result = mysql_query($sql);
	print_r($sql);
	//echo $value['picture']['data']['url'];
}



?>