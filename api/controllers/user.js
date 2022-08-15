const User = require('../models/user');

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.body;

  try {
    const user = await User.findById(id);
    id === userId || isAdmin
      ? await User.findByIdAndDelete(id)
      : res.status(403).json('Do not have permission to delete this account');
    res.status(200).json('Account has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get user
exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    const { password, email, updatedAt, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.body;

  if (req.file) {
    req.body.profilePicture = req.file.filename;
  }

  try {
    id === userId || isAdmin
      ? await User.findByIdAndUpdate(id, { $set: req.body })
      : res.status(403).json('Do not have permission to update this account');
    res.status(200).json('Account has been updated');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Follow a user
exports.follow = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (userId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(userId);

      !user.followers.includes(userId)
        ? (await user.updateOne({ $push: { followers: userId } })) &&
          (await currentUser.updateOne({ $push: { followings: id } })) &&
          res.status(200).json('User has been followed')
        : (await user.updateOne({ $pull: { followers: userId } })) &&
          (await currentUser.updateOne({ $pull: { followings: id } })) &&
          res.status(200).json('User has been unfollowed');
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json('You cannot follow yourself');
  }
};
