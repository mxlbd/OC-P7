const mongoose = require('mongoose');

const Comment = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    desc: { type: String, required: true },
    picture: { type: String },
    likes: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', Comment);
