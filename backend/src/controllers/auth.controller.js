const User = require("../models/user.model");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const authController = {};

//register
authController.register = async (req, res) => {
  const { name, email, password } = req.body; //get requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    // check if user does exist
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // get users gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });
    user = new User({
      name,
      email,
      avatar,
      password
    });

    //encrypt password
    //creat salt to hash it
    const salt = await bcrypt.genSalt(10); //generate salt
    user.password = await bcrypt.hash(password, salt); // take plain password and hash

    await user.save();

    //return jsonwebtoken
    const payload = {
      user: {
        id: user.id
      }
    };
    /**
     * we a sign the payload .ie (user.id)
     * and the secret key from default.json using config.get
     * then we set the expiration date
     * and then a callback that take a possible error and the token itself
     */
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); //send the token back to the client
      }
    );
    // res.send("User have registered successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
//login
authController.login = async (req, res) => {
  const { email, password } = req.body; //get requests
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body);
  try {
    let user = await User.findOne({ email });
    // check if there is a user, and if there not a user, send back error
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    /**
     * We have made a request to DB to get the user
     * we use bcrupt.compare to compare the password that we have entered
     * with the password that is in the DB
     *
     */
    const isMatch = await bcrypt.compare(password, user.password);
    // if there is not match
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    //create the payload
    const payload = {
      user: {
        id: user.id
      }
    };
    /**
     * we a sign the payload .ie (user.id)
     * and the secret key from default.json using config.get
     * then we set the expiration date
     * and then a callback that take a possible error and the token itself
     */
    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); //send the token back to the client
      }
    );
    // res.send("User have registered successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * GET ALL PROFILES
 * @route   GET api/profile
 * @description get the user profile
 * @access  public
 */
authController.profile = async (req, res) => {
  try {
    /**
     * since its a protect route and we use the token which has the id,
     * we can pass here and we can access anywhere from a protected route
     * then we leave out the password
     */
    const user = await User.findById(req.user.id).select("-password");
    res.json(user); // send the user
  } catch (err) {
    //if there is some wrong
    console.error(err.message);
    res.send(500).send("server error");
  }
};

/**
 * UPDATE PASSWORD
 * @route   GET api/profile/updatepassword
 * @description update password
 * @access  private
 */
authController.updatePassword = async (req, res) => {
  const { password } = req.body;
  // enter the current password
  // if current password matches the one you have entered
  // then update the password
  res.send({
    msg: "update password"
  });
};

authController.forgotPassword = async (req, res) => {
  //step 1: Get the user email form the req.body
  const { email } = req.body;
  console.log(req.body);
  //step 2: check if email does exist
  // step 3: if email exist
  //return
  res.send({
    msg: "Forgot password?"
  });
};
module.exports = authController;
