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
    res.render('register', { title: 'Register' });
  },

  //POST /register
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image
    });

    let user = await User.register(newUser, req.body.password);
    req.login(user, function(err){
      if(err) return next(err);
      req.session.success = `Welcome to Surf Shop, ${user.username}!`;
      res.redirect('/');
    });
  },

  /*Login controller*/
  // GET /login
  getLogin(req, res, next) {
    res.render('login', { title: 'Login' });
  },

  //POST /login
  postLogin(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/', //on successfull take us on homepage
      failureRedirect: '/login' //on failure take us on longin view page
    })(req, res, next);
  },

 /*logout controllers*/
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/');
  }
}
