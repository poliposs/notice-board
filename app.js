// app.js - Community Notice Board (base skeleton)
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing + static files
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions (cookie settings are hardened later on the secure branch)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false
}));

// Make the logged-in user available to every view
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Home page - list all notices, newest first
app.get('/', (req, res, next) => {
  const sql = `
    SELECT notices.id, notices.title, notices.description, notices.category,
           notices.created_at, users.username
    FROM notices
    JOIN users ON notices.user_id = users.id
    ORDER BY notices.created_at DESC`;

  db.all(sql, [], (err, notices) => {
    if (err) return next(err);
    res.render('index', { title: 'Home', notices });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not found', message: 'Page not found.' });
});

// Error handler - generic message for the user, details only in the server console
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`Notice Board running at http://localhost:${PORT}`);
});