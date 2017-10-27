<?php
ob_start();
require_once("./config.php");
include_once("common.php");

extract($_GET);

if (!$_GET) {
	echo json_encode(array( 'success' => false, 'message' => 'NOt a get ??' ));
	exit();
}

$albumId = $_GET['albumId'];

if ($albumId == '') {
	echo json_encode(array( 'success' => false, 'message' => 'No album id exists' ));
	exit();
}

$sql = "SELECT * FROM `photos` WHERE `photos`.`albumid` = '$albumId' ORDER BY `photos`.`createdtime` DESC";
$result=mysql_query($sql);

$photosArr = array();


while($row=mysql_fetch_array($result)) {
	
	$id = $row['id'];
	$uid = $row['uid'];
	$name = $row['name'];
	$createdTime = $row['createdtime'];
	$source = $row['source'];	
	$photosArr[] = array('id' => $id , 'uid' => $uid , 'name' => $name , 'createdTime' => $createdTime, 'source' => $source);
	
}

echo json_encode(array( 'photos' => $photosArr ));

?>