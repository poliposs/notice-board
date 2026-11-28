const router = require('express').Router();
const db = require('../db/database');
const requireLogin = require('../middleware/requireLogin');

router.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { title: 'My profile', profile: req.session.user });
});

// INSECURE: no authentication, returns every user's details including passwords
router.get('/api/users', (req, res, next) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

module.exports = router;