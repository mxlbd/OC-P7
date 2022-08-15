const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');

// Create a new comment
exports.createComment = async (req, res) => {
  const { postId } = req.body;
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    const post = Post.findById(postId);
    await post.updateOne({ $push: { comments: newComment._id.toString() } });
    res.status(200).send(newComment);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { postId, userId } = req.body;
  try {
    const comment = await Comment.findById(id);
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    !comment && res.status(404).json("Le commentaire n'existe pas");

    !post.comments.includes(id) && !user.isAdmin
      ? res.status(403).json('Vous ne pouvez pas modifier ce commentaire')
      : await comment.updateOne({ $set: req.body });

    res.status(200).json('Le commentaire a été mis à jour');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  const { postId, userId } = req.body;
  try {
    const comment = await Comment.findById(id);
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    !comment && res.status(404).json("Le commentaire n'existe pas");

    !post.comments.includes(id) && !user.isAdmin
      ? res.status(403).json('Vous ne pouvez pas supprimer ce commentaire')
      : await comment.deleteOne();

    res.status(200).json('Le commentaire a été supprimé');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get comment
exports.getComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Like comment
exports.likeComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const comment = await Comment.findById(id);

    !comment && res.status(404).json("Le commentaire n'existe pas");

    !comment.likes.includes(userId)
      ? (await comment.updateOne({ $push: { likes: userId } }),
        res.status(200).json('Le commentaire a été liké'))
      : (await comment.updateOne({ $pull: { likes: userId } }),
        res.status(200).json('Le commentaire a été disliké'));
  } catch (err) {
    res.status(500).json(err);
  }
};
