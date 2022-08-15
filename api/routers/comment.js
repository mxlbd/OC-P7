const express = require('express');
const router = express.Router();

const {
  createComment,
  getComment,
  getComments,
  updateComment,
  deleteComment,
  likeComment,
} = require('../controllers/comment');

router.post('/', createComment);
router.get('/', getComments);
router.get('/:id', getComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.put('/:id/like', likeComment);

module.exports = router;
