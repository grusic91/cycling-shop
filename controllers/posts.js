const Post = require('../models/post');

module.exports = {

  async getPosts(req, res, next) {
    // we need to get acces to all of the posts
    let posts = await Post.find({}); //with empty object inside find we get all the posts in the posts collection.
    //now thet we have reslutl we can do render,
    res.render('posts/index', { posts }); //we go from views (which express looks by default)
    //down to posts and render index file at which point we pass in the posts like {posts: posts}
  },
  
}
