const { check } = require("express-validator");

exports.validate = method => {
  switch (method) {
    //in case of register
    case "register": {
      return [
        check("name", "Please enter your name")
          .not()
          .isEmpty(),
        check("email", "Please include a valide email").isEmail(),
        // password must be at least 5 chars long
        check(
          "password",
          "please enter a password with 5 or more characters"
        ).isLength({ min: 5 })
      ];
    }
    // in case of login
    case "login": {
      return [
        [
          check("email", "Email is required")
            .not()
            .isEmpty(),
          // password must be at least 5 chars long
          check("password", "Password is required")
            .not()
            .isEmpty(),
          check("password", "Password is required").exists()
        ]
      ];
    }
  }

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
};
