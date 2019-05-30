require('dotenv').config();

const Post = require('../models/post');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
 /*Posts Index*/
  async postIndex(req, res, next) {
    // we need to get acces to all of the posts
    let posts = await Post.find({}); //with empty object inside find we get all the posts in the posts collection.
    //now thet we have reslutl we can do render,
    res.render('posts/index', { posts }); //we go from views (which express looks by default)
    //down to posts and render index file at which point we pass in the posts like {posts: posts}
  },

  /*Posts New*/
  postNew(req, res, next) {
    //render the view for creating a new post
    res.render('posts/new');
  },

  /* Post Create*/
  async postCreate(req, res, next) {
    req.body.post.images = [];
    for(const file of req.files) { /*req.files is array that has been created in post route (upload.array())*/
      /*We loop over it and uploade its files to coludinary using code below*/
      let image = await cloudinary.v2.uploader.upload(file.path); //we save uploaded files to variable
      req.body.post.images.push({ /*we pull out of uploaded images url and id and plug them into an object
         thet gets passed into req.body.post.images which is array of objects with data for images*/
        url: image.secure_url,
        public_id: image.public_id
      })
    }
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.post.location,
        limit: 1
      })
      .send();
    req.body.post.coordinates = response.body.features[0].geometry.coordinates;
    //use req.body to create a new Post
    let post = await Post.create(req.body.post); //once we have a post we redirect post with id
    //success message
    req.session.success = 'Post created successfully!';
    res.redirect(`/posts/${post.id}`); //this is show page
  },

  // Post Show
  async postShow(req, res, next) {

    /*We use the post model to find the post by ID that get passed in to the params
     Once we find that post then render to show view*/
     let post = await Post.findById(req.params.id).populate({
       path: 'reviews',
       options: { sort: { '_id': -1 } },
       populate: {
         path: 'author',
         model: 'User'
       }
     });
     res.render('posts/show', { post });
  },

  //Post Edit
  async postEdit(req, res, next) {
    let post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  },

  //Post update
  async postUpdate(req, res, next) {
    /*We're gonna take information from the put request from edit form,
      find the post by its ID and them update it with use mongoose helper method
      and plugin information from the form from req.body. And at that point update the post
      and redirect to the show page of that post.*/

    // find the post by id
      let post = await Post.findById(req.params.id); //now we have access to the post that we editing on
    // check if there are any images for deletion
      if(req.body.deleteImages && req.body.deleteImages.length) {
        // assign delete images from req.body to its own variable
        let deleteImages = req.body.deleteImages;
        // loop over deleteImages
        for(const public_id of deleteImages) {
          //delete images from cloudinary
          await cloudinary.v2.uploader.destroy(public_id);
          // delete image from post.images
          for(const image of post.images) {
            if(image.public_id === public_id) {
              let index = post.images.indexOf(image);
              post.images.splice(index, 1);
            }
          }
        }
      }
      // check if there are any new images for upload
      if(req.files) {
        // upload images
        for(const file of req.files) { /*req.files is array that has been created in post route (upload.array())*/
          /*We loop over it and uploade its files to coludinary using code below*/
          let image = await cloudinary.v2.uploader.upload(file.path); //we save uploaded files to variable
          // add images to post.images array
          post.images.push({ /*we pull out of uploaded images url and id and plug them into an object
             thet gets passed into req.body.post.images which is array of objects with data for images*/
            url: image.secure_url,
            public_id: image.public_id
          });
        }
      }
      // check if location was updated
      if(req.body.post.location !== post.location) {
        let response = await geocodingClient
          .forwardGeocode({
            query: req.body.post.location,
            limit: 1
          })
          .send();
        post.coordinates = response.body.features[0].geometry.coordinates;
        post.location = req.body.post.location;
      }
      // update the post with new any new properties
      post.title = req.body.post.title;
      post.description = req.body.post.description;
      post.price = req.body.post.price;

      // save the updated post into the db
      post.save();
      // redirect to the show page
      res.redirect(`/posts/${post.id}`); //this is show page
  },

// Post Destroy method
  async postDelete(req, res, next) {

    let post = await Post.findById(req.params.id);
    for(const image of post.images) {
      await cloudinary.v2.uploader.destroy(image.public_id);
    }
    await post.remove();
    req.session.success = "Post deleted successfully!";
    res.redirect('/posts');
  }
}
