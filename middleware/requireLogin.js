// this file redirects to the login page if nobody is logged in
module.exports = function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
};