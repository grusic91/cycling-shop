const express           = require('express');
const router            = express.Router();
const { errorHandler }  = require('../middleware');
const { getPosts }      = require('../controllers/posts');

/* GET index /posts
   this is posts even it has foreslash
   in this route we want to have a view that displys all the different posts from all the diff users
*/
router.get('/', errorHandler(getPosts));

/* GET new /posts/new
   this is posts/new */
router.get('/new',(req, res, next) => {
  res.send("NEW /posts/new");
});

/* POST create /posts
   this is create posts */
router.post('/',(req, res, next) => {
  res.send("CREATE /posts");
});

/* GET show  /posts/:id
   this is create posts */
router.get('/:id',(req, res, next) => {
  res.send("SHOW /posts/:id");
});

/* GET edit /posts/:id/edit
   this is edit posts */
router.get('/:id/edit',(req, res, next) => {
  res.send("EDIT /posts/:id/edit");
});

/* PUT update /posts/:id
   this is update posts */
router.put('/:id',(req, res, next) => {
  res.send("UPDATE posts/:id");
});

/* DELETE destroy /posts/:id
   this is destroy posts */
router.delete('/:id',(req, res, next) => {
  res.send("DELETE posts/:id");
});


module.exports = router;
