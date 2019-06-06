const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post')
const { cloudinary } = require('../cloudinary');

const middleware = {
  /*function thaht handles errors that are catch from our async await code*/
  asyncErrorHandler: (fn) => //this is high order function that returns anonimus function
    (req, res, next) => { //anonimus function takes req, res, next
      Promise.resolve(fn(req,res,next)) /*whatever promise returns we can call .then and .catch on.
                                          this function  fn(req,res,next) is our async function from controllers*/
             .catch(next) //catch pass next if we catch any error
  },
  isReviewAuthor: async (req, res, next) => {
    let review = await Review.findById(req.params.review_id);
    if(review.author.equals(req.user._id)) {
      return next();
    }
    req.session.error = "Bye bye";
    return res.redirect('/');
  },
  isLoggedIn: (req, res, next) => {
    //check and see if the user is loggedIn
    if(req.isAuthenticated()) return next();
    req.session.error = 'You need to be logged in to do that!';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
  },
  isAuthor: async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(post.author.equals(req.user._id)) {
      res.locals.post = post;
      return next();
    }
    req.session.error = 'Access denied!';
    res.redirect('back');
  },

  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
    if (user) {
      // add user to res.locals
      res.locals.user = user;
      next();
    } else {
      middleware.deleteProfileImage(req);
      req.session.error = 'Incorrect current password!';
      return res.redirect('/profile');
    }
  },

  changePassword: async (req, res, next) => {
    // destructure password from req.body
    const {
      newPassword,
      passwordConfirmation
    } = req.body;
    if (newPassword && !passwordConfirmation) {
      middleware.deleteProfileImage(req);
      req.session.error = 'Missing password confiramtion!';
      return res.redirect('/profile');
    }
    if (newPassword && passwordConfirmation) {
      const { user } = res.locals;
      if (newPassword === passwordConfirmation) {
        await user.setPassword(newPassword);
        next();
      } else {
        middleware.deleteProfileImage(req);
        req.session.error = 'New passwords must match!';
        return res.redirect('/profile');
      }
    } else {
      next();
    }
  },

  deleteProfileImage: async req => {
    if (req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
  }
};

module.exports = middleware;
