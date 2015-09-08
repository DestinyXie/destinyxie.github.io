<?php
	$fp=fopen('data/imglabel.txt','r');
	if(filesize('data/imglabel.txt')>0){
		$labArr=unserialize(fread($fp,filesize('data/imglabel.txt')));
	}else{
		$labArr=array();
	}

	$getImg=$_GET['img'];
	$getLab=$_GET['label'];
	if(isset($getImg)){
		if(isset($getLab)){
			$labArr=array_merge($labArr,array($getImg=>$getLab));
		}else{
			$labArr=array_merge($labArr,array($getImg=>""));
		}
		
	}
	file_put_contents('data/imglabel.txt', serialize($labArr));
	print_r($labArr);//debug
?>