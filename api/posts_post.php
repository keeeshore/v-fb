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


		
		//print_r(json_encode($photosArr));


		if ($value['fullPicture'] != '') {
			$pictureSource = $IMG_POSTS_DIR.'/posts-'.$uid.'.jpg';			
			if (file_exists($IMG_POSTS_DIR) || mkdir($IMG_POSTS_DIR , 0777)) {
				saveImage($value['fullPicture'], $pictureSource);
			}
		}
		
		$sql = "INSERT INTO $DB_NAME.`posts` (`id`, `name`, `description`, `fullpicture`, `uid`, `createdtime`) VALUES ('', '$name', '$description', '$pictureSource', '$uid', '$createdTime')";


		//$photosArr[] = array('name'=> $name, 'fullpicture'=> $pictureSource, 'uid'=> $uid, 'createdtime'=> $createdTime);
		//$photosArr[] = array('sql' => $sql);

		$results = mysql_query($sql);	
		if (!$results) {
			$postsArr[] = array('success'=> false, 'name'=> $name, 'fullpicture'=> $pictureSource, 'uid'=> $uid, 'createdtime'=> $createdTime);
			//print_r('NO success');
		} else {
			$postsArr[] = array('success'=> true, 'uid'=> $name);
			//print_r('success');
		}
		

	}

	//print_r(json_encode($photosArr));


}



$successObj = array('posts'=> $postsArr);

print_r(json_encode($successObj));
//print_r(json_encode($photosArr));




?>