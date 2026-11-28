// app.js - Community Notice Board (INSECURE branch)
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db/database');

const authRoutes    = require('./routes/auth');
const noticeRoutes  = require('./routes/notices');
const searchRoutes  = require('./routes/search');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// INSECURE: hardcoded secret, cookie readable by JavaScript (httpOnly: false) so XSS can steal it,
// no secure flag, no sameSite
app.use(session({
  secret: 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: false }
}));

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

app.use(authRoutes);
app.use(noticeRoutes);
app.use(searchRoutes);
app.use(profileRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { title: 'Not found', message: 'Page not found.' });
});

// INSECURE: full error message, SQL query and stack trace sent to the browser
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', {
    title: 'Error',
    message: err.message,
    stack: (err.query ? 'Query: ' + err.query + '\n\n' : '') + err.stack
  });
});

app.listen(PORT, () => {
  console.log(`Notice Board running at http://localhost:${PORT}`);
});