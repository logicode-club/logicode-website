# 🎯 Getting Started with Logicode Website

Welcome! This guide will help you get the Logicode website up and running quickly.

## 📋 What You Have

A professional, full-stack website with:
- ✅ **Backend**: Node.js + Express + MongoDB
- ✅ **Frontend**: EJS templates with 3D animated backgrounds
- ✅ **Features**: Events, Projects, Blogs, Test Platform, Admin Panel
- ✅ **Security**: JWT auth, password hashing, rate limiting
- ✅ **Responsive**: Works on all devices

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Set Up Environment
```bash
# Copy the example file
cp ../.env.example ../.env
```

Edit `.env` and set:
```env
MONGODB_URI=mongodb://localhost:27017/logicode
JWT_SECRET=your_random_secret_key_here
```

### Step 3: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Run the Server
```bash
npm run dev
```

### Step 5: Open Browser
```
http://localhost:3000
```

🎉 **You're live!**

## 🎨 What's Working Right Now

### ✅ Fully Functional Pages
1. **Home Page** (`/`)
   - 3D animated background
   - Animated counters
   - Featured events and projects

2. **About Page** (`/about`)
   - Mission and vision
   - Core values
   - President's message

3. **Contact Page** (`/contact`)
   - Working contact form
   - Contact information
   - Map integration

4. **Login Page** (`/login`)
   - User authentication
   - Password toggle
   - Form validation

5. **Register Page** (`/register`)
   - User registration
   - Field validation
   - Password confirmation

6. **Error Page** (`/error`)
   - Custom error messages
   - Navigation options

### ✅ Working Backend APIs

All these endpoints are ready to use:

**Authentication**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

**Events**
- `GET /api/events` - List all events
- `POST /api/events` - Create event (Admin)
- `POST /api/events/:id/register` - Register for event

**Projects**
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project (Admin)

**Blogs**
- `GET /api/blogs` - List all blogs
- `POST /api/blogs` - Create blog post

**Tests**
- `GET /api/tests/access/:code` - Access test
- `POST /api/tests/:id/submit` - Submit test

**Admin**
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/tests/:id/export` - Export results

## 🔧 What Needs to Be Done

### 1. Create Remaining View Pages

You need to create these EJS files in the `views/` folder:

- `team.ejs` - Team members page
- `projects.ejs` - Projects showcase
- `events.ejs` - Events listing
- `blogs.ejs` - Blog posts
- `gallery.ejs` - Photo gallery
- `dashboard.ejs` - Member dashboard
- `admin/` folder - Admin panel pages

**Template for new pages:**
```ejs
<%- include('partials/header') %>

<!-- Your content here -->
<section class="page-header">
    <div class="container">
        <h1 class="page-title">Page <span class="gradient-text">Title</span></h1>
    </div>
</section>

<%- include('partials/footer') %>
```

### 2. Add Images

Add these images to `public/images/`:
- `logo.png` - Your club logo
- `hero-illustration.svg` - Hero section image
- `default-avatar.png` - Default user avatar
- `default-event.jpg` - Event placeholder
- `default-project.jpg` - Project placeholder
- `default-blog.jpg` - Blog placeholder

### 3. Create Your First Admin User

```bash
# Method 1: Register and update role
# 1. Go to /register and create account
# 2. Run this in MongoDB:

mongosh
use logicode
db.users.updateOne(
    { email: "your-email@example.com" },
    { $set: { role: "admin" } }
)
```

### 4. Test the Features

1. **Register a new user**
   - Go to `/register`
   - Fill in the form
   - Submit

2. **Login**
   - Go to `/login`
   - Use your credentials
   - You should be redirected

3. **Create an event** (as admin)
   ```javascript
   // Use Postman or similar
   POST http://localhost:3000/api/events
   Headers: Cookie: token=your_jwt_token
   Body: {
       "title": "First Coding Workshop",
       "description": "Learn web development",
       "eventType": "workshop",
       "startDate": "2024-12-01",
       "endDate": "2024-12-01",
       "venue": "Computer Lab",
       "isOnline": false
   }
   ```

## 📚 Understanding the Structure

```
logicode-website/
├── backend/
│   ├── config/          # Database setup
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & errors
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   └── index.js         # Server entry
│
├── views/
│   ├── partials/        # Reusable components
│   ├── auth/            # Login/Register
│   └── *.ejs            # Page templates
│
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Client scripts
│   └── images/          # Static images
│
└── Documentation files
```

## 🎓 Learning Resources

### Understanding the Code

1. **Backend (Node.js + Express)**
   - `backend/index.js` - Server setup
   - `backend/models/` - Database structure
   - `backend/routes/` - API endpoints

2. **Frontend (EJS + CSS + JS)**
   - `views/` - HTML templates
   - `public/css/` - Styling
   - `public/js/` - Interactivity

3. **Database (MongoDB)**
   - Models define data structure
   - Mongoose handles database operations

### Key Concepts

**Authentication Flow:**
1. User registers → Password hashed → Saved to DB
2. User logs in → Password verified → JWT token created
3. Token stored in cookie → Used for protected routes

**Role-Based Access:**
- `member` - Regular users
- `core` - Core team members
- `admin` - Full access

**API Structure:**
- Public routes - Anyone can access
- Protected routes - Require login
- Admin routes - Require admin role

## 🔍 Debugging Tips

### Server won't start?
```bash
# Check if MongoDB is running
mongosh

# Check if port 3000 is free
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux
```

### Can't connect to database?
```bash
# Verify MongoDB is running
mongosh

# Check MONGODB_URI in .env
# Should be: mongodb://localhost:27017/logicode
```

### Login not working?
```bash
# Check JWT_SECRET is set in .env
# Clear browser cookies
# Check console for errors
```

## 🎨 Customization Guide

### Change Colors
Edit `public/css/style.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change this */
    --secondary-color: #8b5cf6; /* And this */
}
```

### Update Club Info
Edit `views/about.ejs` and other pages to update:
- Club name
- Mission statement
- Contact information
- Social media links

### Add New Features
1. Create model in `backend/models/`
2. Create routes in `backend/routes/`
3. Create view in `views/`
4. Add styling in `public/css/`

## 📞 Need Help?

### Common Issues

**"Module not found"**
```bash
cd backend
npm install
```

**"Cannot connect to MongoDB"**
```bash
# Start MongoDB service
net start MongoDB  # Windows
```

**"Port already in use"**
```bash
# Change PORT in .env
PORT=3001
```

### Documentation

- [README.md](README.md) - Full documentation
- [SETUP.md](SETUP.md) - Detailed setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - What's included

## 🎯 Next Steps

1. ✅ Get the server running
2. ✅ Create your admin account
3. ✅ Add club logo and images
4. ✅ Create remaining view pages
5. ✅ Add real content (events, projects, blogs)
6. ✅ Test all features
7. ✅ Deploy to production

## 🎉 You're Ready!

You now have a professional coding club website with:
- Modern, responsive design
- 3D animated backgrounds
- Secure authentication
- Event management
- Project showcase
- Blog system
- Test platform
- Admin panel

**Start building and make it yours!**

---

**Questions?** Check the documentation or contact the Logicode team.

**Happy Coding! 🚀**

Made with ❤️ by Logicode Team

