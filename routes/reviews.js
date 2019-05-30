const express = require('express');
const router = express.Router({ mergeParams: true }); //it allows as tu pull the id from /posts/:id/reviews
const { asyncErrorHandler, isReviewAuthor } = require('../middleware');
const {
  reviewCreate,
  reviewUpdate,
  reviewDestroy
} = require('../controllers/reviews');

/* Review belong specifically to the certain post*/
/* POST create /posts/:id/reviews
   this is create reviews */
router.post('/', asyncErrorHandler(reviewCreate));

/* PUT update /posts/:id/reviews/review_id
   this is update reviews */
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

/* DELETE destroy /reviews/:review_id
   this is destroy reviews */
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));

module.exports = router;
