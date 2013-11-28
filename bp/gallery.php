<?php
	$fp=fopen('data/imglabel.txt','r');
	if(filesize('data/imglabel.txt')>0){
		$labArr=unserialize(fread($fp,filesize('data/imglabel.txt')));
	}else{
		$labArr=array();
	}

	$fp2=fopen('data/imgratio.txt','r');
	if(filesize('data/imgratio.txt')>0){
		$ratioArr=unserialize(fread($fp2,filesize('data/imgratio.txt')));
	}else{
		$ratioArr=array();
	}

	//匹配标签
	function search($arr,$str,$labs){
		$return=array();
		foreach($arr as $key=>$val){
			if(false !== strpos($labs[$val], $str)){
				array_push($return,$val);
			}
		}
		return $return;
	}

	$page=0;
	if($_GET['page'])
		$page=$_GET['page'];
	$max=3;
	if($_GET['max'])
		$max=$_GET['max'];
	$handle=opendir('./upload_dir/');
	$result['images']=array();
	$result['labels']=array();
	$result['ratios']=array();
	$i=0;

	while (false!==($file=readdir($handle))) {
		list($filename,$ext)=explode('.',$file);
		if($ext=='gif'||$ext=='jpg'||$ext=='JPG'){
			if(!is_dir('./upload_dir/'.$file)){
				$tmpArray[]=$file;
			}
		}
	}

	if($_GET['searchLabel']){
		$array=search($tmpArray,$_GET['searchLabel'],$labArr);
	}else{
		$array=$tmpArray;
	}

	$i=count($array);
	$result['pageNum']=ceil($i/$max);

	for($j=$max*$page;$j<($max*$page+$max)&&$j<$i;++$j){
		array_push($result['images'],$array[$j]);
		$lab=$labArr[$array[$j]];
		if($lab){
			array_push($result['labels'],$lab);
		}else{
			array_push($result['labels'],'');
		}
		array_push($result['ratios'],$ratioArr[$array[$j]]);
	}

	$json_string = json_encode($result);
    echo $json_string;
?>