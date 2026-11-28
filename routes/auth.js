const router = require('express').Router();
const db = require('../db/database');

router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // INSECURE: no input validation, password stored in plaintext
  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, password], (err) => {
      if (err) {
        // INSECURE: raw database error shown to the user
        // (e.g. "UNIQUE constraint failed: users.email" reveals which emails are registered)
        return res.render('register', { title: 'Register', error: err.message });
      }
      res.redirect('/login');
    });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Log in' });
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // INSECURE: user input concatenated straight into the SQL string -> SQL injection
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log('Login query:', sql);

  db.get(sql, (err, row) => {
    if (err) { err.query = sql; return next(err); }
    if (!row) {
      return res.render('login', { title: 'Log in', error: 'Invalid username or password.' });
    }
    // INSECURE: whole database row (including password) stored in the session
    req.session.user = row;
    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;