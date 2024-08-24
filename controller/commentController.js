const catchAsyncErrors = require("../middleware/catchAsyncError");
const Blog = require("../model/blogModel");
const Comment = require("../model/commentModel");
const postComment = catchAsyncErrors(async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();

    return res.status(200).json({
      message: "new Comment posted success",
      newComment,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "error in post comment api",
      error,
    });
  }
});

const getAllComments = catchAsyncErrors(async (req, res) => {
  try {

    const totalComment=await Comment.countDocuments({});
    return res.status(200).json({
      message:"Total Comments Count",
      totalComment
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in get all comments api",
      error,
    });
  }
});

module.exports = {
  postComment,
  getAllComments,
};
