@echo off
:: cd C:\Users\USER\Desktop\hp
title Local Web Server (Python 3)

:: Pastikan Python 3 terinstal dan dapat diakses.
:: Periksa apakah Python ada di PATH
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Python 3 not found in your system's PATH.
    echo Please install Python 3 or add it to your PATH environment variable.
    echo Visit https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

:: Mencoba jalankan server Python 3 di port 8000
echo.
echo Starting local web server using Python 3 on port 8000...
echo.
echo Available HTML files:
echo ----------------------------------------

:: Scan dan tampilkan semua file HTML
setlocal enabledelayedexpansion
set count=0
for %%f in (*.html) do (
    set /a count+=1
    echo   http://localhost:8000/%%f
)

if !count! equ 0 (
    echo   No HTML files found in current directory.
) else (
    echo ----------------------------------------
    echo Total: !count! HTML file^(s^) found
)

echo.
echo Press Ctrl+C in this window to stop the server.
echo.

:: Menjalankan server Python 3
:: -m http.server adalah modul server HTTP sederhana bawaan Python 3
python -m http.server 8000

echo.
echo Server stopped.
pause
