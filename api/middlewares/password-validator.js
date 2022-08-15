const passwordValidator = require('password-validator');

exports.passwordValidator = (req, res, next) => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .not()
    .spaces();

  if (!schema.validate(req.body.password)) {
    return res.status(400).json({
      error:
        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and no spaces.',
    });
  } else {
    next();
  }
};
