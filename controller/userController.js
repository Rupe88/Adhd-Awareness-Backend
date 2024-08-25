const catchAsyncErrors = require("../middleware/catchAsyncError");
const generateToken = require("../middleware/generateToken");
const User = require("../model/userModel");
//register
const registerUser = catchAsyncErrors(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username , email and password",
      });
    }

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({
        message: "email already exists",
        succesS: false,
      });
    }
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    return res.status(200).json({
      message: "user register successfully!",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in register user api",
    });
  }
});
//login user
const loginUser = catchAsyncErrors(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "please provide email and password",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not Found",
        success: false,
      });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "invalid password",
      });
    }

    //to do is to generate token

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, //enable this when you have https://
      secure: true,
      sameSite: None,
    });
    return res.status(200).json({
      message: "user login Successfully",
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in login user api",
      error,
    });
  }
});

// logout user
const logoutUser = catchAsyncErrors(async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "user logged Out",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in logout api",
      success: false,
      error,
    });
  }
});

// get all users
const getUsers = catchAsyncErrors(async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "users fetch successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in get all user api",
    });
  }
});

// delete all users

const deleteAllUsers = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    return res.status(200).json({
      message: "user deleted successfuly",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in delete all user api",
    });
  }
});

//update a user role
const updateUserRole = catchAsyncErrors(async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "user role updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error in update user role api",
      success: false,
    });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  deleteAllUsers,
  updateUserRole,
};
