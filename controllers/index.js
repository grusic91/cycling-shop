const User = require('../models/user');
const passport = require('passport');

module.exports = {
  /*Register controller*/
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image
    });

    await User.register(newUser, req.body.password);
    res.redirect('/');
  },
  
  /*Login controller*/
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
