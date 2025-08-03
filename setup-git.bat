@echo off
echo Setting up Git repository for Accord Church Management System...
echo.

REM Configure Git with user information
echo Configuring Git user information...
git config --global user.name "Davidmanfred1"
git config --global user.email "davidmanfred573589170@gmail.com"

REM Initialize git repository
echo Initializing Git repository...
git init

REM Add all files to staging
echo Adding files to Git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Complete Accord Church Management System

Features included:
- Enhanced Dashboard with real-time statistics
- Comprehensive Member Management system
- Full Event Management with calendar integration
- Complete Donation tracking and reporting
- Ministry Management with volunteer coordination
- Advanced Reports and Analytics system
- Comprehensive Settings and Configuration
- Responsive design for all devices
- Modern UI with professional styling
- Local storage data persistence"

REM Add remote repository
echo Adding remote repository...
git remote add origin https://github.com/Davidmanfred1/accord-church-management.git

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Successfully pushed to GitHub!
echo Repository URL: https://github.com/Davidmanfred1/accord-church-management
echo.
pause
