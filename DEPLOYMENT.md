# 🚀 Deployment Guide

This guide covers deploying the Logicode website to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] MongoDB database is set up
- [ ] Application runs locally without errors
- [ ] All dependencies are listed in package.json
- [ ] .gitignore is properly configured
- [ ] README and documentation are complete

## 🌐 Deployment Options

### Option 1: Render (Recommended for Full-Stack)

Render provides free hosting for Node.js applications with MongoDB support.

#### Steps:

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: logicode-website
     - **Environment**: Node
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Instance Type**: Free

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   SESSION_SECRET=your_session_secret
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 2: Vercel (For Static/Serverless)

Vercel is great for frontend deployment with serverless functions.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Create vercel.json**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "backend/index.js"
       }
     ]
   }
   ```

4. **Deploy**
   ```bash
   vercel
   ```

### Option 3: Heroku

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create logicode-website
   ```

4. **Add MongoDB**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret_key
   ```

6. **Create Procfile**
   ```
   web: cd backend && npm start
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

#### Steps:

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://www.digitalocean.com)

2. **Create New App**
   - Click "Create" → "Apps"
   - Connect GitHub repository

3. **Configure App**
   - **Name**: logicode-website
   - **Region**: Choose nearest
   - **Branch**: main
   - **Build Command**: `cd backend && npm install`
   - **Run Command**: `cd backend && npm start`

4. **Add Environment Variables**
   - Add all required env vars

5. **Deploy**
   - Click "Create Resources"

## 🗄️ MongoDB Atlas Setup

For production, use MongoDB Atlas (free tier available).

### Steps:

1. **Create Atlas Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Choose "Shared" (Free)
   - Select region closest to your deployment
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Add new user with password
   - Save credentials

4. **Whitelist IP**
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allow from anywhere)
   - Or add specific deployment platform IPs

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Use this as `MONGODB_URI`

## 🔐 Environment Variables

### Required Variables:

```env
# Server
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logicode

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret_key

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./public/uploads
```

### Generating Secure Secrets:

```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Post-Deployment

### 1. Create Admin User

```bash
# Connect to production MongoDB
mongosh "your_mongodb_atlas_uri"

use logicode

# Create admin user
db.users.insertOne({
    name: "Admin",
    email: "admin@logicode.com",
    password: "$2a$10$...", // Use bcrypt to hash
    role: "admin",
    isActive: true,
    joinedDate: new Date()
})
```

### 2. Test the Deployment

- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Admin panel accessible
- [ ] Database operations work
- [ ] File uploads work (if applicable)
- [ ] All routes are accessible

### 3. Set Up Monitoring

- Enable application monitoring
- Set up error tracking (e.g., Sentry)
- Configure uptime monitoring
- Set up backup for database

### 4. Configure Custom Domain (Optional)

#### For Render:
1. Go to Settings → Custom Domains
2. Add your domain
3. Update DNS records

#### For Vercel:
1. Go to Settings → Domains
2. Add domain
3. Configure DNS

## 🔧 Troubleshooting

### Build Fails

```bash
# Check build logs
# Ensure all dependencies are in package.json
# Verify Node version compatibility
```

### Database Connection Error

```bash
# Verify MONGODB_URI is correct
# Check IP whitelist in MongoDB Atlas
# Ensure database user has correct permissions
```

### Application Crashes

```bash
# Check application logs
# Verify all environment variables are set
# Check for missing dependencies
```

### Static Files Not Loading

```bash
# Ensure public folder is included in deployment
# Check file paths are correct
# Verify static middleware is configured
```

## 🔄 Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Auto-Deploy on Git Push

Most platforms support auto-deploy:
- **Render**: Automatic on git push
- **Vercel**: Automatic on git push
- **Heroku**: Use Heroku Git or GitHub integration

## 📈 Performance Optimization

### 1. Enable Compression

Already included via helmet middleware.

### 2. Use CDN for Static Assets

- Upload images to Cloudinary or AWS S3
- Use CDN URLs in templates

### 3. Enable Caching

```javascript
// Add to index.js
app.use(express.static('public', {
    maxAge: '1d'
}));
```

### 4. Database Indexing

```javascript
// Add indexes to frequently queried fields
userSchema.index({ email: 1 });
eventSchema.index({ status: 1, startDate: -1 });
```

## 🛡️ Security Checklist

- [ ] All secrets are in environment variables
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] Input validation is implemented
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF protection (if needed)
- [ ] Secure headers (helmet)
- [ ] Regular dependency updates

## 📞 Support

If you encounter issues during deployment:

1. Check platform-specific documentation
2. Review application logs
3. Verify environment variables
4. Test locally first
5. Contact Logicode team

---

**Happy Deploying! 🚀**

Made with ❤️ by Logicode Team

