const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authenticate = require("../middlewares/auth");

/***************** controllers ************/
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");

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
  authController.register
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
  authController.login
);
router.post("/forgot_password", authController.forgotPassword);

//router.post("/profile", userController.profile);

//Middle ware

router.post(
  "/profile/updatepassword",
  authenticate,
  authController.updatePassword
);
/*******************   Profile   *******************************/
router.get("/profile/me", authenticate, profileController.me);
router.post(
  "/profile/create",
  [
    check("status", "Status is required")
      .not()
      .isEmpty(),
    check("skills", "Skills are required")
      .not()
      .isEmpty()
  ],
  authenticate,
  profileController.createprofile
);
router.get("/profile", profileController.getallProfiles);
router.get("/profile/user/:user_id", profileController.getprofileByID);

module.exports = router;
