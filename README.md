# 🚀 Logicode Website

> **Think | Code | Innovate**

Official website for **Logicode - Coding Club, TKIET Warananagar**

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## 🎯 About

Logicode is the premier coding club at TKIET Warananagar, bringing together students passionate about technology, programming, and innovation. This website serves as the central hub for all club activities, events, projects, and member interactions.

**President:** Sushant Awalekar

## ✨ Features

### 🏠 Home Page
- Eye-catching hero section with **3D animated background** using Three.js
- Animated counters for members, events, and projects
- Featured events and projects showcase
- Fully responsive design

### 👥 About Us
- Club mission, vision, and values
- Message from the President

### 🧑‍💼 Team Page
- Leadership hierarchy (President, Vice-President, Core Members)
- Member profiles with social links (LinkedIn, GitHub)

### 🚀 Projects Page
- Showcase of technical projects
- Filter by category (Web, AI, App, IoT, etc.)
- GitHub and live demo links

### 🎯 Events System
- Upcoming and past events
- Event registration system
- Countdown timers
- Event gallery with winners

### 🧠 Test Platform (Secure MCQ System)
- Timer-based MCQ interface
- Anti-cheat mechanisms (disable copy, tab switching detection)
- Auto-submit functionality
- Real-time leaderboard
- Admin dashboard for question management
- Result analytics and CSV export

### 📰 Blog System
- Member-written articles
- Categories and tags
- Admin approval workflow
- Like and comment system

### 🧑‍💻 Member Portal
- Personalized dashboard
- Event participation history
- Test scores and certificates
- Role-based access (Member/Core/Admin)

### 🧾 Admin Panel
- Comprehensive dashboard with analytics
- Member, event, and project management
- Test creation and question bank
- Blog approval system
- Result export (CSV/Excel)

### 📬 Contact Page
- Contact form with validation
- Social media links

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Mongoose ODM)
- **EJS** - Template engine
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5, CSS3, JavaScript (ES6+)**
- **Three.js** - 3D animated backgrounds
- **Font Awesome** - Icons

### Security
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Express Mongo Sanitize** - NoSQL injection prevention

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/logicode-tkiet/logicode-website.git
cd logicode-website
```

2. **Install dependencies**
```bash
cd backend
npm install
```

3. **Set up environment variables**
```bash
cp ../.env.example ../.env
```

Edit `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/logicode
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. **Run the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

6. **Access the website**
```
http://localhost:3000
```

## 🎮 Usage

### For Members
1. Register at `/register`
2. Login at `/login`
3. Access dashboard at `/dashboard`
4. Participate in events and tests

### For Admins
1. Login with admin credentials
2. Access admin panel at `/admin`
3. Manage members, events, projects
4. Create and manage tests
5. Approve blog posts

### For Visitors
1. Browse events at `/events`
2. View projects at `/projects`
3. Read blogs at `/blogs`
4. Contact us at `/contact`

## 📁 Project Structure

```
logicode-website/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── index.js         # Server entry point
├── views/
│   ├── partials/        # Header & footer
│   ├── auth/            # Login & register pages
│   └── index.ejs        # Home page
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── images/          # Static images
├── .env.example         # Environment variables template
└── README.md
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (Admin/Core)
- `POST /api/events/:id/register` - Register for event

### Tests
- `GET /api/tests/access/:code` - Access test with code
- `POST /api/tests/:id/submit` - Submit test
- `POST /api/tests` - Create test (Admin/Core)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/tests/:id/export` - Export results as CSV

## 🤝 Contributing

We welcome contributions from the community!

1. Fork this repo
2. Clone your fork
3. Create a new branch: `git checkout -b feature-name`
4. Make your changes and commit: `git commit -m "Added feature"`
5. Push to your branch: `git push origin feature-name`
6. Open a Pull Request

## 📬 Contact

**Logicode Team**
TKIET Warananagar

**President:** Sushant Awalekar

---

Made with ❤️ by Logicode Team
