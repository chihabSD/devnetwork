const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authenticate = require("../middlewares/auth");
const validateUser = require("../validations/validateUser");
const validateProfile = require("../validations/profile");

/***************** controllers ************/
const authController = require("../controllers/auth.controller");
const profileController = require("../controllers/profile.controller");

//Auth and signup
router.post(
  "/register",
  validateUser.validate("register"),
  authController.register
);
router.post("/login", validateUser.validate("login"), authController.login);
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
  validateProfile.validate("createProfile"),
  authenticate,
  profileController.createprofile
);

//get all profiles
router.get("/profile", profileController.getallProfiles);
//get profile by id
router.get("/profile/user/:user_id", profileController.getprofileByID);
//Delete profile and user
router.delete("/profile", authenticate, profileController.deleteProfile);
//add experience
router.put(
  "/profile/experience",
  validateProfile.validate("addExperience"),
  authenticate,
  profileController.addExperience
);
//Delete experience
router.delete(
  "/profile/experience/:exp_id",
  authenticate,
  profileController.deleteExperience
);

module.exports = router;
