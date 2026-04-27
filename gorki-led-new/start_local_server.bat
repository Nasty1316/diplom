@echo off
echo Запуск локального PHP сервера для доступа к базе данных...
echo Сервер будет запущен на http://localhost:8000
echo Нажмите Ctrl+C для остановки сервера
echo.
cd /d "%~dp0"
php -S localhost:8000
pause
