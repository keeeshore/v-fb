<?php
ob_start();
require_once("./config.php");

extract($_POST);
extract($_GET);
	

session_start();
include_once 'sessionChecker.php';



function saveImage($inPath,$outPath) { 
	//Download images from remote server
	$in = fopen($inPath, "rb");
	$out = fopen($outPath, "wb");
	while ($chunk = fread($in,8192)) {
		fwrite($out, $chunk, 8192);
	}
	fclose($in);
	fclose($out);
}

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');

$result = json_decode(file_get_contents('php://input'), true);

$postsArr = array();

$isSuccess = true;

foreach ($result['posts'] as $key => $value) {
	
	$name = $value['name'];
	$description = $value['description'];
	$fullpicture = $value['fullPicture'];
	$createdTime = date('Y-m-d H:i:s', strtotime($value['createdTime']));
	$uid = $value['id'];
	
	if ($value['fullPicture'] !== '') {
		//$cover_source = $value['cover']['source'];
		$pictureSource = 'posts/'.$uid.'.jpg';
		saveImage($value['fullPicture'], $pictureSource);
	} else {
		$pictureSource = 'posts/default.jpg';
	}
	
	$sql = "INSERT INTO $DB_NAME.`posts` (`id`, `name`, `description`, `fullpicture`, `uid`, `createdtime`) VALUES ('', '$name', '$description', '$pictureSource', '$uid', '$createdTime')";

	$results = mysql_query($sql);	
	if (!$result) {
		$postsArr[] = array('uid'=> false);
		//print_r('NO success');
	} else {
		$postsArr[] = array('uid'=> $name);
		//print_r('success');
	}
	//print_r($sql);
	//header('Location:events_get.php');
}

$successObj = array('success' => true, 'posts'=> $postsArr);

print_r(json_encode($successObj));




?>