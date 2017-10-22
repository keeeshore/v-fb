<?php
session_start();
include_once 'sessionChecker.php';
require_once("./config.php");
include_once 'common.php';

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
			
		$name = $value['name'];
		$createdTime = date('Y-m-d H:i:s', strtotime($value['createdTime']));
		$uid = $value['id'];
		$source = $IMG_PHOTOS_DIR.'/albums/'.$albumId.'/default.jpg';

		//C:/workspace/v-fb/photos-assets/ 808322362620389 / 1353050738147546.jpg

		//echo "1-----".$IMG_PHOTOS_DIR."\r\n"; 
		

		if (file_exists($IMG_PHOTOS_DIR) || mkdir($IMG_PHOTOS_DIR , 0777)) {

			//echo "2-----".$IMG_PHOTOS_DIR."\r\n"; 

			if ($value['source'] && $value['source'] !== '') {
				
				$PHOTO_ALBUM_ID_DIR = $IMG_PHOTOS_DIR.'/'.$albumId;
				$source = $PHOTO_ALBUM_ID_DIR.'/'.$uid.'.jpg';
				$fbImgSource = $value['source'];

				//echo "3-----PHOTO_ALBUM_ID_DIR = ".$PHOTO_ALBUM_ID_DIR." , source = ".$source."\r\n"; 


				if (file_exists($PHOTO_ALBUM_ID_DIR) || mkdir($PHOTO_ALBUM_ID_DIR , 0777)) {
					//echo "4-----fbImgSource = ".$fbImgSource." , source = ".$source."\r\n"; 
					saveImage($fbImgSource, $source);
				}

			}

		}	

		//echo "END------".$IMG_PHOTOS_DIR."\r\n"; 
		
		$sql = "INSERT INTO $DB_NAME.`photos` (`id`, `name`, `source`, `createdtime`, `albumId`, `uid`) VALUES ('', '$name', '$source', '$createdTime', '$albumId', '$uid')";
		

		$results = mysql_query($sql);	
		if (!$result) {
			$photosArr[] = array('uid'=> false);
		} else {
			$photosArr[] = array('uid'=> $uid);
		}
	}

}


$successObj = array('success' => true, 'photos'=> $photosArr);
print_r(json_encode($successObj));


?>