// form����֤ �� form����� onsubmit="return iLover_verify();"
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

// ������仯��Сʱ������ tipλ��
$(window).resize(function(){
	if(document.activeElement.id) {
		var tempId = document.activeElement.id.replace(/\./, "\\.");
		$("#" + tempId).blur();
		$("#" + tempId).focus();
	}
});

$.fn.extend({
			iLover_validate : function(options) {
				var cxt = this; // ȫ�ֶ���
				var result = {}; // ���ؽ��
				var msg = ""; // ��֤ʱ����ʾ��Ϣ
				this._options = {
					position : "left", // ��ʾ���ͷλ��
					isRequire : true, // �Ƿ���ҪΪ����֤
					isSpace : true, // �Ƿ���Ҫȥ���ո�Ϊ����֤
					isLength : false, // �Ƿ���Ҫ������֤
					isChar : false, // �Ƿ�������
					isEncoding : true, // ���ֱ���(һ����������Ϊ[true] 3���ַ�����[false]
										// 2���ַ�)
					minLength : -1, // ��С���� isLengthΪ trueʱ������д
					maxLength : -1, // ��󳤶�
					isEmail : false, // �Ƿ�Ҫ��֤�����ʽ
					isTelephone : false
				// �Ƿ�绰������֤
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
					msg = ""; // ��ʼ��
					var error = "<label class='error' />&nbsp;";
					var success = "<label class='success' />&nbsp;";
					if (this._options.isRequire) {
						if (result.isRequire) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "�����ֶ�<br/>";
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
								msg += "���ȱ������ " + this._options.minLength + "<br/>";
							} else {
								msg += "���ȱ����� " + this._options.minLength + "�� " 
								       + this._options.maxLength + "֮��<br/>";								
							}		
						} else if(this._options.maxLength > 0) {
							msg += "���ȱ���С�� " + this._options.maxLength + "<br/>";
					    }
					}
					if ((cxt._options.isRequire || content)
							&& this._options.isEmail) {
						if (result.isEmail) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "��֤�����ʽ<br/>";
					}
					if ((cxt._options.isRequire || content)
							&& this._options.isTelephone) {
						if (result.isTelephone) {
							msg += success;
						} else {
							msg += error;
						}
						msg += "��֤�绰�����ʽ<br/>";
					}
					$(this).showTip({
						flagInfo : msg,
						position : this._options.position,
						flagCss: "tipContent"
					});
				};

				this.iLover_validateAll = function() {
					var content = $(this).val();
					if (cxt._options.isSpace) { // ȥ���ո���֤
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

				// Ϊ����֤
				this.iLover_validateEmpty = function(content) {
					if (content) {
						result.isRequire = true;
					} else {
						result.isRequire = false;
					}
				};
				// ������֤
				this.iLover_validateLength = function(content) {
					var char = -1; // ��������
					if (cxt._options.isChar) {
						if (cxt._options.isEncoding) { // һ������ռ 3���ַ�
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
					// ������ʽ��Ҫ��֤
					var reg = /(^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$)/; // ����
					var telReg = /(^(\+86)?[0-9][0-9]\d{9,10}$)/; // �ֻ�
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
						// /[^\x00-\xff]/g.test(content) content���Ƿ���ں���
						for ( var i = 0; i < content.length; i++) {
							// content[i]����Ϊ undefined, ���ʹ�� charAt(i��
							if (/[^\x00-\xff]/.test(content.charAt(i))) { // ����
								currLen += char; // ����
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