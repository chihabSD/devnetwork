const jwt = require("jsonwebtoken");
const config = require("config");

//create a middlware function
/**
 * Middlware function is a function that has access to req and response ojbects
 * This middleware function takes three things
 * the req, the response and the next is the call back that we have to
 * run once we are done
 */
module.exports = (req, res, next) => {
  //Get the token from the header
  const token = req.header("x-auth-token"); // get token from req.header and put it in token variable
  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }

  //verify the token if there is one
  try {
    // if its valid:
    //decode with jwt.verify which takes in the actuall token from header and secret
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //take the req object and asign value to user
    req.user = decoded.user; //decode user from the payload
    next();
  } catch (err) {
    //if token is not valid
    res.status(401).json({ msg: "Token is not valid" });
  }
};
