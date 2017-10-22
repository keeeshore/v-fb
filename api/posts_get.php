<?php

ob_start();
require_once("./config.php");


$sql = "SELECT * FROM $DB_NAME.`posts` ORDER BY `posts`.`createdtime` DESC";
$result = mysql_query($sql);
$postsArr = array();

while($row=mysql_fetch_array($result)) {
	
	$id = $row['id'];
	$name = $row['name'];
	$description = $row['description'];
	$fullpicture = $row['fullpicture'];
	$uid = $row['uid'];
	$createdtime = $row['createdtime'];	
		
	$postsArr[] = array('id' => $id , 'name' => $name , 'description' => $description , 'uid' => $uid, 'createdTime' => $createdtime, 'fullPicture' => $fullpicture);	
}

echo json_encode(array( 'posts' => $postsArr ));

?>