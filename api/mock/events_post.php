<?php
session_start();
include_once '../sessionChecker.php';
require_once("../config.php");

extract($_POST);
extract($_GET);


include_once '../common.php';


$successObj = array('success' => true);
print_r(json_encode($successObj));


?>