<?php
session_start();
include_once 'sessionChecker.php';
require_once("./config.php");

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
$cover_source = $result['cover']['source'];
$id = $result['id'];

if (file_exists($cover_source)) {	
    if (unlink($cover_source)) {
		$isSuccess = true;
		$isFileDeleted = true;
	}	
}

$sql = "DELETE FROM $DB_NAME.`events` WHERE `events`.`id` = '$id'";
$results = mysql_query($sql);

$successObj = array('success' => $isSuccess, 'isFileDeleted' => $isFileDeleted);
print_r(json_encode($successObj));
//header('Location:events_get.php');


?>