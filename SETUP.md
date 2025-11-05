# 🚀 Logicode Website - Setup Guide

This guide will help you set up the Logicode website on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- A code editor (VS Code recommended)

## 🔧 Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/logicode-tkiet/logicode-website.git
cd logicode-website
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- express
- mongoose
- ejs
- bcryptjs
- jsonwebtoken
- cookie-parser
- helmet
- express-rate-limit
- and more...

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/logicode

# JWT Secret (Change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Email Configuration (Optional - for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@logicode.com
ADMIN_PASSWORD=admin123

# Session Secret
SESSION_SECRET=your_session_secret_key

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads
```

### 4. Start MongoDB

#### On Windows:
```bash
net start MongoDB
```

#### On macOS:
```bash
brew services start mongodb-community
```

#### On Linux:
```bash
sudo systemctl start mongod
```

To verify MongoDB is running:
```bash
mongosh
# or
mongo
```

### 5. Create Initial Admin User

You can create an admin user in two ways:

#### Option 1: Using MongoDB Shell
```bash
mongosh
use logicode

db.users.insertOne({
    name: "Admin",
    email: "admin@logicode.com",
    password: "$2a$10$YourHashedPasswordHere",
    role: "admin",
    isActive: true,
    joinedDate: new Date()
})
```

#### Option 2: Register via Website
1. Start the server (see step 6)
2. Go to `http://localhost:3000/register`
3. Register with your details
4. Manually update the role in MongoDB:
```bash
mongosh
use logicode
db.users.updateOne(
    { email: "your-email@example.com" },
    { $set: { role: "admin" } }
)
```

### 6. Start the Application

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🚀 LOGICODE SERVER RUNNING 🚀              ║
║                                                       ║
║   Environment: development                            ║
║   Port: 3000                                          ║
║   URL: http://localhost:3000                          ║
║                                                       ║
║   Think | Code | Innovate                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### 7. Access the Website

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎨 Adding Images

Add the following images to `public/images/`:

1. **logo.png** - Club logo (recommended: 200x200px)
2. **hero-illustration.svg** - Hero section illustration
3. **default-avatar.png** - Default user avatar
4. **default-event.jpg** - Default event banner
5. **default-project.jpg** - Default project thumbnail
6. **default-blog.jpg** - Default blog cover
7. **about-preview.jpg** - About section image
8. **login-illustration.svg** - Login page illustration
9. **register-illustration.svg** - Register page illustration

## 🗄️ Database Collections

The application will automatically create these collections:

- **users** - User accounts and profiles
- **events** - Club events
- **projects** - Member projects
- **blogs** - Blog posts
- **tests** - MCQ tests
- **questions** - Test questions
- **results** - Test results
- **contacts** - Contact form submissions

## 🔐 Default Routes

### Public Routes
- `/` - Home page
- `/about` - About us
- `/team` - Team members
- `/projects` - Projects showcase
- `/events` - Events listing
- `/blogs` - Blog posts
- `/gallery` - Photo gallery
- `/contact` - Contact form
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Login)
- `/dashboard` - User dashboard
- `/profile` - User profile

### Admin Routes (Require Admin/Core Role)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/events` - Event management
- `/admin/projects` - Project management
- `/admin/tests` - Test management
- `/admin/blogs` - Blog management

## 🧪 Testing the Setup

1. **Test Home Page**: Visit `http://localhost:3000`
2. **Test Registration**: Go to `/register` and create an account
3. **Test Login**: Go to `/login` and sign in
4. **Test Admin Panel**: Login as admin and visit `/admin`

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change the PORT in `.env` file or kill the process using port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
cd backend
npm install
```

### JWT Secret Error
```
Error: secretOrPrivateKey must have a value
```
**Solution**: Make sure JWT_SECRET is set in `.env` file

## 📚 Next Steps

1. **Customize Content**: Update club information in views
2. **Add Images**: Add club logo and images
3. **Create Events**: Use admin panel to create events
4. **Add Projects**: Showcase your club projects
5. **Write Blogs**: Start publishing blog posts
6. **Invite Members**: Share registration link with club members

## 🆘 Need Help?

If you encounter any issues:

1. Check the [README.md](README.md) for detailed documentation
2. Review error messages in the console
3. Check MongoDB logs
4. Contact the Logicode team

## 🎉 You're All Set!

Your Logicode website is now up and running! Start exploring the features and customizing it for your club.

---

**Happy Coding! 🚀**

Made with ❤️ by Logicode Team

