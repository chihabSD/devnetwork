const User = require("../models/user.model");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const userController = {};

//register
userController.register = async (req, res) => {
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
userController.profile = async (req, res) => {
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

module.exports = userController;
