# Deployment Guide - Accord Church Management System

This guide will help you deploy the Accord Church Management System to GitHub and set up hosting.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Git installed** on your computer
   - Download from: https://git-scm.com/downloads
   - Verify installation: `git --version`

2. **GitHub account** 
   - Sign up at: https://github.com
   - Repository created: https://github.com/Davidmanfred1/accord-church-management

3. **Git configured** with your credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## 🚀 Quick Deployment

### Option 1: Using the Setup Script (Recommended)

1. **Navigate to your project directory** in Command Prompt or PowerShell
2. **Run the setup script:**
   
   **For Command Prompt:**
   ```cmd
   setup-git.bat
   ```
   
   **For PowerShell:**
   ```powershell
   .\setup-git.ps1
   ```

3. **Follow the prompts** and wait for completion

### Option 2: Manual Setup

If you prefer to set up manually, follow these steps:

1. **Open Command Prompt or PowerShell** in your project directory

2. **Initialize Git repository:**
   ```bash
   git init
   ```

3. **Add all files:**
   ```bash
   git add .
   ```

4. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: Complete Accord Church Management System"
   ```

5. **Add remote repository:**
   ```bash
   git remote add origin https://github.com/Davidmanfred1/accord-church-management.git
   ```

6. **Push to GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

## 🌐 Hosting Options

### Option 1: GitHub Pages (Free)

1. **Go to your repository** on GitHub
2. **Click Settings** tab
3. **Scroll to Pages** section
4. **Select source:** Deploy from a branch
5. **Select branch:** main
6. **Select folder:** / (root)
7. **Click Save**

Your site will be available at: `https://davidmanfred1.github.io/accord-church-management/`

### Option 2: Netlify (Free)

1. **Go to** https://netlify.com
2. **Sign up/Login** with GitHub
3. **Click "New site from Git"**
4. **Choose GitHub** and select your repository
5. **Deploy settings:**
   - Branch: main
   - Build command: (leave empty)
   - Publish directory: (leave empty)
6. **Click Deploy**

### Option 3: Vercel (Free)

1. **Go to** https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your repository**
5. **Deploy with default settings**

### Option 4: Firebase Hosting (Free)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```

4. **Deploy:**
   ```bash
   firebase deploy
   ```

## 📁 Project Structure

After deployment, your repository will contain:

```
accord-church-management/
├── index.html              # Main dashboard
├── pages/                  # Page components
│   ├── members.html
│   ├── events.html
│   ├── donations.html
│   ├── ministries.html
│   ├── reports.html
│   └── settings.html
├── css/                    # Stylesheets
│   ├── styles.css
│   ├── members.css
│   ├── events.css
│   ├── donations.css
│   ├── ministries.css
│   ├── reports.css
│   └── settings.css
├── js/                     # JavaScript files
│   ├── utils.js
│   ├── members-enhanced.js
│   ├── events-enhanced.js
│   ├── donations-enhanced.js
│   ├── ministries-enhanced.js
│   ├── reports-enhanced.js
│   └── settings-enhanced.js
├── README.md               # Documentation
├── DEPLOYMENT.md           # This file
├── .gitignore             # Git ignore rules
├── setup-git.bat          # Windows batch script
└── setup-git.ps1          # PowerShell script
```

## 🔧 Configuration

### Custom Domain (Optional)

If you want to use a custom domain:

1. **For GitHub Pages:**
   - Add a `CNAME` file with your domain
   - Configure DNS settings

2. **For Netlify/Vercel:**
   - Add domain in dashboard
   - Configure DNS settings

### Environment Variables

For production deployment, consider:

- Setting up proper error logging
- Configuring analytics
- Adding security headers
- Setting up SSL certificates

## 🛠️ Maintenance

### Updating the System

1. **Make changes** to your local files
2. **Add and commit changes:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. **Push to GitHub:**
   ```bash
   git push
   ```

### Backup Strategy

- **GitHub serves as primary backup**
- **Export data regularly** from the system
- **Keep local copies** of important configurations

## 🆘 Troubleshooting

### Common Issues

1. **Git not recognized:**
   - Install Git from https://git-scm.com/downloads
   - Restart Command Prompt/PowerShell

2. **Permission denied:**
   - Check GitHub credentials
   - Use personal access token if needed

3. **Repository not found:**
   - Verify repository URL
   - Check repository permissions

4. **Files not uploading:**
   - Check .gitignore file
   - Verify file paths

### Getting Help

- **GitHub Issues:** Create an issue in the repository
- **Documentation:** Check README.md for detailed information
- **Community:** Search for similar issues online

## ✅ Verification

After deployment, verify:

1. **Repository is accessible** on GitHub
2. **All files are uploaded** correctly
3. **Website loads** properly (if using hosting)
4. **All features work** as expected
5. **Mobile responsiveness** is maintained

## 🎉 Success!

Once deployed, your Accord Church Management System will be:

- ✅ **Backed up** on GitHub
- ✅ **Version controlled** for easy updates
- ✅ **Accessible** from anywhere
- ✅ **Ready for collaboration**
- ✅ **Professional** and reliable

---

**Need help?** Create an issue in the GitHub repository or contact the development team.
