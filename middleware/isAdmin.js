const isAdminn = async (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      message:
        "You are not allowed to perform this action , please try to login as an admin",
      success: false,
    });
  }
  next();
};

module.exports=isAdminn;
