const express = require("express");
const {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  relatedPOst,
} = require("../controller/blogController");
const verifyToken = require("../middleware/verifyToken");
const isAdminn = require("../middleware/isAdmin");
const router = express.Router();
//routes
router.post("/create-post", verifyToken, isAdminn, createPost);
router.get("/", getAllPost);
router.get("/:id", getSinglePost);
router.patch("/update-post/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, isAdminn, deletePost);
router.get("/related/:id", relatedPOst);

module.exports = router;
