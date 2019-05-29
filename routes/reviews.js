const express = require('express');
const router = express.Router({ mergeParams: true }); //it allows as tu pull the id from /posts/:id/reviews

/* Review belong specifically to the certain post*/
/* POST create /posts/:id/reviews
   this is create reviews */
router.post('/',(req, res, next) => {
  res.send("CREATE /posts/:id/reviews");
});

/* PUT update /posts/:id/reviews/review_id
   this is update reviews */
router.put('/:review_id',(req, res, next) => {
  res.send("UPDATE /posts/:id/reviews/:review_id");
});

/* DELETE destroy /reviews/:review_id
   this is destroy reviews */
router.delete('/:review_id',(req, res, next) => {
  res.send("DELETE /posts/:id/reviews/:review_id");
});


module.exports = router;
