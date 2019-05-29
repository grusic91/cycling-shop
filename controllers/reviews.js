const Post = require('../models/post');
const Review = require('../models/review');


module.exports = {
   /* Reviews Create*/
  async reviewCreate(req, res, next) {
    //find the post by its id
    let post = await Post.findById(req.params.id);
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
  async reviwDestroy(req, res, next) {

  }
}
