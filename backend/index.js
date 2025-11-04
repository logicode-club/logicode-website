const express= require('express');
const app = express();
const ejs= require('ejs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Logicode', {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.use(express.static('public'));

    
const port = 3000;

app.get('/', (req, res) => {
  res.render('home', { title: 'Home Page' });
});


app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});


app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Our Projects' });
});

app.get('/events', (req, res) => {
  res.render('events', { title: 'Our Events' });
});

app.get('/TestPlatform', (req, res) => {
  res.render('test-platform', { title: 'Test Platform' });
});

app.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'Gallery' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});