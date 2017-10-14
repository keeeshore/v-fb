<?php
ob_start();
require_once("./config.php");

session_start();
include_once 'sessionChecker.php';

extract($_POST);
extract($_GET);

//$dt = '11-08-2017, 06:04';
//echo strtotime("11-08-2017 06:04");
//echo date('Y-m-d H:i:s', strtotime("11-08-2017 06:04"));
//echo file_get_contents('php://input'); //WORKING

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

$photosArr = array();
$isSuccess = true;
$albumId = $result['albumId'];

foreach ($result['photos'] as $key => $value) {
		
	$name = $value['name'];
	$createdTime = date('Y-m-d H:i:s', strtotime($value['createdTime']));
	$uid = $value['id'];
	
	if ($value['source'] && $value['source'] !== '') {
		$source = 'albums/'.$albumId.'/'.$uid.'.jpg';
		if (file_exists('albums/'.$albumId)) {
			saveImage($value['source'], $source);
		} else if (mkdir('albums/'.$albumId , 0777)) {
			saveImage($value['source'], $source);
		}
	} else {
		$source = 'albums/'.$albumId.'/default.jpg';
	}
	
	$sql = "INSERT INTO $DB_NAME.`photos` (`id`, `name`, `source`, `createdtime`, `albumId`, `uid`) VALUES ('', '$name', '$source', '$createdTime', '$albumId', '$uid')";
	

	$results = mysql_query($sql);	
	if (!$result) {
		$photosArr[] = array('uid'=> false);
	} else {
		$photosArr[] = array('uid'=> $uid);
	}
}

$successObj = array('success' => true, 'photos'=> $photosArr);
print_r(json_encode($successObj));


?>