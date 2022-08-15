const Post = require('../models/post');
const User = require('../models/user');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    const user = User.findById(req.body.userId);
    await user.updateOne({ $push: { posts: newPost._id.toString() } });
    res.status(200).send(newPost);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update post

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(id);
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);

    !post && res.status(404).json("Le post n'existe pas");

    !user.posts.includes(id) && !user.isAdmin
      ? res.status(403).json('Vous ne pouvez pas modifier ce post')
      : await post.updateOne({ $set: req.body });

    res.status(200).json('Le post a été mis à jour');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);

    !post && res.status(404).json("Le post n'existe pas");

    !user.posts.includes(id) && !user.isAdmin
      ? res.status(403).json('Vous ne pouvez pas supprimer ce post')
      : await post.deleteOne();

    await user.updateOne({ $pull: { posts: post._id.toString() } });

    res.status(200).json('Le post a été supprimé');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get post
exports.getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Like post
exports.likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(id);
    const user = await User.findById(userId);

    !user && res.status(404).json("L'utilisateur n'existe pas");
    !post && res.status(404).json("Le post n'existe pas");

    !post.likes.includes(userId)
      ? (await post.updateOne({ $push: { likes: userId } }),
        res.status(200).json('Le post a été liké'))
      : (await post.updateOne({ $pull: { likes: userId } }),
        res.status(200).json('Le post a été disliké'));
  } catch (err) {
    res.status(500).json(err);
  }
};
