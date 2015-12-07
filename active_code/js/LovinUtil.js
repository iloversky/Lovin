/**
 * format = "yyyy-MM-dd(Q) HH:mm:ss.S"
 * 日期格式化
 */
Date.prototype.format = function(format) {
	var _date = {
		"M+" : this.getMonth() + 1, // 月
		"d+" : this.getDate(),
		"H+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(), // 秒
		"S+" : this.getMilliseconds(), // 微秒
		"Q+" : Math.floor((this.getMonth() + 3) / 3) // 季度
	};
	// 年份是 4位, 需要单独处理
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	}
	for ( var _d in _date) {
		if (new RegExp("(" + _d + ")").test(format)) {
			format = format.replace(RegExp.$1,
					((RegExp.$1.length == 1) ? _date[_d] : ("00" + _date[_d])
							.substr(("" + _date[_d]).length)));
		}
	}
	return format;
};

/**
 * 字符串转换日期
 * format：指定字符串中年月日的位置, yMdHmsS：年月日时分秒毫秒
 */
String.prototype.parse = function(format) {
	var _date = new Date();
	if(!format) { // 默认字符串格式：年月日
		format = "yMd";
	}
	// 日期字符串必须与 format匹配
	if(num && (num.length >= format.length)) {
		// 获取字符串中的数字, 返回数字数组
		var num = (this.match(/(\d+)/g));
		if(format.indexOf("y") != -1) {
			_date.setFullYear(num[format.indexOf("y")]);
		}
		if(format.indexOf("M") != -1) {
			_date.setMonth(num[format.indexOf("M")] - 1);
		}
		if(format.indexOf("d") != -1) {
			_date.setDate(num[format.indexOf("d")]);
		}
		if(format.indexOf("H") != -1) {
			_date.setHours(num[format.indexOf("H")]);
		}
		if(format.indexOf("m") != -1) {
			_date.setMinutes(num[format.indexOf("m")]);
		}
		if(format.indexOf("s") != -1) {
			_date.setSeconds(num[format.indexOf("s")]);
		}
		if(format.indexOf("S") != -1) {
			_date.setMilliseconds(num[format.indexOf("S")]);
		}
	}
	return _date;
};