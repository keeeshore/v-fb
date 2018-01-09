<?php
	
  ob_start();
require_once("./config.php");
  
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
header('Content-type: application/json');


extract($_POST);
extract($_GET);

	$result = json_decode(file_get_contents('php://input'), true);

	$name = $result['name'];	
	$phone = $result['phone'];	
	$email = $result['email'];	
	$comments = $result['comments'];

	//sys date

	$tmp = time();
	$date = date("Y-m-d H:i:s",$tmp);		
	{
 		$to="sendamailtokishore@gmail.com"; 
 		$subject = "Registration from Vimonisha";  
 	}
		
	$succesMsg = "Your mail has been successfully sent!";

$msg = "
<HTML>
  <body>
  <table width=\"100%\" border=\"1\" cellspacing=\"0\" cellpadding=\"5\">
    
    <tr>
      <td colspan=\"2\">Visitor Registration for Vimonisha Exhibition</td>
    </tr>
    
    <tr>
      <td width=\"26%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">Name</font></td>
      <td width=\"74%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">$name</font></td>
    </tr>
    
    <tr>
      <td width=\"26%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">Phone</font></td>
      <td width=\"74%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">$phone</font></td>
    </tr>
    
     
    <tr>
      <td width=\"26%\" height=\"28\" valign=\"top\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">mail Id</font></td>
      <td width=\"74%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">$email</font></td>
    </tr> 

     <tr>
      <td width=\"26%\" height=\"28\" valign=\"top\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">Comments</font></td>
      <td width=\"74%\" height=\"28\"><font size=\"2\" face=\"Arial, Helvetica, sans-serif\">$comments</font></td>
    </tr>  
      
  </table>
  </body>
</html>";

$headers = "From: $name <$email>\nReply-To: $email\nCc:sendamailtokishore@gmail.com\nContent-Type: text/html; charset=iso-8859-1\n";  

//echo $msg;
//exit;

  mail($to,$subject,$msg,$headers);

  $success = true;

  echo json_encode(array( 'success' => $success ));



?>
