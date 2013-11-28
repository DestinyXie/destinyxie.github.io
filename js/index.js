/*custom js*/
$(function() {
	var DOC=$(document),
		more_btn=$('.more'),
		emul=$('#emul'),
		frame=$('.frame'),
		frame_dom,
		frame_mask,
		frame_show=false,
		frame_oriPos=[0,0],
		frame_sPos,
		frame_md=false;
		
	/*show more*/
	more_btn.click(function(){
		var ul=more_btn.parent();
		more_btn.remove();
		ul.append('<li>代理事件模型，提升应用性能。</li><li>新功能不断完善中，应用按需使用。</li>');
	});

	/*show mobile*/
	emul.click(function() {
		if(frame_show){
			frame.stop().animate({top:'-600px',opacity:0},200,function() {
				frame.css({display:'none'});
			});
			frame_show=false;
			return;
		}
		frame_show=true;
		if($('iframe',frame).length<1){
			frame.html('<iframe src="mix.html"></iframe><div class="frame_mask">加载中...</div>');
			frame_dom=$('.frame iframe');
			frame_mask=$('.frame_mask');
			frame_dom.load(function() {
				setTimeout(showFrame,1000);
			});
			setTimeout(showFrame,2000);
		}

		frame.stop().css({top:'-600px',opacity:0,display:'block'}).animate({opacity:1,top:'30px'},200);
	});

	function showFrame () {
		frame_mask.animate({width:0},300,function() {
			frame_mask.css({'display':'none','opacity':'0.85'}).html('MixJS');
		});
	}
	
	function setFramePos (e) {
		disPos=[e.clientX-frame_sPos[0],e.clientY-frame_sPos[1]];
		frame.css('left',(frame_oriPos[0]+disPos[0]<2)?"2px":(frame_oriPos[0]+disPos[0]>572)?"572px":(frame_oriPos[0]+disPos[0])+"px");

		var maxH=$('#wrap').height()-638;
		maxH=(maxH>0)?maxH+30:30;

		frame.css('top',(frame_oriPos[1]+disPos[1]<3)?"3px":(frame_oriPos[1]+disPos[1]>maxH)?maxH+"px":(frame_oriPos[1]+disPos[1])+"px");
		
	}
	frame.mousedown(function(e) {
		frame_mask.css({'width':'301px','display':'block'});
		e.preventDefault();
		frame_md=true;
		frame_sPos=[e.clientX,e.clientY];
		frame_oriPos=[frame.position().left,frame.position().top];
	});
	DOC.mousemove(function(e) {
		if(!frame_md) return;
		setFramePos(e);
		
	}).mouseup(function(e) {
		if(!frame_md) return;
		frame_mask.css({'width':'0','display':'none'});
		frame_md=false;
		setFramePos(e);
	});
});
//google analyse
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-37364930-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();