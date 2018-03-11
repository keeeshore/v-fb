<?php

session_start();
include_once 'sessionChecker.php';

ob_start();
require_once("./config.php");

extract($_POST);
extract($_GET);
	


include_once 'common.php';


$result = json_decode(file_get_contents('php://input'), true);

$postsArr = array();

$isSuccess = true;

if (is_array($result['posts']) || is_object($result['posts'])) {

	foreach ($result['posts'] as $key => $value) {
	
		$name = mysql_real_escape_string($value['name']);
		$description = mysql_real_escape_string($value['description']);
		$fullpicture = $value['fullPicture'];
		$createdTime = date('Y-m-d H:i:s', strtotime($value['createdTime']));
		$uid = $value['id'];
		$pictureSource = $IMG_POSTS_DIR.'/posts-default.jpg';
		$mode = 'NONE';

		$getSql = "SELECT * FROM $DB_NAME.`posts` WHERE `posts`.`uid` = '$uid'";
		$getResult = mysql_query($getSql);

		
		if (mysql_affected_rows() != 0) {
			
			if ($value['fullPicture'] != '') {
				$pictureSource = $IMG_RELATIVE_PATH.$IMG_POSTS_DIR.'/posts-'.$uid.'.jpg';
				
				if (file_exists($IMG_RELATIVE_PATH.$IMG_POSTS_DIR)) {
					//echo 'FILE IMG_POSTS_DIR EXITS:ROOT>'.$IMG_POSTS_DIR;
				} else if (mkdir($IMG_RELATIVE_PATH.$IMG_POSTS_DIR , 0777)) {
					//echo 'MAKE IMG_POSTS_DIR SUCCESSFUL:ROOT>'.$IMG_POSTS_DIR;
				} else {
					//echo 'FAIL TO MAKE IMG_POSTS_DIR :ROOT>'.$IMG_POSTS_DIR;
				}
				saveImage($value['fullPicture'], $pictureSource);

				/*if (file_exists($IMG_POSTS_DIR) || mkdir($IMG_POSTS_DIR , 0777)) {
					saveImage($value['fullPicture'], $pictureSource);
				}*/
			}

			$mode = 'UpDate';
			$sql = "UPDATE $DB_NAME.`posts` SET `name` = '$name', `description` = '$description', `fullpicture` = '$pictureSource', `createdtime` = '$createdTime' WHERE `posts`.`uid` = '$uid' LIMIT 1";
			
			//$successObj = array('data' => mysql_affected_rows());
			$results = mysql_query($sql);


		} else {

			if ($value['fullPicture'] != '') {
				$pictureSource = $IMG_RELATIVE_PATH.$IMG_POSTS_DIR.'/posts-'.$uid.'.jpg';
				
				if (file_exists($IMG_RELATIVE_PATH.$IMG_POSTS_DIR)) {
					//echo 'FILE IMG_POSTS_DIR EXITS:ROOT>'.$IMG_POSTS_DIR;
				} else if (mkdir($IMG_RELATIVE_PATH.$IMG_POSTS_DIR , 0777)) {
					//echo 'MAKE IMG_POSTS_DIR SUCCESSFUL:ROOT>'.$IMG_POSTS_DIR;
				} else {
					//echo 'FAIL TO MAKE IMG_POSTS_DIR :ROOT>'.$IMG_POSTS_DIR;
				}
				saveImage($value['fullPicture'], $pictureSource);

				/*if (file_exists($IMG_POSTS_DIR) || mkdir($IMG_POSTS_DIR , 0777)) {
					saveImage($value['fullPicture'], $pictureSource);
				}*/
			}

			$mode = 'ADD';
			$sql = "INSERT INTO $DB_NAME.`posts` (`id`, `name`, `description`, `fullpicture`, `uid`, `createdtime`) VALUES ('', '$name', '$description', '$pictureSource', '$uid', '$createdTime')";

			//$photosArr[] = array('name'=> $name, 'fullpicture'=> $pictureSource, 'uid'=> $uid, 'createdtime'=> $createdTime);
			//$photosArr[] = array('sql' => $sql);

			//$successObj = array('data' => mysql_affected_rows());
			$results = mysql_query($sql);


		}		
		
			
		if (!$results) {
			$postsArr[] = array('success'=> false, 'mode'=> $mode, 'name'=> $name, 'fullpicture'=> $pictureSource, 'uid'=> $uid, 'createdtime'=> $createdTime);
			//print_r('NO success');
		} else {
			$postsArr[] = array('success'=> true, 'mode'=> $mode, 'uid'=> $uid);
			//print_r('success');
		}
		

	}

	//print_r(json_encode($photosArr));


}



$successObj = array('posts'=> $postsArr);

print_r(json_encode($successObj));
//print_r(json_encode($photosArr));




?>