const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authenticate = require("../middlewares/auth");
const userController = require("../controllers/user.controller");

//Auth and signup
router.post(
  "/register",
  [
    check("name", "Please enter your name")
      .not()
      .isEmpty(),
    check("email", "Please include a valide email").isEmail(),
    // password must be at least 5 chars long
    check(
      "password",
      "please enter a password with 5 or more characters"
    ).isLength({ min: 5 })
  ],
  userController.register
);
router.post(
  "/login",
  [
    check("email", "Email is required")
      .not()
      .isEmpty(),
    // password must be at least 5 chars long
    check("password", "Password is required").exists()
  ],
  userController.login
);
//router.post("/login", userController.login);

//router.post("/profile", userController.profile);

//Middle ware
router.get("/profile", authenticate, userController.profile);
module.exports = router;
