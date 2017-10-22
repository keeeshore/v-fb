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

$source = $result['source'];
$id = $result['id'];

if (file_exists($source)) {	
    if (unlink($source)) {
		$isFileDeleted = true;
	}	
}

$sql = "DELETE FROM $DB_NAME.`photos` WHERE `photos`.`id` = '$id'";
$results = mysql_query($sql);

if ($sql) {
	$isSuccess = true;
}

$successObj = array('success' => $isSuccess, 'isFileDeleted' => $isFileDeleted);
print_r(json_encode($successObj));
//header('Location:events_get.php');


?>