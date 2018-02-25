<?php
ob_start();
require_once("../config.php");
include_once("../common.php");

extract($_GET);

if (!$_GET) {
	echo json_encode(array( 'success' => false, 'message' => 'NOt a get ??' ));
	exit();
}

$type = $_GET['type'];


$attachment_location = $type.'.json';
if (file_exists($attachment_location)) {
    header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
    header("Cache-Control: public"); // needed for internet explorer
    header("Content-Type: application/json");
    header("Content-Transfer-Encoding: Binary");
    header("Content-Length:".filesize($attachment_location));
    header("Content-Disposition: attachment; filename=file.json");
    readfile($attachment_location);
    die();        
} else {
    die("Error: File not found.");
} 

?>