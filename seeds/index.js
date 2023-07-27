const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const posts = await Promise.all(postData.map(post => Post.create({
    ...post,
    user_id: users[Math.floor(Math.random() * users.length)].id,
  })));

  for (const post of posts) {
    await Comment.create({
      ...commentData[Math.floor(Math.random() * commentData.length)],
      post_id: post.id,
    });
  }

  process.exit(0);
};

seedDatabase();