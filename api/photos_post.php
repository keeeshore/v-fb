<?php
session_start();
include_once 'sessionChecker.php';
require_once("./config.php");
include_once("common.php");

extract($_POST);
extract($_GET);

//$dt = '11-08-2017, 06:04';
//echo strtotime("11-08-2017 06:04");
//echo date('Y-m-d H:i:s', strtotime("11-08-2017 06:04"));
//echo file_get_contents('php://input'); //WORKING

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');


$result = json_decode(file_get_contents('php://input'), true);

$photosArr = array();
$isSuccess = true;
$albumId = $result['albumId'];

if (is_array($result['photos']) || is_object($result['photos'])) { 

	foreach ($result['photos'] as $key => $value) {
			
		$name = mysql_real_escape_string($value['name']);
		$createdTime = date('Y-m-d H:i:s', strtotime($value['createdTime']));
		$uid = $value['id'];
		$source = $IMG_PHOTOS_DIR.'/albums/'.$albumId.'/default.jpg';
		$mode = 'ADD';

		//C:/workspace/v-fb/photos-assets/ 808322362620389 / 1353050738147546.jpg

		//echo "1-----".$IMG_PHOTOS_DIR."\r\n"; 
		if (file_exists($IMG_RELATIVE_PATH.$IMG_PHOTOS_DIR)) {
			//echo 'FILE IMG_PHOTOS_DIR EXITS:ROOT>'.$IMG_PHOTOS_DIR.'\r\n';
		} else if (mkdir($IMG_RELATIVE_PATH.$IMG_PHOTOS_DIR , 0777)) {
			//echo 'MAKE IMG_PHOTOS_DIR SUCCESSFUL:ROOT>'.$IMG_PHOTOS_DIR.'\r\n';
		}

		//if (file_exists($IMG_PHOTOS_DIR) || mkdir($IMG_PHOTOS_DIR , 0777)) {

			//echo "2-----".$IMG_PHOTOS_DIR."\r\n"; 

			if ($value['source'] && $value['source'] !== '') {
				
				$PHOTO_ALBUM_ID_DIR = $IMG_RELATIVE_PATH.$IMG_PHOTOS_DIR.'/'.$albumId;
				$source = $PHOTO_ALBUM_ID_DIR.'/'.$uid.'.jpg';
				$fbImgSource = $value['source'];

				//echo "3-----PHOTO_ALBUM_ID_DIR = ".$PHOTO_ALBUM_ID_DIR." , source = ".$source."\r\n"; 

				if (file_exists($PHOTO_ALBUM_ID_DIR)) {
					//echo 'FILE PHOTO_ALBUM_ID_DIR EXITS:ROOT>'.$PHOTO_ALBUM_ID_DIR.'\r\n';
				} else if (mkdir($PHOTO_ALBUM_ID_DIR , 0777)) {
					//echo 'MAKE PHOTO_ALBUM_ID_DIR SUCCESSFUL:ROOT>'.$PHOTO_ALBUM_ID_DIR.'\r\n';
				}
				saveImage($fbImgSource, $source);

				/*if (file_exists($PHOTO_ALBUM_ID_DIR) || mkdir($PHOTO_ALBUM_ID_DIR , 0777)) {
					//echo "4-----fbImgSource = ".$fbImgSource." , source = ".$source."\r\n"; 
					saveImage($fbImgSource, $source);
				} else {
					die('Failed to saveImage to...'.$PHOTO_ALBUM_ID_DIR);
				}*/

			}

		//} else {
		//	die('Failed to create folders...'.$IMG_PHOTOS_DIR);
		//}

		$getSql = "SELECT * FROM $DB_NAME.`photos` WHERE `photos`.`uid` = '$uid' AND `photos`.`albumid` = '$albumId'";
		$getResult = mysql_query($getSql);

		
		if (mysql_affected_rows() != 0) {

			$mode = 'MODIFY';
			$sql = "UPDATE $DB_NAME.`photos` SET `name` = '$name', `source` = '$source', `albumid` = '$albumId', `createdtime` = '$createdTime' WHERE `photos`.`uid` = '$uid'";

		} else {

			$mode = 'ADD';
			$sql = "INSERT INTO $DB_NAME.`photos` (`id`, `name`, `source`, `createdtime`, `albumid`, `uid`) VALUES ('', '$name', '$source', '$createdTime', '$albumId', '$uid')";
			

		}

		//echo "END------".$IMG_PHOTOS_DIR."\r\n"; 
		
		//$sql = "INSERT INTO $DB_NAME.`photos` (`id`, `name`, `source`, `createdtime`, `albumId`, `uid`) VALUES ('', '$name', '$source', '$createdTime', '$albumId', '$uid')";		

		$results = mysql_query($sql);

		if (!$result) {
			$photosArr[] = array('uid'=> false, 'mode' => $mode);
			$isSuccess = false;
		} else {
			$photosArr[] = array('uid'=> $uid, 'mode' => $mode);
		}
	}

}


$successObj = array('success' => $isSuccess, 'photos'=> $photosArr);
print_r(json_encode($successObj));


?>