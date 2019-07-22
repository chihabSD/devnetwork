const { check, validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  check("name", "Please enter your name")
    .not()
    .isEmpty(),
    check("email", "Please include a valide email").isEmail(),
    // password must be at least 5 chars long
    check(
      "password",
      "please enter a password with 5 or more characters"
    ).isLength({ min: 5 });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
