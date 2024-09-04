<?php 
	$name = $_POST['name'];
	$phone = $_POST['phone'];
	$master = ($_POST['master'] != '') ? 'with the master ' . $_POST['master'] : 'in the salon, but with the master will be determined on the spot';
	
	$send = '';
	$to = 'admin@mail.com';
	$subject = '=?utf-8?B?' . base64_encode('New entry request from ' . $_SERVER['HTTP_HOST']) . '?='; 
	$headers = 'From: ' . iconv( 'utf-8', 'windows-1251', 'Enroll clients') . "<enrol@site.com>\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Date: ".date('D, d M Y h:i:s O')."\r\n";
	$headers .= "Content-type: text/html; charset=utf-8;";
	$body = 'Client ' . $name . ' wants register ' . $master . '<br>Request send '. date('d.m.Y'); 
	if (mail($to, $subject, $body, $headers)){
		$send = true;
	} else {
		$send = false;
	}; 
	if ($send){
		$response = array(
			'status' => 1,
			'message' => 'Your request form sent successfully!'
		);
		exit(json_encode($response));
	}  
?>