const express               = require('express');
const router                = express.Router();
const { getRegister,
        postRegister,
        getLogin,
        postLogin,
        getLogout,
        landingPage }       = require('../controllers');
const { asyncErrorHandler } = require('../middleware');


/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register. */
router.get('/register', getRegister);

/* POST register. */
router.post('/register', asyncErrorHandler(postRegister));

/* GET login. */
router.get('/login', getLogin);

/* POST login. */
router.post('/login', postLogin);

//GET logout
router.get('/logout', getLogout);

/* GET profile.
   /profile will display contained login informations */
router.get('/profile',(req, res, next) => {
  res.send('GET /profile');
});

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
