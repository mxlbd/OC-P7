const express = require('express');
const router = express.Router();

const {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  follow,
} = require('../controllers/user');

const multer = require('../middlewares/multer-config');

router.delete('/:id', deleteUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', multer, updateUser);
router.put('/:id/follow', follow);

module.exports = router;
