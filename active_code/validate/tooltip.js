;(function($){
    jQuery.fn.extend({
    	showTip:function(settings)
        {
            $(this).each(function(){
                //初始化配置信息
                var options = jQuery.extend({
                    flagCss:"tip",
                    flagWidth:$(this).outerWidth(),
                    flagInfo:$(this).attr("title"),
                    isAnimate:false,
                    position: "down"
                },
                settings);
                if(!options.flagInfo)
                {
                    return;
                }
                $(this).removeAttr("title");
               // alert(options.flagInfo);
               // $(this).focus(function(){
                    //设置提示信息最小宽度为163
                   // options.flagWidth = (parseInt(options.flagWidth) < 100) ? 163 : parseInt(options.flagWidth);
                    var oTip = $("<div id='toolTipDiv' class='ui-slider-tooltip  ui-corner-all'></div>");
                    var oPointer = $("<div class='ui-tooltip-pointer-" + options.position + "'><div class='ui-tooltip-pointer-"+ options.position +"-inner'></div></div>");
                    var oTipInfo = $("<div id='content'>" + options.flagInfo + "</div>").attr("class", options.flagCss);
                    //合并提示信息
                    var oToolTip = $(oTip).append(oTipInfo).append(oPointer);
		    $(oTipInfo).css("width", "260px"); // 设置宽度方便定位，这里需要考虑更好点的方式
                    //添加淡入效果
                    if(options.isAnimate)
                    {
                        $(oToolTip).fadeIn("slow");
                    }
                    $(this).after(oToolTip);
                    /*//计算提示信息的top、left和width
                    var position = $(this).position();
                    var oTipTop = eval(position.top - $(oTip).outerHeight() - 8);
                    var oTipLeft = position.left;
                    $(oToolTip).css("top" , oTipTop + "px").css("left" , oTipLeft + "px");
                    */
                    
                  //计算提示信息的top、left和width
                    var position = $(this).position();
                    var oTipTop;
                    var oTipLeft;
                    if(options.position == "top") {
                    	oTipLeft = position.left + ($(this).width() / 2);
                    	oTipTop = position.top + $(this).outerHeight() + 5;
                    } else if(options.position == "down") {
                    	oTipLeft = position.left + ($(this).width() / 2);
                    	oTipTop = position.top - $(oTip).outerHeight() - 5;
                    } else if(options.position == "left") {
                    	oTipLeft = position.left + $(this).width() + 12;
                    	oTipTop = position.top - 4;
                    } else {
                    	oTipLeft = position.left - $(oTip).outerWidth() - 5;
                    	oTipTop = position.top;
                    }
                    
                    $(oToolTip).css("top" , oTipTop + "px").css("left" , oTipLeft + "px");
                    
                    $(this).blur(function(){
                        $(oToolTip).remove();
                    });
               // });
            });
            return this;
        }
    });
})(jQuery);