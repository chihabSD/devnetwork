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
    case "addExperience": {
      return [
        check("title", "title is required")
          .not()
          .isEmpty(),
        check("company", "company are required")
          .not()
          .isEmpty(),
        check("from", "from date are required")
          .not()
          .isEmpty()
      ];
    }
  }
};
