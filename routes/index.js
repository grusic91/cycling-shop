const express               = require('express');
const router                = express.Router();
const { landingPage,
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        getLogout,
        getProfile
         }       = require('../controllers');
const { asyncErrorHandler, isLoggedIn} = require('../middleware');


/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register. */
router.get('/register', getRegister);

/* POST register. */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login. */
router.get('/login', getLogin);

/* POST login. */
router.post('/login', asyncErrorHandler(postLogin));

//GET logout
router.get('/logout', getLogout);

/* GET profile.
   /profile will display contained login informations */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT profile/:user_id. */
router.put('/profile/:user_id',(req, res, next) => {
  res.send('PUT /profile/:user_id');
});

/*If we forget password
  GET /forgot-password
*/
router.get('/forgot-pw', (req, res, next) => {
  res.send('GET /forgot-pw');
});

/*for reseting password in DB
  PUT /forgot-password
*/
router.put('/forgot-pw', (req, res, next) => {
  res.send('PUT /forgot-pw');
});

/*GET /reset-password/:token*/
router.get('/reset-pw/:token', (req, res, next) => {
  res.send('GET /reset-pw/:token')
});

/*PUT /reset-password/:token*/
router.put('/reset-pw/:token', (req, res, next) => {
  res.send('PUT /reset-pw/:token')
});



module.exports = router;
