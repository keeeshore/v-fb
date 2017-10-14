<?php

ob_start();
require_once("./config.php");

session_start();
include_once 'sessionChecker.php';

$sql = "SELECT * FROM $DB_NAME.`events` ORDER BY `events`.`endtime` DESC";
$result = mysql_query($sql);
$eventsArr = array();

while($row=mysql_fetch_array($result)) {
	
	$id = $row['id'];
	$name = $row['name'];
	$description = $row['description'];
	$starttime = $row['starttime'];
	$endtime = $row['endtime'];
	$cover = $row['cover'];
	$uid = $row['uid'];
	
	$cover = array('source' => $cover);
	
	$eventsArr[] = array('id' => $id , 'name' => $name , 'description' => $description , 'uid' => $uid, 'startTime' => $starttime, 'endTime' => $endtime, 'cover' => $cover);	
}

echo json_encode(array( 'events' => $eventsArr ));

?>