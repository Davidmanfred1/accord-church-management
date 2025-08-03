# Installation Guide - Accord Church Management System

## Quick Start

### Option 1: Direct Browser Access (Recommended)
1. Download or clone all project files to your computer
2. Open `index.html` in any modern web browser
3. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### Option 2: Local Web Server (Optional)
If you prefer to run through a local server:

#### Using Python (if installed):
```bash
# Navigate to project directory
cd accord-church

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Open browser to: http://localhost:8000
```

#### Using Node.js (if installed):
```bash
# Install a simple server
npm install -g http-server

# Navigate to project directory
cd accord-church

# Start server
http-server

# Open browser to displayed URL (usually http://localhost:8080)
```

## System Requirements

### Minimum Requirements
- **Browser**: Chrome 60+, Firefox 55+, Safari 12+, or Edge 79+
- **Storage**: 10MB free disk space
- **Memory**: 512MB RAM
- **Internet**: Required only for initial Font Awesome icon loading

### Recommended
- **Browser**: Latest version of Chrome, Firefox, Safari, or Edge
- **Storage**: 50MB free disk space for data growth
- **Memory**: 1GB RAM
- **Screen**: 1024x768 minimum resolution

## File Structure Verification

Ensure your project directory contains these files:

```
accord-church/
├── index.html                 ✓ Main application
├── README.md                  ✓ Documentation
├── INSTALLATION.md            ✓ This file
├── demo-data.json            ✓ Sample data
├── css/
│   ├── styles.css            ✓ Main styles
│   └── dashboard.css         ✓ Dashboard styles
└── js/
    ├── app.js                ✓ Main application
    ├── dashboard.js          ✓ Dashboard logic
    ├── members.js            ✓ Member management
    ├── events.js             ✓ Event management
    ├── donations.js          ✓ Donation tracking
    ├── reports.js            ✓ Reports system
    └── utils.js              ✓ Utilities
```

## First Time Setup

### 1. Initial Login
- Open the application in your browser
- You'll see a login modal automatically
- Use the default credentials: `admin` / `admin123`

### 2. Load Demo Data (Optional)
To quickly populate the system with sample data:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Copy and paste the contents of `demo-data.json`
4. Run: `localStorage.setItem('accordChurchData', JSON.stringify(demoData))`
5. Refresh the page

### 3. Start Adding Your Data
- **Members**: Add your church members first
- **Events**: Create upcoming church events
- **Donations**: Record financial contributions
- **Reports**: Generate insights from your data

## Troubleshooting

### Common Issues

#### 1. Blank Page or Errors
**Problem**: Page doesn't load or shows JavaScript errors
**Solutions**:
- Ensure all files are in correct locations
- Check browser console for error messages
- Try a different browser
- Disable browser extensions temporarily

#### 2. Login Not Working
**Problem**: Can't login with default credentials
**Solutions**:
- Ensure JavaScript is enabled
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check for browser popup blockers

#### 3. Data Not Saving
**Problem**: Changes don't persist after refresh
**Solutions**:
- Check if Local Storage is enabled
- Ensure sufficient disk space
- Try a different browser
- Check for browser privacy settings blocking storage

#### 4. Icons Not Showing
**Problem**: Font Awesome icons appear as squares
**Solutions**:
- Check internet connection (icons load from CDN)
- Wait for page to fully load
- Refresh the page
- Check if CDN is blocked by firewall

#### 5. Mobile Display Issues
**Problem**: Layout broken on mobile devices
**Solutions**:
- Ensure viewport meta tag is present
- Try rotating device orientation
- Use latest mobile browser version
- Clear mobile browser cache

### Browser-Specific Issues

#### Chrome
- If Local Storage is disabled: Go to Settings > Privacy > Site Settings > Cookies > Allow all cookies

#### Firefox
- If Local Storage is disabled: Go to Preferences > Privacy & Security > Custom > Cookies > Accept cookies

#### Safari
- If Local Storage is disabled: Go to Preferences > Privacy > Manage Website Data > Allow

#### Edge
- If Local Storage is disabled: Go to Settings > Site permissions > Cookies and site data > Allow

## Data Management

### Backup Your Data
1. **Export from each section**: Use export buttons in Members, Events, and Donations
2. **Manual backup**: Copy Local Storage data from browser Developer Tools
3. **Regular exports**: Set up routine to export data weekly/monthly

### Restore Data
1. **Import CSV files**: Use the import functions (if available)
2. **Manual restore**: Paste data into Local Storage via Developer Tools
3. **Fresh start**: Clear Local Storage and re-enter data

### Data Location
- **Storage**: Browser Local Storage
- **Scope**: Per browser, per domain
- **Persistence**: Until manually cleared or browser data reset

## Security Considerations

### Default Setup
- Uses simple client-side authentication
- Data stored in browser Local Storage
- Suitable for trusted environments only

### Enhanced Security (Recommendations)
- Change default login credentials in `app.js`
- Implement server-side authentication
- Use encrypted data storage
- Regular data backups
- User access logging

## Performance Optimization

### For Large Datasets
- Regular data cleanup and archiving
- Export old records periodically
- Monitor browser memory usage
- Consider pagination for large lists

### Browser Performance
- Close unnecessary browser tabs
- Clear browser cache regularly
- Update to latest browser version
- Disable unnecessary browser extensions

## Getting Help

### Self-Help Resources
1. Check browser console for error messages
2. Review this installation guide
3. Read the main README.md file
4. Test in different browsers

### Technical Support
- Ensure you've followed all installation steps
- Note your browser version and operating system
- Document any error messages
- Try the troubleshooting steps above

## Next Steps

After successful installation:
1. **Customize**: Modify colors, church name, and settings
2. **Add Data**: Start with members, then events and donations
3. **Train Users**: Show others how to use the system
4. **Backup Plan**: Establish regular data export routine
5. **Feedback**: Note any features you'd like to see added

---

**Need Help?** Check the troubleshooting section above or review the browser console for specific error messages.
