<?php
ob_start();
require_once("./config.php");
	
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header('Content-type: application/json');

$json = '{  "type": "donut", "name": "Cake" }';

$yummy = json_decode($json);

echo $yummy;

?>