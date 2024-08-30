//userControllers.js
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({
        status: false,
        msg: "User already exists, please Login",
      });
    const nameCheck = await User.findOne({ name });
    if (nameCheck)
      return res.json({
        status: false,
        msg: "Username already taken",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({
      user,
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user)
      return res.json({
        status: false,
        msg: "Incorrect Username or Password",
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({
        status: false,
        msg: "Incorrect Password",
      });

    delete user.password;
    return res.json({
      user,
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};
