var swfu,
    contDom=$('#content'),
    contW=contDom.width(),
    galleryDom=$('#gallery'),
    imgW=240,
    //相册操作
    galleryHdl={
        refresh:function(sl){
            this.page=0;
            this.allImgs=[];
            this.allLabs=[];
            this.allRatios=[];
            this.pageNum=null;
            this.searchLabel='';
            checkWin(true);
            this.actCheckScroll();
            this.getGallery(0,20,sl);
        },
        actCheckScroll:function(t){//间隔监听页面位置以判断是否加载更多
            var that=this;
            that.checkScrollInter=setTimeout(function(){
                that.checkScroll();
            },t||1000);
        },
        checkScroll:function(){
            var that=this;
            if(that.isLoading||undefined===that.pageNum){
                that.actCheckScroll();
                return;
            }
            if(that.pageNum>=that.page){
                if($(document).scrollTop()+$(window).height()+50>=$(document).height()){//离底部20像素前加载更多图片
                    that.loadMore();
                }else{
                    that.actCheckScroll();
                }
            }else{
                that.checkScrollInter=null;
            }
        },
        getGallery:function(p,m,search) {
            var that=this;
            if(that.pageNum&&p>=that.pageNum){
                return;
            }
            that.isLoading=true;
            $.get('gallery.php',{"page":p||0,"max":m||20,"searchLabel":search||""},function(data) {
                that.page=p;
                that.searchLabel=search;
                that.imgs=data.images;
                that.labs=data.labels;
                that.ratios=data.ratios;
                that.setImgCont(0==p);
                that.allImgs=that.allImgs.concat(data.images);
                that.allLabs=that.allLabs.concat(data.labels);
                that.allRatios=that.allRatios.concat(data.ratios);
                that.pageNum=data.pageNum;
                that.isLoading=false;
                that.actCheckScroll();
            },'json');
        },
        loadMore:function(){
            var p=++this.page,
                search=this.searchLabel;
            this.getGallery(p,null,search);
        },
        setImgCont:function(init,resize) {
            var imgs=this.imgs,
                labs=this.labs,
                ratios=this.ratios,
                gnum=Math.floor(galleryDom.width()/imgW);

            if(init||resize){
                $('#gallery').html('');
                for(var i=0;i<gnum;i++){
                    $('#gallery').append('<div class="imgcolumn" style="width:'+imgW+'px"></div>');
                }
            }

            if(resize){
                imgs=this.allImgs;
                labs=this.allLabs;
                ratios=this.allRatios;
            }

            function getMinHeightIdx(){
                var minH=$($('#gallery .imgcolumn')[0]).height(),
                    minIdx=0;
                $.each($('#gallery .imgcolumn'),function(idx,col){
                    if($(col).height()<minH){
                        minH=$(col).height();
                        minIdx=idx;
                    }
                });
                return minIdx;
            }
            
            $.each(imgs,function(idx,imgurl) {
                var label=labs[idx]||"单击添加标注",
                    iptVal=labs[idx]||"",
                    imgRatio=ratios[idx],
                    imgH=(imgW-20)/imgRatio,
                    minCol=$($('#gallery .imgcolumn')[getMinHeightIdx()]);

                minCol.append('<div class="imgwrap"><div class="imgCont" style="height:'+imgH+'px"><img class="img'+idx+'" width="'+(imgW-20)+'" src="http://'+location.host+'/bp/upload_dir/'+imgurl+'"/></div><div imgurl="'+imgurl+'" class="label"><label>'+label+'</label><input type="text" value="'+iptVal+'"/></div></div>');
                if(resize){
                    $('#gallery .img'+idx).css('opacity',1);
                }else{
                    $('#gallery .img'+idx).load(function(){
                        $('#gallery .img'+idx).animate({'opacity':1},600);
                    });
                }
            });
        }
    };

//根据窗口尺寸调整相关内容
function checkWin(init){
    if(!isHandSet){
        if($('html').width()<1000){
            contDom.css('width','960px');
        }else{
            var nw=Math.floor(($('html').width()-40)/imgW)*imgW;
            contDom.css('width',nw+'px');
        }
    }
    if(init)
        return;
    if(contW!=contDom.width()){
        contW=contDom.width();
        galleryHdl.setImgCont(init,true);
    }
}

function closeUpload(){
    $('.progressWrap').hide();
    $('#fsUploadProgress').html('');
}

function strim(str){
    return str.replace(/^\s+|\s+$/g,'');
}

var isHandSet = (/android|iphone|ipad/gi).test(navigator.appVersion),
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);

$(function() {
    if(isHandSet){
        $('body').addClass('phone');
        $('.flashBtn').hide();
        $('.handset').show();
        contDom.css('width','100%');
        if(contDom.width()<500){
            imgW=Math.floor(contDom.width()/2);
        }
    }

    swfu = new SWFUpload({//照片上传配置
        // Backend Settings
        upload_url: "upload.php",
        post_params: {"PHPSESSID": "<?php echo session_id(); ?>"},

        // File Upload Settings
        file_size_limit : "3 MB",   // 3MB
        file_types : "*.jpg;*.gif;",
        file_types_description : "Web Image Files",
        file_upload_limit : "0",

        // Event Handler Settings - these functions as defined in Handlers.js
        //  The handlers are not part of SWFUpload but are part of my website and control how
        //  my website reacts to the SWFUpload events.
        file_queued_handler : fileQueued,
        file_queue_error_handler : fileQueueError,
        file_dialog_complete_handler : fileDialogComplete,
        upload_progress_handler : uploadProgress,
        upload_error_handler : uploadError,
        upload_success_handler : uploadSuccess,
        upload_complete_handler : uploadComplete,

        // Button Settings
        button_image_url : "images/swfupload/search_17x18.png",
        button_placeholder_id : "spanButtonPlaceholder",
        button_width: 180,
        button_height: 40,
        button_text : '<span class="button">上传照片<span class="btn_startupload">(最大 3 MB)</span></span>',
        button_text_style : '.button { font-family: Helvetica, Arial, sans-serif; font-size: 14px;color:#555555;}',
        button_text_top_padding: 10,
        button_text_left_padding: 18,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_cursor: SWFUpload.CURSOR.HAND,

        // Flash Settings
        flash_url : "js/swfupload/swfupload.swf",

        custom_settings : {
            progressTarget : "fsUploadProgress",
            cancelButtonId : "btnCancel"
        },

        // Debug Settings
        debug: false
    });

    $.ajaxSetup({cache:false});//ie ajax get缓存混乱

    galleryHdl.refresh();

    $('#searchLabel').keyup(function(){
        var ipt=$(this),
            iptVal=strim(ipt.val());
        galleryHdl.refresh(iptVal);
    });

    $(window).resize(function(){checkWin();});

    $('#gallery').delegate('label','mouseenter',function(){
        $(this).addClass('hover');
    });
    $('#gallery').delegate('label','mouseleave',function(){
        $(this).removeClass('hover');
    });  

    $('#gallery').delegate('label','click',function(){
        var lab=$(this);
        lab.hide();
        lab.next('input').width(lab.parent('.label').width()-8).show().focus();
    });

    $('#gallery').delegate('input','blur',function(){
        var ipt=$(this),
            lab=ipt.prev('label'),
            iptVal=ipt.val(),
            trimVal=strim(iptVal),
            imgName=ipt.parent('.label').attr('imgurl');
        ipt.hide();
        if(trimVal!=""){
            ipt.val(trimVal);
            lab.text(trimVal);
        }else{
            lab.text('单击添加标注');
        }
        $.get('addlabel.php',{"img":imgName,"label":trimVal},function(data) {
        },'json');
        lab.show();
    });

    $('#closePW').click(function(){
        closeUpload();
    });

    $('#iframeFile').change(function(){
        setTimeout(function(){
            $('#iframeForm').submit();
        },200)
    });
});