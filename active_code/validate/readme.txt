verify:
  require  length  email  telephone

config:
  this._options = {
		        position : "left", // ��ʾ���ͷλ��
			isRequire : true, // �Ƿ���ҪΪ����֤
			isSpace : true, // �Ƿ���Ҫȥ���ո�Ϊ����֤
			isLength : false, // �Ƿ���Ҫ������֤
			isChar : false, // �Ƿ�������
			isEncoding : true, // ���ֱ���(һ����������Ϊ[true] 3���ַ�����[false] 2���ַ�)
			minLength : -1, // ��С���� isLengthΪ trueʱ������� 0
			maxLength : -1, // ��󳤶�
			isEmail : false, // �Ƿ�Ҫ��֤�����ʽ
			isTelephone : false // �Ƿ�绰������֤			
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