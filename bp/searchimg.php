<?php
	$fp=fopen('data/imglabel.txt','r');
	if(filesize('data/imglabel.txt')>0){
		$labArr=unserialize(fread($fp,filesize('data/imglabel.txt')));
	}else{
		$labArr=array();
	}

	$getLab=$_GET['label'];
	if(isset($getLab)){
		$labArr=array_merge($labArr,array($getImg=>$getLab));
	}else{
		$labArr=array_merge($labArr,array($getImg=>""));
	}
		
	}
	file_put_contents('data/imglabel.txt', serialize($labArr));
	print_r($labArr);//debug
?>