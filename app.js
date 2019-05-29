require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const logger = require('morgan');
const methodOverride = require('method-override');
const config = require('./config/dev');

//require model
const User = require('./models/user');

//require routes
const indexRouter   = require('./routes/index');
const postsRouter   = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();

//connect to DB
mongoose.connect(config.DB_URI, { useNewUrlParser: true,
                                  useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
  console.log("we're connected!");
})

// use ejs-locus for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//setup public assets directory
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//Configure Passport and Sessions
//Session needs to come before configuring passport otherwise passport won't work
app.use(session({
  secret: 'hang tang dude!',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Change: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Set locals variables middleware*/
app.use(function(req, res, next) {
  req.user = {
    '_id': '5cd438a5ce2871362c5832c6',
    'username': 'cyclo'
  }
  res.locals.currentUser = req.user;
  // set page title default
  res.locals.title = 'Cycling Shop';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.success || '';
  delete req.session.error;
  // continue on to next function in midleware chain
  next();
});

/*
   -- Moint Routes --
   any time users visite some of this paths,
   they are actually hitting root route
   handled in apropriate file in routes folder */
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});



module.exports = app;
