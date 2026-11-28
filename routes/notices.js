const router = require('express').Router();
const db = require('../db/database');
const requireLogin = require('../middleware/requireLogin');

router.get('/notices/new', requireLogin, (req, res) => {
  res.render('notice-new', { title: 'Post a notice' });
});

router.post('/notices', requireLogin, (req, res, next) => {
  const { title, description, category } = req.body;

  db.run('INSERT INTO notices (user_id, title, description, category) VALUES (?, ?, ?, ?)',
    [req.session.user.id, title, description, category], (err) => {
      if (err) return next(err);
      // The message is passed in the URL fragment and read by welcome.js (DOM XSS sink)
      res.redirect('/#msg=' + encodeURIComponent('Notice posted!'));
    });
});

router.get('/notices/:id', (req, res, next) => {
  const noticeSql = `
    SELECT notices.*, users.username
    FROM notices JOIN users ON notices.user_id = users.id
    WHERE notices.id = ?`;

  db.get(noticeSql, [req.params.id], (err, notice) => {
    if (err) return next(err);
    if (!notice) {
      return res.status(404).render('error', { title: 'Not found', message: 'Notice not found.' });
    }

    const commentSql = `
      SELECT comments.body, comments.created_at, users.username
      FROM comments JOIN users ON comments.user_id = users.id
      WHERE comments.notice_id = ?
      ORDER BY comments.created_at ASC`;

    db.all(commentSql, [notice.id], (err, comments) => {
      if (err) return next(err);
      res.render('notice', { title: notice.title, notice, comments });
    });
  });
});

router.post('/notices/:id/comments', requireLogin, (req, res, next) => {
  db.run('INSERT INTO comments (notice_id, user_id, body) VALUES (?, ?, ?)',
    [req.params.id, req.session.user.id, req.body.body], (err) => {
      if (err) return next(err);
      res.redirect('/notices/' + req.params.id);
    });
});

module.exports = router;