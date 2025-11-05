const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const session = require('express-session');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database connection
const connectDatabase = require('./config/database');

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blogs');
const testRoutes = require('./routes/tests');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { isLoggedIn, protect, authorize } = require('./middleware/auth');

// Connect to database
connectDatabase();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File upload
app.use(fileUpload({
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
});
app.use('/api/', limiter);

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'logicode-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static folder
app.use(express.static(path.join(__dirname, '../public')));

// Make user available to all views
app.use(isLoggedIn);

// Set local variables
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.siteName = 'Logicode';
    res.locals.siteTagline = 'Think | Code | Innovate';
    next();
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', require('./routes/announcements'));

// View routes
app.get('/', require('./controllers/viewController').getHome);
app.get('/about', require('./controllers/viewController').getAbout);
app.get('/team', require('./controllers/viewController').getTeam);
app.get('/projects', require('./controllers/viewController').getProjects);
app.get('/events', require('./controllers/viewController').getEvents);
app.get('/blogs', require('./controllers/viewController').getBlogs);
app.get('/contact', require('./controllers/viewController').getContact);
app.get('/gallery', require('./controllers/viewController').getGallery);

// Auth views
app.get('/login', require('./controllers/viewController').getLogin);
app.get('/register', require('./controllers/viewController').getRegister);

// Admin views (protected)
app.get('/admin', protect, authorize('admin', 'president', 'vice_president'), require('./controllers/viewController').getAdminDashboard);
app.get('/admin/events', protect, authorize('admin', 'president', 'vice_president', 'event_management_lead', 'event_management_colead'), (req, res) => {
    res.render('admin/events', { title: 'Event Management', user: req.user });
});
app.get('/admin/users', protect, authorize('admin', 'president', 'vice_president'), (req, res) => {
    res.render('admin/users', { title: 'User Management', user: req.user });
});
app.get('/admin/blogs', protect, authorize('admin', 'president', 'vice_president'), (req, res) => {
    res.render('admin/blogs', { title: 'Blog Management', user: req.user });
});
app.get('/admin/announcements', protect, authorize('admin', 'president', 'vice_president'), (req, res) => {
    res.render('admin/announcements', { title: 'Announcement Management', user: req.user });
});
app.get('/admin/projects', protect, authorize('admin', 'president', 'vice_president', 'technical_support_lead', 'technical_support_colead'), (req, res) => {
    res.render('admin/projects', { title: 'Project Management', user: req.user });
});
app.get('/admin/tests', protect, authorize('admin', 'president', 'vice_president', 'competitive_coding_lead', 'competitive_coding_colead'), (req, res) => {
    res.render('admin/tests', { title: 'Test Management', user: req.user });
});
app.get('/admin/contacts', protect, authorize('admin', 'president', 'vice_president', 'secretary'), (req, res) => {
    res.render('admin/contacts', { title: 'Contact Messages', user: req.user });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🚀 LOGICODE SERVER RUNNING 🚀              ║
║                                                       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   Port: ${PORT}                                        ║
║   URL: http://localhost:${PORT}                       ║
║                                                       ║
║   Think | Code | Innovate                            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    server.close(() => process.exit(1));
});
