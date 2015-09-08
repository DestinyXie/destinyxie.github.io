<?php
session_start();
$_SESSION["file_info"] = array();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" >
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
        <title>小明的相册</title>
        <meta name="viewport" content="target-densitydpi=device-dpi, width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <link href="css/swfupload.css" rel="stylesheet" type="text/css" />
        <link href="css/custom.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
    <div id="content">
        <?php
        if( !function_exists("imagecopyresampled") ) {
            ?>
        <div class="message">
            <h4><strong>错误:</strong> </h4>
            <p>服务器端并没有安装GD库</p>
            <p>请在php.ini中把<code>;extension=php_gd2.dll</code>修改为<code>extension=php_gd2.dll</code> and making sure your extension_dir is pointing in the right place. <code>extension_dir = "%php_dir%\extensions"</code></p>
        </div>
            <?php
        } else {
            ?>
        <div id="head">
            <span class="searchLabel">&nbsp;&nbsp;搜索:&nbsp;</span><input type="text" id="searchLabel" />
            <div class="flashBtn">
                <span id="spanButtonPlaceholder"></span>
            </div>
            <div class="handset">
                <form action="upload.php" id="iframeForm" enctype="multipart/form-data" method="post" target="iframeUpload">
                    <iframe name="iframeUpload" src="" width="0" height="0" frameborder=0 scrolling="no" style="display:none"></iframe>
                    <input name="PHPSESSID" type="hidden" value="<?php echo session_id(); ?>" />
                    <input name="fromiframe" type="hidden" value="1" />
                    <input id="iframeFile" value="上传照片"  name="Filedata" type="file" />
            </div>
            <div class="progressWrap">
                <div class="button"><a id="closePW" href="javascript:void(0)">OK</a></div>
                <div id="fsUploadProgress" class="clear">
                </div>
            </div>
        </div>
            <?php
        }
        ?>
        <!-- <label>page:</label><input type="text" id="page" /><label>max:</label><input type="text" id="max" /><input type="button" id="galBtn" value="get gallery"/>&nbsp;&nbsp;&nbsp;标签搜索:</label><input type="text" id="searchLabel" /> -->
        <div id="gallery" class="clear">
        </div>
    </div>
    <script type="text/javascript" src="js/jquery-1.6.1.min.js"></script>
    <script type="text/javascript" src="js/swfupload/swfupload.js"></script>
    <script type="text/javascript" src="js/swfupload/handlers.js"></script>
    <script type="text/javascript" src="js/swfupload/fileprogress.js"></script>
    <script type="text/javascript">
        var PHPSESSID="<?php echo session_id(); ?>";
    </script>
    <script type="text/javascript" src="js/custom.js"></script>
    </body>
</html>