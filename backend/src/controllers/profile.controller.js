const Profile = require("../models/profile.model");
const User = require("../models/user.model");

const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const profileController = {};

//get the profile

/**
 * @route   GET api/me
 * @description get the current user profile
 * @access  private
 */
profileController.me = async (req, res) => {
  try {
    /**
     * set the profile according the user that commes with the token using req.user.id
     * then we populate name and avatar from the user
     */
    // const { user } = req.user
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    //check if there is a profile
    // if there is no profile
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile yet for this user" });
    }
    // if there is return the profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * @route   GET api/profile
 * @description create a profile for the current user
 * @access  private
 */
//create a profile
profileController.createprofile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);
  //if validation is succesfull, we want to putll all the fields
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    twitter,
    facebook,
    instagram,
    linkedin
  } = req.body;

  //build profile object
  const profileFields = {};
  profileFields.user = req.user.id; //user.id is from the token
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  //when it comes to skills we need to turn it into an array
  if (skills) {
    /**
     * When it comes to skills
     * we turn it into array and for each skill we trim it
     */
    profileFields.skills = skills.split(",").map(skill => skill.trim());
    console.log(profileFields.skills);

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    //Inser the data
    try {
      //we are going to look for a profile
      let profile = await Profile.findOne({ user: req.user.id });
      //if there is a profile then we update
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id }, //find by user
          { $set: profileFields },
          { new: true }
        );
        //return the entire profile
        return res.json(profile);
      }
      // if there is no profile then we want to create it
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
};

module.exports = profileController;
