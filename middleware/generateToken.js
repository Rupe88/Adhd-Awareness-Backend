const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
module.exports = generateToken;
