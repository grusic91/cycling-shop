const Post        = require('../models/post');
const User        = require('../models/user');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const passport    = require('passport');

module.exports = {
  // GET landing page method /
  async landingPage(req, res, next) {
    // find all posts to populate into map
    const posts = await Post.find({});
    // render home page and pass in posts
    res.render('index', { posts, mapBoxToken, title: 'Cycling Shop - Home' });
  },

  /*Register controller*/
  // GET /register
  getRegister(req, res, next) {
    res.render('register', { title: 'Register', username: '', email: '' });
  },

  //POST /register
  async postRegister(req, res, next) {
    try {
      const user = await User.register(new User(req.body), req.body.password);
      req.login(user, function(err){
        if(err) return next(err);
        req.session.success = `Welcome to Cycling Shop, ${user.username}!`;
        res.redirect('/');
      });
    } catch(err) {
      const { username, email } = req.body;
      let error = err.message;
      if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
        error = 'A user with the given email is already registerd';
      }
      res.render('register', { title: 'Register', username, email, error });
    }
  },

  /*Login controller*/
  // GET /login
  getLogin(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');
    if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
    res.render('login', { title: 'Login' });
  },

  //POST /login
  async postLogin(req, res, next) {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if (!user && error) return next(error);
    req.login(user, function(err) {
      if (err) return next(err);
      req.session.success = `Welcome back, ${username}!`;
      const redirectUrl = req.session.redirectTo || '/';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  },

 /*logout controllers*/
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
}
