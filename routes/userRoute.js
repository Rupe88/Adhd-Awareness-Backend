const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  deleteAllUsers,
  updateUserRole,
} = require("../controller/userController");
const router = express.Router();

//user router

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getUsers);
router.delete("/users/:id", deleteAllUsers);
router.put("/users/:id", updateUserRole);

module.exports = router;
