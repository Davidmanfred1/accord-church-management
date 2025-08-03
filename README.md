# Accord Church Management System

A comprehensive church management system built with HTML, CSS, and JavaScript. This system provides a complete solution for managing church members, events, donations, and generating reports.

## Features

### 🏠 Dashboard
- Overview of key statistics (members, events, donations)
- Recent activities feed
- Upcoming events display
- Quick action buttons for common tasks

### 👥 Member Management
- Add, edit, and delete member records
- Comprehensive member profiles with contact information
- Membership status tracking (Active, Inactive, Visitor)
- Search and filter capabilities
- Export member data to CSV

### 📅 Event Management
- Create and manage church events
- Calendar and list view options
- Event categorization (Service, Bible Study, Meeting, Social)
- Attendance tracking for events
- Recurring event support

### 💰 Donation Tracking
- Record and manage donations
- Multiple donation types (Tithe, Offering, Special, Building Fund, Mission)
- Payment method tracking
- Financial reporting and analytics
- Export donation records

### 📊 Reports & Analytics
- Member reports with demographics
- Financial reports with donation breakdowns
- Event attendance reports
- Growth analysis over time
- Exportable report data

### 🔐 Authentication
- Simple login system
- Role-based access control
- Secure data storage

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: Local Storage (browser-based)
- **Icons**: Font Awesome 6.0
- **Responsive**: Mobile-first design

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

### Project Structure

```
accord-church/
├── index.html              # Main application file
├── css/
│   ├── styles.css          # Main stylesheet
│   └── dashboard.css       # Dashboard-specific styles
├── js/
│   ├── app.js             # Main application logic
│   ├── dashboard.js       # Dashboard functionality
│   ├── members.js         # Member management
│   ├── events.js          # Event management
│   ├── donations.js       # Donation tracking
│   ├── reports.js         # Reports and analytics
│   └── utils.js           # Utility functions
└── README.md              # This file
```

## Usage

### First Time Setup

1. **Login**: Use the default admin credentials to access the system
2. **Add Members**: Start by adding church members through the Members section
3. **Create Events**: Set up church events and services
4. **Record Donations**: Begin tracking donations and financial contributions
5. **Generate Reports**: Use the Reports section to analyze church data

### Key Features

#### Member Management
- Click "Add Member" to register new church members
- Use search and filters to find specific members
- Edit member information by clicking the "Edit" button
- Export member data for external use

#### Event Planning
- Create events with detailed information
- Switch between list and calendar views
- Track attendance for each event
- Set up recurring events for regular services

#### Financial Tracking
- Record donations with member attribution
- Categorize donations by type and method
- Generate financial reports and summaries
- Export financial data for accounting

#### Reporting
- Access comprehensive reports from the Reports section
- View member demographics and growth trends
- Analyze donation patterns and financial health
- Export reports for presentations or records

## Data Storage

The system uses browser Local Storage to persist data. This means:
- Data is stored locally on each device
- No internet connection required after initial load
- Data persists between browser sessions
- Each browser/device maintains separate data

### Data Backup

To backup your data:
1. Use the export functions in each section
2. Save the exported CSV files
3. For complete backup, export from all sections

## Customization

### Styling
- Modify `css/styles.css` for global styling changes
- Update CSS variables in `:root` for color scheme changes
- Responsive breakpoints can be adjusted in media queries

### Functionality
- Add new features by extending the JavaScript modules
- Modify form fields in the respective manager classes
- Add new report types in `reports.js`

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Considerations

This is a client-side application suitable for:
- Small churches with trusted users
- Demo and development purposes
- Local church administration

For production use with sensitive data, consider:
- Implementing server-side authentication
- Using encrypted data storage
- Adding user role management
- Regular data backups

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or questions:
- Check the code comments for implementation details
- Review the browser console for error messages
- Ensure browser compatibility requirements are met

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Font Awesome for icons
- Modern CSS Grid and Flexbox for layouts
- Local Storage API for data persistence

---

**Accord Church Management System** - Simplifying church administration with modern web technology.
