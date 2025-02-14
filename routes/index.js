const express               = require('express');
const router                = express.Router();
const multer                = require('multer');
const { storage }           = require('../cloudinary');
const upload              = multer({ storage });
const { landingPage,
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        getLogout,
        getProfile,
        updateProfile,
        getForgotPw,
        putForgotPw,
        getReset,
        putReset
         }       = require('../controllers');
const { asyncErrorHandler,
        isLoggedIn,
        isValidPassword,
        changePassword
      } = require('../middleware');


/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET register. */
router.get('/register', getRegister);

/* POST register. */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

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
router.put('/profile',
  isLoggedIn,
  upload.single('image'),
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/*If we forget password
  GET /forgot-password
*/
router.get('/forgot-password', getForgotPw);

/*for reseting password in DB
  PUT /forgot-password
*/
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/*GET /reset-password/:token*/
router.get('/reset/:token', asyncErrorHandler(getReset));

/*PUT /reset-password/:token*/
router.put('/reset/:token', asyncErrorHandler(putReset));

module.exports = router;
