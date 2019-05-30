const faker = require('faker');
const Post = require('./models/post');

async function seedPost() {
  await Post.remove({});
  for(const i of new Array(40)) {
    const post = {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
      author: {
        '_id': '5cd438a5ce2871362c5832c6',
        'username': 'cyclo'
      }
    }
    await Post.create(post);
  }
  console.log('40 new posts created');
}

module.exports = seedPost;
