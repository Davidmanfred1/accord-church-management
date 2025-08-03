# PowerShell script to set up Git repository for Accord Church Management System

Write-Host "Setting up Git repository for Accord Church Management System..." -ForegroundColor Green
Write-Host ""

try {
    # Configure Git with user information
    Write-Host "Configuring Git user information..." -ForegroundColor Yellow
    git config --global user.name "Davidmanfred1"
    git config --global user.email "davidmanfred573589170@gmail.com"

    # Initialize git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    
    # Add all files to staging
    Write-Host "Adding files to Git..." -ForegroundColor Yellow
    git add .
    
    # Create initial commit
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    $commitMessage = @"
Initial commit: Complete Accord Church Management System

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
- Local storage data persistence
"@
    
    git commit -m $commitMessage
    
    # Add remote repository
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/Davidmanfred1/accord-church-management.git
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main
    
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository URL: https://github.com/Davidmanfred1/accord-church-management" -ForegroundColor Cyan
    Write-Host ""
    
} catch {
    Write-Host "❌ Error occurred: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "1. Git is installed and configured" -ForegroundColor Yellow
    Write-Host "2. You have access to the GitHub repository" -ForegroundColor Yellow
    Write-Host "3. You're in the correct project directory" -ForegroundColor Yellow
}

Read-Host "Press Enter to continue..."
