# Demo Video Script

## Overview
This document outlines the script for a 3-5 minute demo video showcasing the Expense Tracker application's key features and functionality.

## Video Structure

### Minute 1: Introduction and Overview (0:00 - 1:00)
**Scene**: Application overview and introduction
**Script**:
"Welcome to the Expense Tracker demo. This is a full-stack web application built for the AI Campus Assignment, featuring secure user authentication, comprehensive expense management, and advanced filtering capabilities. Let me show you what makes this application special."

**Visuals to Show**:
- Landing page or login screen
- Quick overview of the technology stack (React, Node.js, PostgreSQL)
- Architecture diagram briefly
- Deployed application URL

**Key Points to Highlight**:
- Production-ready application
- Modern tech stack
- Secure authentication
- Responsive design

### Minute 2: Authentication and Security (1:00 - 2:00)
**Scene**: User registration and login process
**Script**:
"Let's start with user authentication. The application implements secure JWT-based authentication with refresh tokens. Watch as I register a new user with strong password validation, then demonstrate the login process."

**Visuals to Show**:
- Navigate to registration page
- Fill out registration form showing validation:
  - Email format validation
  - Username requirements (alphanumeric, 3+ chars)
  - Password requirements (uppercase, lowercase, digit)
- Show validation errors for weak passwords
- Complete successful registration
- Demonstrate automatic login after registration
- Show JWT tokens in browser dev tools (optional)

**Key Points to Highlight**:
- Client-side validation
- Server-side validation
- Secure password requirements
- JWT token management
- Automatic token refresh

### Minute 3: Expense Management Core Features (2:00 - 3:00)
**Scene**: Creating and managing expenses
**Script**:
"Now let's explore the core expense management features. I'll create several expenses demonstrating the automatic tax calculation, category selection, and recurring expense options."

**Visuals to Show**:
- Navigate to "Add New Expense"
- Create first expense:
  - Description: "Business lunch"
  - Category: FOOD
  - Amount: $45.00
  - Tax: 8.25%
  - Show live total calculation ($48.71)
- Create second expense:
  - Description: "Monthly bus pass"
  - Category: TRANSPORT
  - Amount: $120.00
  - Mark as recurring
  - Tax: 0%
- Create third expense:
  - Description: "Electric bill"
  - Category: UTILITIES
  - Amount: $85.50
  - Tax: 5%
  - Different date

**Key Points to Highlight**:
- Live total amount calculation
- Category selection with icons
- Recurring expense tracking
- Form validation
- Responsive design

### Minute 4: Advanced Features and Filtering (3:00 - 4:00)
**Scene**: Dashboard with filtering, sorting, and pagination
**Script**:
"The dashboard provides powerful filtering and search capabilities. Let me demonstrate the advanced features including pagination, category filtering, date range selection, and search functionality."

**Visuals to Show**:
- Navigate to Dashboard
- Show expense list with pagination
- Demonstrate filters:
  - Search by description ("lunch")
  - Filter by category (FOOD)
  - Date range filtering
  - Sort by amount (descending)
  - Change pagination limit (5 to 10 items)
- Show expense details page:
  - Click on an expense
  - Show detailed view with breakdown
  - Edit expense functionality
  - Update amount and tax, show recalculation
- Delete an expense with confirmation

**Key Points to Highlight**:
- Real-time search
- Multiple filter combinations
- Responsive table design
- Detailed expense view
- CRUD operations
- Confirmation dialogs

### Minute 5: Technical Excellence and Conclusion (4:00 - 5:00)
**Scene**: Technical features and wrap-up
**Script**:
"Let me highlight the technical excellence behind this application. The API is fully documented, the application includes comprehensive testing, and it's ready for production deployment."

**Visuals to Show**:
- Open browser dev tools to show:
  - Network requests with proper HTTP status codes
  - JWT tokens in request headers
  - Responsive design in mobile view
- Quick look at API documentation (Swagger/OpenAPI)
- Show test coverage results
- Demonstrate mobile responsiveness:
  - Resize browser window
  - Show mobile navigation
  - Mobile-friendly forms
- Security features:
  - Logout functionality
  - Automatic token refresh in action
  - Protected routes (try accessing dashboard after logout)

**Key Points to Highlight**:
- API documentation
- Comprehensive testing
- Mobile responsiveness
- Security implementation
- Production readiness
- Clean code architecture

**Closing Script**:
"This Expense Tracker demonstrates modern full-stack development practices with React, Node.js, and PostgreSQL. It features secure authentication, comprehensive CRUD operations, advanced filtering, and is fully tested and documented. The application is deployed and ready for production use, showcasing enterprise-level development standards."

## Technical Setup for Recording

### Prerequisites
- Screen recording software (OBS, Loom, or similar)
- Deployed application URLs
- Pre-populated test data (optional)
- Browser dev tools knowledge
- Stable internet connection

### Recording Settings
- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30fps
- **Audio**: Clear microphone, eliminate background noise
- **Browser**: Chrome or Firefox with dev tools ready

### Preparation Checklist
- [ ] Clear browser cache and cookies
- [ ] Test all features beforehand
- [ ] Prepare test user credentials
- [ ] Have API documentation ready
- [ ] Test responsive design breakpoints
- [ ] Verify all deployment URLs work
- [ ] Practice the script timing

### Post-Production
- [ ] Add title screen with project name
- [ ] Include technology stack overview
- [ ] Add captions/subtitles if needed
- [ ] Export in web-friendly format (MP4)
- [ ] Upload to platform (YouTube, Vimeo, etc.)
- [ ] Add description with deployment links

## Alternative 3-Minute Version

If a shorter version is needed, focus on:

**Minute 1**: Quick intro + Authentication (registration/login)
**Minute 2**: Core expense CRUD (create, view, edit, delete)
**Minute 3**: Advanced features (filtering, search) + Technical highlights

## Key Success Metrics to Demonstrate

1. **Functionality**: All CRUD operations work flawlessly
2. **Validation**: Both client and server-side validation
3. **Security**: Protected routes and token management
4. **UX**: Responsive design and intuitive interface
5. **Performance**: Fast loading and smooth interactions
6. **Code Quality**: Clean, documented, and tested code

## Troubleshooting During Recording

**If API is slow**: Mention it's due to free hosting cold starts
**If validation fails**: Show it as a feature, not a bug
**If responsive design breaks**: Refresh and try different breakpoint
**If authentication fails**: Have backup user credentials ready

This demo script ensures comprehensive coverage of all major features while maintaining engagement and demonstrating technical proficiency.
