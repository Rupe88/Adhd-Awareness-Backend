const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // const token=req.headers.authorization?.split(' ')[1]; //bearer token
    if (!token) {
      return res.status(401).json({
        message: "no token provided",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.userId) {
      return res.status(401).json({
        message: "invalid token provided",
      });
    }
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;
