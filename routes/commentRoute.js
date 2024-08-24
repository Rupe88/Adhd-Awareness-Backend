const express = require("express");
const {
  postComment,
  getAllComments,
} = require("../controller/commentController");
const router = express.Router();

//comment routes

router.post("/post-comment", postComment);
router.get("/total-comment", getAllComments);

module.exports = router;
