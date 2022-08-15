const validator = require('validator');

exports.emailValidator = (req, res, next) => {
  const { email } = req.body;
  !validator.isEmail(email) ? res.status(400).json('Invalid email') : next();
};
