<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>文字向上滚动</title>
<style type="text/css">
.box {
	width: 150px;
	height: 50px;
	line-height: 25px;
	border: #bbb 1px solid;
	overflow: hidden;
}

.box ul {
	margin: 0;
	padding: 0
}

.box li {
	height: 20px;
	line-height: 20px;
	font-size: 12px;
	text-align: center;
	list-style-type: none;
}
</style>
</head>
<body>
	<div class="box" id="marqueebox1">
		<ul>
			<li style="background:#f8e2ac;">第一行</li>
			<li style="background:#f5f5f5;">第二行</li>
			<li style="background:#ffe6ec;">第三行</li>
		</ul>
	</div>
	<script type="text/javascript">
		function startmarquee(lh, speed, delay) {
			var t = null;
			var p = false;
			var o = document.getElementById("marqueebox1");
			o.innerHTML += o.innerHTML;
			o.onmouseover = function() {
				p = true;
			};
			o.onmouseout = function() {
				p = false;
			};
			o.scrollTop = 0;
			function start() {
				t = setInterval(scrolling, speed);
				if (!p) {
					o.scrollTop += 1;
				}
			}
			function scrolling() {
				if (o.scrollTop % lh != 0) {
					o.scrollTop += 1;
					if (o.scrollTop >= o.scrollHeight / 2)
						o.scrollTop = 0;
				} else {
					clearInterval(t);
					setTimeout(start, delay);
				}
			}
			setTimeout(start, delay);
		}
		startmarquee(20, 40, 0, 1);
	</script>
</body>
</html>
