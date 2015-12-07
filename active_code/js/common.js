String.prototype.Trim = function() {
	return Trim(this);
};
String.prototype.LTrim = function() {
	return LTrim(this);
};
String.prototype.RTrim = function() {
	return RTrim(this);
};

// 此处为独立函数
function LTrim(str) {
	var i;
	for (i = 0; i < str.length; i++) {
		if (str.charAt(i) != " " && str.charAt(i) != " ")
			break;
	}
	str = str.substring(i, str.length);
	return str;
}
function RTrim(str) {
	var i;
	for (i = str.length - 1; i >= 0; i--) {
		if (str.charAt(i) != " " && str.charAt(i) != " ")
			break;
	}
	str = str.substring(0, i + 1);
	return str;
}
function Trim(str) {
	return LTrim(RTrim(str));
}

// textarea自适应高度
$.fn.extend({
    textareaAutoHeight: function (options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        };

        this.init = function () {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight=parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keyup(this.resetHeight).change(this.resetHeight)
            .focus(this.resetHeight);
        };
        this.resetHeight = function () {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));

            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                        h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            }
            else {
                $(this).css("overflow-y", "hidden");
            }
        };
        this.init();
    }
});

// 公告滚动
//实例化一个对象并调用对象的initialize方法   
var Class = {
	create : function() {
		return function() {
			this.initialize.apply(this, arguments);
		};
	}
};

// 为Object添加一个extend方法   
Object.extend = function(destination, source) {
	for ( var property in source) {
		destination[property] = source[property];
	}
	return destination;
};

// 为对象注册事件   
var addEventHandler = function(oTarget, sEventType, fnHandler) {
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, fnHandler, false);
	} else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, fnHandler);
	} else {
		oTarget["on" + sEventType] = fnHandler;
	}
};
var Scroll = Class.create();
Scroll.prototype = {
	initialize : function(outObj, inObj, options) {
		var oScroll = this;
		var iOut = $(outObj);
		var iIn = $(inObj);
		this.outHeight = iOut.offsetHeight;
		this.inHeight = iIn.offsetHeight;
		if (this.outHeight >= this.inHeight) {
			return;
		}
		iOut.style.overflow = "hidden";
		iIn.appendChild(iIn.cloneNode(true));
		this.setOptions(options);
		this.outObj = iOut;
		this.timer = null;
		this.side = 1; // 1：向上；2：向下   
		switch (this.options.side) {
		case "down":
			this.side = -1;
			break;
		case "up":
		default:
			this.side = 1;

		}
		addEventHandler(iIn, "mouseover", function() {
			oScroll.stop();
		});
		addEventHandler(iIn, "mouseout", function() {
			oScroll.start();
		});
		this.start();
	},
	setOptions : function(options) {
		this.options = {
			step : 1, // 每次滚动的px量   
			side : "up", // 滚动的方向   
			time : 10
		// 滚动的间隔时间（滚动速度）   
		};
		Object.extend(this.options, options || {});
	},
	scroll : function() {
		var inHeight = this.inHeight, outHeight = this.outHeight, iStep = this.options.step
				* this.side, time = this.options.time;
		var iScrollTop = this.outObj.scrollTop;
		if (iScrollTop >= (inHeight * 2 - outHeight)) {
			iScrollTop -= inHeight;
		} else if (iScrollTop <= 0) {
			iScrollTop += inHeight;
		}
		this.outObj.scrollTop = iScrollTop + iStep;
		var oScroll = this;
		this.timer = setTimeout(function() {
			oScroll.scroll();
		}, time);
	},
	start : function() {
		this.scroll();
	},
	stop : function() {
		clearTimeout(this.timer);
	}
};

//控制字符长度; objId: textarea组件 id，maxLen: 最大字符数，tipObj: 提示字符数组件 id
function controlChar(objId, maxLen, tipObj) {
	var currLen = 0;
	var obj = document.getElementById(objId);

	var content = obj.value.Trim();

	// /[^\x00-\xff]/g.test(content) content中是否存在汉字
	for(var i = 0; i < content.length; i++) {
		if (/[^\x00-\xff]/.test(content[i])) { // 汉字
			currLen += 3; // 汉字占 3字节
		} else {
			currLen += 1;
		}
	}

	if(currLen > maxLen) {
		var len = maxLen;
		var subContent = "";
		for(var j = 0; j < content.length; j++) {
			if (/[^\x00-\xff]/.test(content[j])) { // 汉字
				len -= 3; // 汉字占 3字节
			} else {
				len--;
			}
			if(len < 0) {
				break;
			}
			subContent += content[j];
		}
		obj.value = subContent;

		content = subContent;
		currLen = 0;
		for(var i = 0; i < content.length; i++) {
			if (/[^\x00-\xff]/.test(content[i])) { // 汉字
				currLen += 3; // 汉字占 3字节
			} else {
				currLen += 1;
			}
		}
	}
	//alert(content.length + "; " + currLen);
	if(document.getElementById(tipObj)) {
		document.getElementById(tipObj).innerHTML = "总长度: " + maxLen
		   + "个字符; 已录入: " + currLen + "个字符; 还剩余: " + (maxLen - currLen) + "个字符";
	}
}