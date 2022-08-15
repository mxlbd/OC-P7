const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/auth');

const { passwordValidator } = require('../middlewares/password-validator');
const { emailValidator } = require('../middlewares/email-validator');

router.post('/register', passwordValidator, emailValidator, register);
router.post('/login', passwordValidator, emailValidator, login);

module.exports = router;
