const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');

// Register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedEmail = cryptoJs
    .HmacSHA256(email, process.env.CRYPTO_JS_KEY)
    .toString();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    // Create new user
    const user = await new User({
      username: username,
      email: hashedEmail,
      password: hashedPassword,
    });

    // Save user and return response
    await user.save();
    const { password, email, isAdmin, ...others } = user._doc;
    
    res.status(200).json({ message: 'User created', desc: others });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const hashedEmail = cryptoJs
      .HmacSHA256(req.body.email, process.env.CRYPTO_JS_KEY)
      .toString();
    const user = await User.findOne({ email: hashedEmail });
    !user && res.status(404).json('User not found');

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json('Wrong password or email');

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      { expiresIn: '24H' }
    );

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json(err);
  }
};
