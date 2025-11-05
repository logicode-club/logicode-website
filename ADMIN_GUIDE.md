# 🛡️ Logicode Admin Panel - Complete Guide

## 🔐 Admin Access & Security

### Creating the First Admin Account

**Method 1: Manual Database Creation (Recommended for First Admin)**

```bash
# 1. Start MongoDB
mongosh

# 2. Switch to logicode database
use logicode

# 3. Create admin user
db.users.insertOne({
    name: "Admin Name",
    email: "admin@logicode.com",
    password: "$2a$10$YourHashedPasswordHere",  // Use bcrypt to hash
    role: "admin",
    isActive: true,
    joinedDate: new Date(),
    profileImage: "/images/default-avatar.png"
})
```

**Method 2: Promote Existing User**

```bash
mongosh
use logicode

# Update existing user to admin
db.users.updateOne(
    { email: "user@example.com" },
    { $set: { role: "admin" } }
)
```

**Method 3: Via Registration + Database Update**

1. Register normally at `/register`
2. Update role in database:
```bash
db.users.updateOne(
    { email: "your-email@example.com" },
    { $set: { role: "admin" } }
)
```

### Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Role-Based Access** - Admin, Core, Member roles  
✅ **Protected Routes** - Middleware authorization  
✅ **Session Management** - Secure cookie handling  
✅ **CSRF Protection** - Built-in security headers  

### Access Levels

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Admin** | Full Access | All features + user management |
| **Core** | High Access | Content management (no user mgmt) |
| **Member** | Basic Access | View content, create blogs |

## 📊 Admin Panel Features

### 1. 🗓️ Event Management

**Access:** `/admin/events`

**Features:**
- ✅ Create new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ View participants
- ✅ Export participant list (CSV)
- ✅ Filter by status (upcoming/ongoing/completed)
- ✅ Event registration management

**Creating an Event:**

1. Click "Create Event" button
2. Fill in details:
   - Title (required)
   - Event Type (workshop/competition/hackathon/webinar/seminar/meetup)
   - Description (required)
   - Start & End Date/Time (required)
   - Venue (required)
   - Max Participants (optional)
   - Banner URL (optional)
   - Online Event (checkbox)
   - Registration Open (checkbox)
   - Event Code (optional - for access control)

3. Click "Save Event"

**Managing Participants:**
- Click participant count to view list
- Export to CSV for records
- See registration dates

**Event Types:**
- 🎓 **Workshop** - Learning sessions
- 🏆 **Competition** - Coding contests
- 💻 **Hackathon** - Build projects
- 🌐 **Webinar** - Online seminars
- 📢 **Seminar** - Knowledge sharing
- 🤝 **Meetup** - Community gatherings

### 2. 👥 User Management

**Access:** `/admin/users` (Admin only)

**Features:**
- ✅ View all users
- ✅ Change user roles
- ✅ Delete users
- ✅ View user details
- ✅ Filter by role
- ✅ Search users

**User Roles:**
- **Member** - Regular club members
- **Core** - Core team members (can manage content)
- **Admin** - Full administrative access

**Changing User Role:**
1. Go to User Management
2. Find the user
3. Click "Change Role"
4. Select new role (member/core/admin)
5. Confirm

**Safety Features:**
- Cannot delete your own account
- Confirmation required for deletions
- Role changes logged

### 3. 🧠 Test Management (MCQ Platform)

**Access:** `/admin/tests`

**Features:**
- ✅ Create new tests
- ✅ Add MCQ questions
- ✅ Set time limits
- ✅ Generate access codes
- ✅ View test results
- ✅ See leaderboard
- ✅ Export results (CSV)
- ✅ Anti-cheat tracking

**Creating a Test:**

1. Click "Create Test"
2. Fill in:
   - Test Title
   - Description
   - Duration (minutes)
   - Total Marks
   - Passing Marks
   - Access Code (optional)
   - Start & End Date
   - Max Attempts
   - Shuffle Questions (checkbox)
   - Show Results Immediately (checkbox)

3. Add Questions:
   - Question text
   - Options (A, B, C, D)
   - Correct answer
   - Marks
   - Negative marking (optional)
   - Difficulty level
   - Explanation (optional)

**Question Types:**
- Single Choice (MCQ)
- Multiple Choice
- True/False

**Anti-Cheat Features:**
- Tab switch detection
- Copy/paste disabled
- Right-click disabled
- Full-screen mode
- Time tracking
- Suspicious activity logging

**Viewing Results:**
- Individual scores
- Leaderboard with rankings
- Time taken per student
- Question-wise analysis
- Export to CSV/Excel

### 4. 💡 Project Gallery Management

**Access:** `/admin/projects`

**Features:**
- ✅ Add new projects
- ✅ Edit project details
- ✅ Delete projects
- ✅ Feature projects on homepage
- ✅ Mark winners
- ✅ Manage tech stack
- ✅ Add team members

**Adding a Project:**

1. Click "Add Project"
2. Fill in:
   - Title
   - Short Description
   - Full Description
   - Category (Web/AI/App/IoT/ML/Blockchain/Other)
   - Tech Stack (tags)
   - GitHub Link
   - Live Demo Link
   - Video Link (optional)
   - Thumbnail Image
   - Team Members
   - Status (ongoing/completed)
   - Featured (checkbox)
   - Winner (checkbox)

**Project Categories:**
- Web Development
- AI/ML
- Mobile App
- IoT
- Blockchain
- Game Development
- Other

### 5. 📢 Announcements / Notifications

**Features:**
- ✅ Create announcements
- ✅ Display on homepage
- ✅ Edit/delete announcements
- ✅ Set expiry dates
- ✅ Priority levels

**Creating Announcement:**

```javascript
// Example announcement
{
    title: "🔥 New Event: CodeStorm 2.0",
    message: "Register now for our biggest hackathon!",
    type: "event",  // event/info/warning/success
    priority: "high",  // low/medium/high
    expiresAt: "2024-12-31",
    link: "/events/codestorm-2024"
}
```

### 6. 📰 Blog Management

**Access:** `/admin/blogs`

**Features:**
- ✅ Approve pending blogs
- ✅ Reject with reason
- ✅ Edit blog content
- ✅ Delete blogs
- ✅ Feature blogs
- ✅ Manage categories

**Blog Approval Workflow:**

1. Member submits blog (status: pending)
2. Admin/Core reviews in admin panel
3. Options:
   - **Approve** → Published immediately
   - **Reject** → Sent back with reason
   - **Edit** → Make changes before publishing

**Blog Status:**
- **Draft** - Not submitted
- **Pending** - Awaiting approval
- **Published** - Live on website
- **Rejected** - Needs revision

**Approving a Blog:**
1. Go to Blog Management
2. Click "Pending" tab
3. Review blog content
4. Click "Approve" or "Reject"
5. If rejecting, provide reason

### 7. 📬 Contact Messages

**Access:** `/admin/contacts`

**Features:**
- ✅ View all messages
- ✅ Mark as read
- ✅ Reply to messages
- ✅ Delete messages
- ✅ Export messages

**Managing Messages:**
- New messages highlighted
- Click to view full message
- Mark as read/unread
- Delete spam

## 🎯 Admin Dashboard

**Access:** `/admin`

**Dashboard Widgets:**

1. **Statistics Cards**
   - Total Users (active count)
   - Total Events (upcoming count)
   - Total Projects (featured count)
   - Total Blogs (pending count)

2. **Quick Actions**
   - Create Event
   - Add Project
   - Create Test
   - Approve Blogs

3. **Recent Activity**
   - New user registrations
   - Recent events
   - Recent blog posts

4. **Management Links**
   - User Management
   - Event Management
   - Project Management
   - Blog Management
   - Test Management
   - Contact Messages

## 📊 Data Export

### Export Formats:
- **CSV** - Excel compatible
- **JSON** - For developers
- **PDF** - For reports (future)

### What Can Be Exported:
- Event participants
- Test results
- User lists
- Contact messages
- Blog analytics

### Exporting Data:

**Event Participants:**
```
GET /api/admin/events/:id/export
```

**Test Results:**
```
GET /api/admin/tests/:id/export
```

## 🔧 Admin API Endpoints

### Statistics
```
GET /api/admin/stats
```

### User Management
```
GET    /api/admin/users           - Get all users
PUT    /api/admin/users/:id/role  - Update user role
DELETE /api/admin/users/:id       - Delete user
```

### Blog Approval
```
GET /api/admin/blogs/pending      - Get pending blogs
PUT /api/admin/blogs/:id/approve  - Approve blog
PUT /api/admin/blogs/:id/reject   - Reject blog
```

### Data Export
```
GET /api/admin/events/:id/export  - Export participants CSV
GET /api/admin/tests/:id/export   - Export results CSV
```

## 🛡️ Best Practices

### Security:
1. ✅ Use strong passwords
2. ✅ Don't share admin credentials
3. ✅ Regularly review user roles
4. ✅ Monitor suspicious activity
5. ✅ Keep only necessary admins

### Content Management:
1. ✅ Review blogs before approving
2. ✅ Verify event details
3. ✅ Test MCQs before publishing
4. ✅ Keep project info updated
5. ✅ Respond to contact messages

### Data Management:
1. ✅ Regular database backups
2. ✅ Export important data
3. ✅ Clean old/unused data
4. ✅ Monitor storage usage

## 🆘 Troubleshooting

### Cannot Access Admin Panel:
- Check if logged in
- Verify role is 'admin' or 'core'
- Clear browser cache
- Check console for errors

### Changes Not Saving:
- Check internet connection
- Verify form validation
- Check browser console
- Try refreshing page

### Users Can't Register for Events:
- Check registration is open
- Verify max participants not reached
- Check event status

## 📞 Support

For admin-related issues:
1. Check this guide
2. Review error messages
3. Check browser console
4. Contact development team

---

**Admin Panel Version:** 1.0  
**Last Updated:** 2024  
**Maintained by:** Logicode Team

