const express = require('express');
const router = express.Router();
const { postRegister } = require('../controllers/index');

/* GET home page. */
router.get('/',(req, res, next) => {
  res.render('index', { title: 'Cycling Shop - Home' });
});

/* GET register. */
router.get('/register',(req, res, next) => {
  res.send('GET /register');
});

/* POST register. */
router.post('/register', postRegister);

/* GET login. */
router.get('/login',(req, res, next) => {
  res.send('GET /login');
});

/* POST login. */
router.post('/login',(req, res, next) => {
  res.send('POST /login');
});

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
