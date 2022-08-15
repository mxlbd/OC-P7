const mongoose = require('mongoose');

const Post = new mongoose.Schema(
  {
    desc: { type: String },
    picture: { type: String },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', Post);
