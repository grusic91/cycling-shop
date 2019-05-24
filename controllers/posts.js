const Post = require('../models/post');

module.exports = {
 /*Posts Index*/
  async getPosts(req, res, next) {
    // we need to get acces to all of the posts
    let posts = await Post.find({}); //with empty object inside find we get all the posts in the posts collection.
    //now thet we have reslutl we can do render,
    res.render('posts/index', { posts }); //we go from views (which express looks by default)
    //down to posts and render index file at which point we pass in the posts like {posts: posts}
  },

  /*Posts New*/
  newPost(req, res, next) {
    //render the view for creating a new post
    res.render('posts/new');
  },

  /* Post Create*/
  async createPost(req, res, next) {
    //use req.body to create a new Post
    let post = await Post.create(req.body); //once we have a post we redirect post with id
    res.redirect(`/posts/${post.id}`); //this is show page
  },

  // Post Show
  async showPost(req, res, next) {
    /*We use the post model to find the post by ID that get passed in to the params
     Once we find that post then render to show view*/
     let post = await Post.findById(req.params.id);
     res.render('posts/show', { post });
  },

}
