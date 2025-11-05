# ⚡ Quick Start Guide

Get the Logicode website running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
```bash
# Copy the example file
cp ../.env.example ../.env
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Run the Server
```bash
# Development mode with auto-reload
npm run dev
```

### 5. Open Browser
```
http://localhost:3000
```

## 🎯 First Steps

1. **Register an Account**: Go to `/register`
2. **Make Yourself Admin**: 
   ```bash
   mongosh
   use logicode
   db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
   )
   ```
3. **Access Admin Panel**: Login and go to `/admin`

## 📝 What's Included

✅ **Backend**: Express + MongoDB + JWT Authentication  
✅ **Frontend**: EJS Templates + 3D Animated Background  
✅ **Features**: Events, Projects, Blogs, Test Platform, Admin Panel  
✅ **Security**: Helmet, Rate Limiting, Password Hashing  
✅ **Responsive**: Mobile-friendly design  

## 🎨 Customize

1. **Add Logo**: Place `logo.png` in `public/images/`
2. **Update Content**: Edit files in `views/` folder
3. **Change Colors**: Modify CSS variables in `public/css/style.css`

## 📚 Full Documentation

For detailed setup and features, see:
- [README.md](README.md) - Complete documentation
- [SETUP.md](SETUP.md) - Detailed setup guide

## 🆘 Common Issues

**MongoDB not connecting?**
```bash
# Make sure MongoDB is running
mongosh
```

**Port 3000 already in use?**
```bash
# Change PORT in .env file
PORT=3001
```

**Missing dependencies?**
```bash
cd backend
npm install
```

---

**That's it! You're ready to go! 🎉**

Made with ❤️ by Logicode Team

