<?php
ob_start();
require_once("./config.php");

session_start();
include_once 'sessionChecker.php';

extract($_POST);
extract($_GET);

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');

$isSuccess = false;
$isFileDeleted = false;

$result = json_decode(file_get_contents('php://input'), true);
	
//$name = $result['name'];
//$description = '';
//$startTime = date('Y-m-d H:i:s', strtotime($result['startTime']));
//$endTime = date('Y-m-d H:i:s', strtotime($result['endTime']));
$fullPicture = $result['fullPicture'];
$id = $result['id'];

if (file_exists($fullPicture)) {	
    if (unlink($fullPicture)) {
		$isSuccess = true;
		$isFileDeleted = true;
	}	
}

$sql = "DELETE FROM $DB_NAME.`posts` WHERE `posts`.`id` = '$id'";
$results = mysql_query($sql);

$successObj = array('success' => $isSuccess, 'isFileDeleted' => $isFileDeleted);
print_r(json_encode($successObj));
//header('Location:posts_get.php');


?>