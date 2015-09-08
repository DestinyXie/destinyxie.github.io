<?php
	/* Note: This thumbnail creation script requires the GD PHP Extension.  
		If GD is not installed correctly PHP does not render this page correctly
		and SWFUpload will get "stuck" never calling uploadSuccess or uploadError
	 */

	// Get the session Id passed from SWFUpload. We have to do this to work-around the Flash Player Cookie Bug
	if (isset($_POST["PHPSESSID"])) {
		session_id($_POST["PHPSESSID"]);
	}

	session_start();
	ini_set("html_errors", "0");

	// Check the upload
	if (!isset($_FILES["Filedata"]) || !is_uploaded_file($_FILES["Filedata"]["tmp_name"]) || $_FILES["Filedata"]["error"] != 0) {
		echo "ERROR:invalid upload";
		exit(0);
	}

	// Get the image and create a thumbnail
	$tmpname=$_FILES["Filedata"]["tmp_name"];
	$filename=$_FILES["Filedata"]["name"];
	$imgType=substr(strrchr($filename,'.'),1);
	if('jpg'==strtolower($imgType)){
		$img = imagecreatefromjpeg($tmpname);
	}else{
		$img = imagecreatefromgif($tmpname);
	}
	
	if (!$img) {
		echo "ERROR:could not create image handle ". $tmpname;
		exit(0);
	}

	$width = imageSX($img);
	$height = imageSY($img);

	if (!$width || !$height) {
		echo "ERROR:Invalid width or height";
		exit(0);
	}

	// Build the thumbnail
	$target_width = 100;
	$target_height = 100;
	$target_ratio = $target_width / $target_height;

	$img_ratio = $width / $height;

	if ($target_ratio > $img_ratio) {
		$new_height = $target_height;
		$new_width = $img_ratio * $target_height;
	} else {
		$new_height = $target_width / $img_ratio;
		$new_width = $target_width;
	}

	if ($new_height > $target_height) {
		$new_height = $target_height;
	}
	if ($new_width > $target_width) {
		$new_height = $target_width;
	}

	$new_img = ImageCreateTrueColor(100, 100);
	if (!@imagefilledrectangle($new_img, 0, 0, $target_width-1, $target_height-1, 0)) {	// Fill the image black
		echo "ERROR:Could not fill new image";
		exit(0);
	}

	if (!@imagecopyresampled($new_img, $img, ($target_width-$new_width)/2, ($target_height-$new_height)/2, 0, 0, $new_width, $new_height, $width, $height)) {
		echo "ERROR:Could not resize image";
		exit(0);
	}

	if (!isset($_SESSION["file_info"])) {
		$_SESSION["file_info"] = array();
	}

	$save_path=getcwd()."/upload_dir/";
	if(!file_exists($save_path)){
		mkdir($save_path);
	}

	$imgSaveName=time().'_'.rand().'.'.$imgType;
	
	if(!@move_uploaded_file($tmpname,$save_path.$imgSaveName)){
		echo "ERROR:File cannot be kept";
		exit(0);
	}else{
		$fp=fopen('data/imgratio.txt','r');
		if(filesize('data/imgratio.txt')>0){
			$ratioArr=unserialize(fread($fp,filesize('data/imgratio.txt')));
		}else{
			$ratioArr=array();
		}
		$ratio=round($img_ratio,2);
		$ratioArr=array_merge($ratioArr,array($imgSaveName=>$ratio));
		file_put_contents('data/imgratio.txt', serialize($ratioArr));
	}

	// Use a output buffering to load the image into a variable
	ob_start();
	imagejpeg($new_img);
	$imagevariable = ob_get_contents();
	ob_end_clean();

	$file_id = md5($tmpname + rand()*100000);
	
	$_SESSION["file_info"][$file_id] = $imagevariable;
	if($_POST['fromiframe']){
		echo "<script type='text/javascript'>window.parent.galleryHdl.refresh();</script>";
	}else{
		echo "FILEID:" . $file_id;	// Return the file id to the script
	}
?>