<?php
ob_start();
require_once("./config.php");

/*session_start();
if(!$_SESSION['admin_login']) {
	header("Location:index.php?feedback=Unauthorized access!!");
	exit;
}*/

extract($_POST);
extract($_GET);

$data = [ 'name' => 'God', 'age' => -1 ];

$description = 'test222';
$picture = 'test222';
$uid = 'test22';
$createdtime = date("Y-m-d"); 

//echo json_encode( $data );

//echo $createdtime;

//$json = '{  "type": "donut", "name": "Cake" }';

//$yummy = json_decode($json);

//echo $yummy;
$sql = "INSERT INTO $DB_NAME.`posts` (`id`, `description`, `picture`, `uid`, `createdtime`) VALUES ('', '$description', '$picture', '$uid', '$createdtime')";
$result = mysql_query($sql);
echo $sql;

//echo $exbid;

?>