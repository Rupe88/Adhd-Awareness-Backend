const catchAsyncErrors = require("../middleware/catchAsyncError");
const mongoose=require("mongoose");
const Blog = require("../model/blogModel");
const Comment = require("../model/commentModel");
//create post
const createPost = catchAsyncErrors(async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId });
    await newPost.save();

    return res.status(200).json({
      message: "Post created successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in create post API",
      success: false,
    });
  }
});

//fetch all posts

const getAllPost = catchAsyncErrors(async (req, res) => {
  try {
    const { search, category, location } = req.query;
    console.log(search);

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category,
      };
    }

    if (location) {
      query = {
        ...query,
        location,
      };
    }
    const posts = await Blog.find(query)
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in get all post API",
      success: false,
    });
  }
});

//fetch single posts adn also comment
const getSinglePost = catchAsyncErrors(async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "Invalid post ID format",
        success: false,
      });
    }

    // Fetch the post by ID
    const post = await Blog.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Fetch the comments associated with the post and populate the user details
    const comments = await Comment.find({ postId }).populate("user", "username email");

    return res.status(200).json({
      post,
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching the single post",
      success: false,
    });
  }
});

//update
const updatePost = catchAsyncErrors(async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(400).json({
        message: "post not found || not updated ",
      });
    }

    return res.status(200).json({
      message: "updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in update message api",
      error,
      success: false,
    });
  }
});

//delete  post
const deletePost = catchAsyncErrors(async (req, res) => {
  try {
    const postId = req.params.id;
    const deletePost = await Blog.findByIdAndDelete(postId);
    if (!deletePost) {
      return res.status(404).json({
        message: "post id not found",
      });
    }

    //delete related commnet
    await Comment.deleteMany({ postId: postId });
    return res.status(200).json({
      message: "post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in delete api",
      error,
    });
  }
});

//related post

const relatedPOst = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "post id is required",
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(400).json({
        message: "post is not found",
      });
    }

    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");
    const relatedQuery = {
      _id: { $ne: id }, //exclude current blog by id,
      title: { $regex: titleRegex },
    };

    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).json(relatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in related post api",
      error,
    });
  }
});
module.exports = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
  relatedPOst,
};
