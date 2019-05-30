const Post = require('../models/post');
const Review = require('../models/review');


module.exports = {
   /* Reviews Create*/
  async reviewCreate(req, res, next) {
    //find the post by its id and populate reviews
    let post = await Post.findById(req.params.id).populate('reviews').exec();    // filter post.reviews array to see if any of the reviews was created by logged in user
    // filter() returns new array, to use .length to see if array is emty or not
    let haveReviewed = post.reviews.filter(review => {
      return review.author.equals(req.user._id);
    }).length;
    // check if haveReviewed is 0 or 1
    if(haveReviewed) {
      // flash an error and redirect back to post
      req.session.error = 'Sorry, you can only create one review per post.';
      return res.redirect(`/posts/${post.id}`);
    }
    // create the review
    req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    //assign review to the post
    post.reviews.push(review);
    // save the post
    post.save();
    // redirect to the post
    req.session.success = 'Review created successfully!';
    res.redirect(`/posts/${post.id}`);
  },

  //Reviews update
  async reviewUpdate(req, res, next) {
    await Review.findByIdAndUpdate(req.params.review_id, req.body.review);
    req.session.success = 'Review updated successfully';
    res.redirect(`/posts/${req.params.id}`);

  },
// Reviews Destroy
  async reviewDestroy(req, res, next) {
    await Post.findByIdAndUpdate(req.params.id,  {
        $pull:  { review: req.params.review_id }
    });
    await Review.findByIdAndRemove(req.params.review_id);
    req.session.success = 'Review deleted successfully';
    res.redirect(`/posts/${req.params.id}`);
  }
}
