const router = require('express').Router();
const db = require('../db/database');

router.get('/search', (req, res, next) => {
  const q = req.query.q || '';

  // INSECURE: search term concatenated into SQL -> SQL injection (UNION attack can dump the users table)
  // WHERE and ORDER BY are on one line so an injected "--" comments out the rest of the query.
  // q appears only once, so a single ' leaves an unclosed string and SQLite throws an error.
  const sql = `
    SELECT notices.id, notices.title, notices.description, notices.category,
           notices.created_at, users.username
    FROM notices JOIN users ON notices.user_id = users.id
    WHERE (notices.title || ' ' || notices.description) LIKE '%${q}%' ORDER BY notices.created_at DESC`;

  db.all(sql, (err, notices) => {
    if (err) {
      // INSECURE: the search page still renders (so q is still reflected unescaped) and shows
      // the raw database error, the full SQL query and a stack trace with server file paths.
      // sqlite3 errors carry no stack frames, so a new Error is created here to capture one.
      const trace = new Error(err.message).stack;
      return res.status(500).render('search', {
        title: 'Search error', q, notices: [],
        error: err.message,
        stack: 'Query: ' + sql + '\n\n' + trace
      });
    }
    res.render('search', { title: 'Search', q, notices });
  });
});

module.exports = router;