<?php

require_once("./config.php");
include_once("common.php");

$sql = "SELECT * FROM $DB_NAME.`events` ORDER BY `events`.`endtime` DESC";
$result = mysql_query($sql);
$eventsArr = array();

if($result === FALSE) { 
    die(mysql_error()); // TODO: better error handling
}

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