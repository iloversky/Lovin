:RESTART
tasklist /FI "username eq iLover" | find /C "tomcat6.exe" > temp.txt
set /p num= < temp.txt
del /F temp.txt
echo %num%
if "%num%" == "0"        start /D "F:\Apache Cluster\apache-tomcat-6.0.44\bin" tomcat6.exe
ping -n 10 -w 2000 0.0.0.1 > temp.txt
del /F temp.txt
goto RESTART