const express               = require('express');
const router                = express.Router();
const multer                = require('multer');
const upload                = multer({'dest': 'uploads/'});
const { asyncErrorHandler } = require('../middleware');
const {
  postIndex,
  postNew,
  postCreate,
  postShow,
  postEdit,
  postUpdate,
  postDelete }              = require('../controllers/posts');

/* GET index /posts
   this is posts even it has foreslash
   in this route we want to have a view that displys all the different posts from all the diff users
*/
router.get('/', asyncErrorHandler(postIndex));

/* GET new /posts/new
   this is posts/new */
router.get('/new', postNew);

/* POST create /posts
   this is create posts */
router.post('/', upload.array('images', 4), asyncErrorHandler(postCreate));

/* GET show  /posts/:id
   this is create posts */
router.get('/:id', asyncErrorHandler(postShow));

/* GET edit /posts/:id/edit
   this is edit posts */
router.get('/:id/edit', asyncErrorHandler(postEdit));

/* PUT update /posts/:id
   this is update posts */
router.put('/:id', upload.array('images', 4), asyncErrorHandler(postUpdate));

/* DELETE destroy /posts/:id
   this is destroy posts */
router.delete('/:id', asyncErrorHandler(postDelete));


module.exports = router;
