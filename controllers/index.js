const Post                    = require('../models/post');
const User                    = require('../models/user');
const passport                = require('passport');
const mapBoxToken             = process.env.MAPBOX_TOKEN;
const util                    = require('util');
const { cloudinary }          = require('../cloudinary');
const { deleteProfileImage }  = require('../middleware');
const crypot                  = require('crypot');
const sgMail                  = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
      if (req.file) {
        const { secure_url, public_id } = req.file;
        req.body.image = { secure_url, public_id };
      }
      const user = await User.register(new User(req.body), req.body.password);
      req.login(user, function(err){
        if(err) return next(err);
        req.session.success = `Welcome to Cycling Shop, ${user.username}!`;
        res.redirect('/');
      });
    } catch(err) {
      deleteProfileImage(req);
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
  },

  async getProfile(req, res, next) {
    const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
    res.render('profile', { posts });
  },

  async updateProfile(req, res, next) {
		const {
			username,
			email
		} = req.body;
		const { user } = res.locals;
		if (username) user.username = username;
		if (email) user.email = email;
    if (req.file) {
      if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
      const { secure_url, public_id } = req.file;
      user.image = { secure_url, public_id };
    }
		await user.save();
		const login = util.promisify(req.login.bind(req));
		await login(user);
		req.session.success = 'Profile successfully updated!';
		res.redirect('/profile');
	},

  getForgotPw(req, res, next) {
    res.render('users/forgot');
  },

  async putForgotPw(req, res, next) {
    const token = await crypot.randomBytes(20).toString('hex');
    const { email } req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.session.error = 'No account wiht that email.';
      return res.redirect('/forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const msg = {
      to: email,
      from: 'Cycling Shop Admin <your@email.com>',
      subject: 'Cycling Shop - Forgot Password / Reset',
      text: `You are receiving this because you (or someone else)
      have requested the reset of your password for your account.
      Please click on the following link, or copy and paste it
      into your browser to complete the process:
      http://${req.headers.host}/reset/${token}
      If you did not request this, please ignore this email and
      your password will remain unchaged.`.replace(/      /g, ''),
      // html: '<strong>and ea</strong>'
    };
    await sgMail.send(msg);

    req.session.success = `An email has been sent to  ${email}, with further instructions.`;
    res.redirect('/forgot-password');
  },
  async getReset(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now()}
    });

    if(!user) {
      req.session.error = 'Password reset token is invalid of has expired';
      return res.redirect('/forogt-password');
    }

    res.render('users/reset', { token });
  },

  async putReset(req, res, next) {
    const { token } = req.params;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now()}
    });

    if(!user) {
      req.session.error = 'Password reset token is invalid of has expired';
      return res.redirect('/forogt-password');
    }

    if (req.body.password === req.body.confirm) {
      await user.setPassword(req.body.password);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      const login = util.promisify(req.login.bind(req));
      await login(user);
    } else {
      req.session.error = 'Passwords do not match.';
      return res.redirect(`/reset/${ token }`)
    }

    const msg = {
      to: user.email,
      from: 'Cycling Shop Admin <your@email.com>',
      subject: 'Cycling Shop - Password - Changed',
      text: `Hello,
      This email is to confirm that the password for your account has just been changed.
      If you did not make this change, please hit replay and notify us at once`.replace(/      /g, ''),
    };

    await sgMail.send(msg);

    req.session.success = 'Password successfully updated!';
    res.redirect('/');
  }
}
