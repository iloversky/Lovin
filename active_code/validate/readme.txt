verify:
  require  length  email  telephone

config:
  this._options = {
		        position : "left", // 提示框箭头位置
			isRequire : true, // 是否需要为空验证
			isSpace : true, // 是否需要去除空格为空验证
			isLength : false, // 是否需要长度验证
			isChar : false, // 是否区别汉字
			isEncoding : true, // 汉字编码(一个汉字是作为[true] 3个字符还是[false] 2个字符)
			minLength : -1, // 最小长度 isLength为 true时必须大于 0
			maxLength : -1, // 最大长度
			isEmail : false, // 是否要验证邮箱格式
			isTelephone : false // 是否电话号码验证			
		   };

use:
   <link type="text/css" rel="stylesheet" href="tooltip.css" />
   <script type="text/javascript" src="jquery-1.4.2.js"></script>
   <script type="text/javascript" src="tooltip.js"></script>
   <script type="text/javascript" src="iLover_validate.js"></script>

  window.onload = function() {
      $("#username").iLover_validate(options)
  }
  <form onsubmit="return iLover_verify();">