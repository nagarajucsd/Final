@echo off
echo Restoring server structure...

cd server

echo Creating folders...
if not exist "config" mkdir config
if not exist "models" mkdir models
if not exist "routes" mkdir routes
if not exist "middleware" mkdir middleware
if not exist "utils" mkdir utils

echo Copying files from dist to root...
xcopy /Y /I dist\models\*.js models\
xcopy /Y /I dist\routes\*.js routes\
xcopy /Y /I dist\middleware\*.js middleware\
xcopy /Y /I dist\controllers\*.js utils\

echo Creating server.js...
copy dist\server.js server.js

echo Done!
pause
