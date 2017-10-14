<?php
ob_start();
require_once("./config.php");
	
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: POST');
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

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');

$isSuccess = false;

$result = json_decode(file_get_contents('php://input'), true);
	
$name = $result['name'];
$description = $result['description'];
$startTime = date('Y-m-d H:i:s', strtotime($result['startTime']));
$endTime = date('Y-m-d H:i:s', strtotime($result['endTime']));
$cover_source = $result['cover']['source'];
$uid = $result['uid'];

if (file_exists($cover_source)) {	
    if (unlink($cover_source)) {
		$isSuccess = true;
		$isFileDeleted = true;
	}	
}


$sql = "UPDATE `vimonisha`.`events` SET `uid` = '$uid',`name` = '$name',`description` = '$description',`starttime` = '$startTime', `endtime` = '$endTime', `cover` = '$cover_source' WHERE `events`.`id` ='$id' LIMIT 1";
$results = mysql_query($sql);

$successObj = array('success' => $sql);
print_r(json_encode($successObj));
//header('Location:events_get.php');


?>