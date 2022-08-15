const express = require('express');
const router = express.Router();

const {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
} = require('../controllers/post');

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.get('/:id', getPost);
router.get('/', getPosts);
router.put('/:id/like', likePost);

module.exports = router;
