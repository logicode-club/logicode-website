# 🚀 Admin Panel - Quick Reference Card

## 🔐 First Time Setup

### Create Admin Account
```bash
# Method 1: Register + Promote
1. Register at /register
2. Run in MongoDB:
   mongosh
   use logicode
   db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
   )

# Method 2: Direct Creation
mongosh
use logicode
db.users.insertOne({
    name: "Admin",
    email: "admin@logicode.com",
    password: "$2a$10$...",  // bcrypt hash
    role: "admin",
    isActive: true,
    joinedDate: new Date()
})
```

### Access Admin Panel
```
1. Login: http://localhost:3000/login
2. Dashboard: http://localhost:3000/admin
```

## 📍 Admin URLs

| Feature | URL | Access |
|---------|-----|--------|
| Dashboard | `/admin` | Admin, Core |
| Events | `/admin/events` | Admin, Core |
| Users | `/admin/users` | Admin only |
| Blogs | `/admin/blogs` | Admin, Core |
| Projects | `/admin/projects` | Admin, Core |
| Tests | `/admin/tests` | Admin, Core |
| Messages | `/admin/contacts` | Admin, Core |

## 🎯 Quick Actions

### Create Event
```
1. Go to /admin/events
2. Click "Create Event"
3. Fill: Title, Type, Date, Venue
4. Save
```

### Approve Blog
```
1. Go to /admin/blogs
2. Click "Pending" tab
3. Review blog
4. Click "Approve" or "Reject"
```

### Change User Role
```
1. Go to /admin/users
2. Find user
3. Click "Change Role"
4. Select: member/core/admin
```

### Export Data
```
Event Participants:
/api/admin/events/:id/export

Test Results:
/api/admin/tests/:id/export
```

## 🔑 API Endpoints

### Statistics
```
GET /api/admin/stats
```

### Users (Admin only)
```
GET    /api/admin/users
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

### Blogs
```
GET /api/admin/blogs/pending
PUT /api/admin/blogs/:id/approve
PUT /api/admin/blogs/:id/reject
```

### Export
```
GET /api/admin/events/:id/export
GET /api/admin/tests/:id/export
```

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Everything + user management |
| **Core** | Content management (no user mgmt) |
| **Member** | View + create blogs |

## 🛡️ Security Checklist

- [ ] Strong admin password
- [ ] Limited admin accounts
- [ ] Regular role reviews
- [ ] Monitor activity logs
- [ ] Database backups

## 📊 Dashboard Stats

**Shows:**
- Total Users (active count)
- Total Events (upcoming)
- Total Projects (featured)
- Total Blogs (pending)
- Recent Activities

## 🎨 Event Types

- Workshop
- Competition
- Hackathon
- Webinar
- Seminar
- Meetup

## 📝 Blog Status

- **Draft** - Not submitted
- **Pending** - Awaiting approval
- **Published** - Live
- **Rejected** - Needs revision

## 🧠 Test Features

- Timer-based
- MCQ questions
- Access codes
- Leaderboard
- Anti-cheat
- CSV export

## 🆘 Troubleshooting

### Can't Access Admin Panel
```
1. Check if logged in
2. Verify role: db.users.findOne({email: "..."})
3. Clear browser cache
4. Check console errors
```

### Changes Not Saving
```
1. Check internet connection
2. Open browser console (F12)
3. Look for error messages
4. Try refreshing page
```

### Export Not Working
```
1. Check if data exists
2. Verify admin access
3. Try different browser
```

## 📞 Support

**Documentation:**
- ADMIN_GUIDE.md - Full guide
- ADMIN_IMPLEMENTATION_SUMMARY.md - Technical details
- README.md - Project overview

**Common Issues:**
- Check browser console (F12)
- Verify MongoDB is running
- Check server logs
- Review error messages

## 🎯 Best Practices

### Content Management
✅ Review before approving  
✅ Verify event details  
✅ Test MCQs before publishing  
✅ Keep info updated  
✅ Respond to messages  

### Security
✅ Strong passwords  
✅ Don't share credentials  
✅ Regular role reviews  
✅ Monitor activity  
✅ Limit admin accounts  

### Data Management
✅ Regular backups  
✅ Export important data  
✅ Clean old data  
✅ Monitor storage  

## 🚀 Quick Start Workflow

### Day 1: Setup
1. Create admin account
2. Login to admin panel
3. Explore dashboard
4. Review documentation

### Day 2: Content
1. Create first event
2. Add projects
3. Set up test platform
4. Configure settings

### Day 3: Management
1. Invite team members
2. Assign roles
3. Review pending blogs
4. Export data for records

## 📈 Regular Tasks

### Daily
- Check pending blogs
- Review new registrations
- Respond to messages

### Weekly
- Review user roles
- Check event registrations
- Export participant lists
- Monitor statistics

### Monthly
- Database backup
- Clean old data
- Review analytics
- Update content

## 🎉 Success Metrics

Track these in dashboard:
- User growth
- Event participation
- Blog submissions
- Test completion rates
- Project submissions

---

**Quick Reference Version:** 1.0  
**For:** Logicode Admin Team  
**Updated:** 2024

