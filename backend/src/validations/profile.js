const { check } = require("express-validator");

exports.validate = method => {
  switch (method) {
    //in case of register
    case "createProfile": {
      return [
        check("status", "Status is required")
          .not()
          .isEmpty(),
        check("skills", "Skills are required")
          .not()
          .isEmpty()
      ];
    }
  }
};
