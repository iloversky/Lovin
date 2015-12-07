// form表单验证 在 form中添加 onsubmit="return iLover_verify();"
function iLover_verify() {
	var obj = $(".result");
	var tempName = "";
	for(var i = 0; i < obj.length; i++) {
		if(!$(obj[i]).val() || $(obj[i]).val() == "false") {
			tempName = $(obj[i]).attr("name").replace(/\./g, "\\.");
			$("#" + tempName).focus();
			return false;
		}
	}
	return true;
}

// 浏览器变化大小时，重置 tip位置
$(window).resize(function(){
	if(document.activeElement.id) {
		var tempId = document.activeElement.id.replace(/\./, "\\.");
		$("#" + tempId).blur();
		$("#" + tempId).focus();
	}
});

$.fn.extend({
			iLover_validate : function(options) {
				var cxt = this; // 全局对象
				var result = {}; // 返回结果
				var msg = ""; // 验证时的显示信息
				this._options = {
					position : "left", // 提示框箭头位置
					isRequire : true, // 是否需要为空验证
					isSpace : true, // 是否需要去除空格为空验证
					isLength : false, // 是否需要长度验证
					isChar : false, // 是否区别汉字
					isEncoding : true, // 汉字编码(一个汉字是作为[true] 3个字符还是[false]
										// 2个字符)
					minLength : -1, // 最小长度 isLength为 true时必须填写
					maxLength : -1, // 最大长度
					isEmail : false, // 是否要验证邮箱格式
					isTelephone : false
				// 是否电话号码验证
				};
				this.iLover_init = function() {
					for ( var p in options) {
						this._options[p] = options[p];
					}

					if (this._options.isRequire) {
						$("form").append("<input id='result-" + $(this).attr("id")
												+ "' name='"
												+ $(this).attr("id")
												+ "' class='result' type='hidden' value='false' />");
					}

					$(this).keyup(this.iLover_validateAll).change(
							this.iLover_validateAll).focus(
							this.iLover_validateAll);
				};

				this.iLover_showTip = function(content) {
					$("#toolTipDiv").remove();
					msg = ""; // 初始化
					var error = "<label class='error' />&nbsp;";
					var success = "<label class='success' />&nbsp;";
					if (this._options.isRequire) {
						if (result.isRequire) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "必填字段<br/>";
					}
					if ((cxt._options.isRequire || content)
							&& this._options.isLength) {
						if (result.isLength) {
							msg += success;
						} else {
							msg += error;
						}
						if (this._options.minLength > 0) {
							if(this._options.maxLength <= this._options.minLength) {
								msg += "长度必须大于 " + this._options.minLength + "<br/>";
							} else {
								msg += "长度必须在 " + this._options.minLength + "与 " 
								       + this._options.maxLength + "之间<br/>";								
							}		
						} else if(this._options.maxLength > 0) {
							msg += "长度必须小于 " + this._options.maxLength + "<br/>";
					    }
					}
					if ((cxt._options.isRequire || content)
							&& this._options.isEmail) {
						if (result.isEmail) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "验证邮箱格式<br/>";
					}
					if ((cxt._options.isRequire || content)
							&& this._options.isTelephone) {
						if (result.isTelephone) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "验证电话号码格式<br/>";
					}
					$(this).showTip({
						flagInfo : msg,
						position : this._options.position,
						flagCss: "tipContent"
					});
				};

				this.iLover_validateAll = function() {
					var content = $(this).val();
					if (cxt._options.isSpace) { // 去除空格验证
						content = $.trim(content);
					}

					if (cxt._options.isRequire) {
						cxt.iLover_validateEmpty(content);
					}
					if ((cxt._options.isRequire || content)
							&& cxt._options.isLength) {
						cxt.iLover_validateLength(content);
					}
					if ((cxt._options.isRequire || content)
							&& cxt._options.isEmail) {
						cxt.iLover_validateEmail(content);
					}
					if ((cxt._options.isRequire || content)
							&& cxt._options.isTelephone) {
						cxt.iLover_validateTel(content);
					}

					$("#lenTitle").empty();
					var valResult = true;
					for ( var para in result) {
						if(!result[para]) {
							valResult = false;
							break;
						}
					}
					var tempName = $(this).attr("id").replace(/\./, "\\.");
					$("#result-" + tempName).val(valResult);
					cxt.iLover_showTip(content);
				};

				// 为空验证
				this.iLover_validateEmpty = function(content) {
					if (content) {
						result.isRequire = true;
					} else {
						result.isRequire = false;
					}
				};
				// 长度验证
				this.iLover_validateLength = function(content) {
					var char = -1; // 不区别汉字
					if (cxt._options.isChar) {
						if (cxt._options.isEncoding) { // 一个汉字占 3个字符
							char = 3;
						} else {
							char = 2;
						}
					}
					var len = this.iLover_countChar(content, char);
					
					if (this._options.minLength > 0) {
						if(this._options.maxLength <= this._options.minLength) {
							if (len >= cxt._options.minLength) {
								result.isLength = true;
							} else {
								result.isLength = false;
							}
						} else {
							if (len >= cxt._options.minLength && len <= cxt._options.maxLength) {
								result.isLength = true;
							} else {
								result.isLength = false;
							}
						}		
					} else if(this._options.maxLength > 0) {
						if (len <= cxt._options.maxLength) {
							result.isLength = true;
						} else {
							result.isLength = false;
						}
				    } else {
				    	result.isLength = true;
				    }
				};

				this.iLover_validateEmail = function(content) {
					var content = $.trim($(this).val());
					var reg = /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/;
					if (reg.exec(content)) {
						result.isEmail = true;
					} else {
						result.isEmail = false;
					}
				};

				this.iLover_validateTel = function(content) {
					// 正则表达式需要验证
					var reg = /(^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$)/; // 座机
					var telReg = /(^(\+86)?[0-9][0-9]\d{9,10}$)/; // 手机
					if (reg.exec(content) || telReg.exec(content)) {
						result.isTelephone = true;
					} else {
						result.isTelephone = false;
					}
				};

				this.iLover_countChar = function(content, char) {
					var currLen = 0;
					if (char == -1) {
						currLen = content.length;
					} else {
						// /[^\x00-\xff]/g.test(content) content中是否存在汉字
						for ( var i = 0; i < content.length; i++) {
							// content[i]可能为 undefined, 最好使用 charAt(i）
							if (/[^\x00-\xff]/.test(content.charAt(i))) { // 汉字
								currLen += char; // 汉字
							} else {
								currLen += 1;
							}
						}
					}
					return currLen;
				};
				this.iLover_init();
			}
		});