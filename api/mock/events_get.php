<?php
session_start();
include_once '../sessionChecker.php';
require_once("../config.php");

extract($_POST);
extract($_GET);


include_once '../common.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header('Content-type: application/json');
header("Location:events.json");

exit();


?>

