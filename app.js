const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectionDB = require("./config/connection");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true, 
}));

// Testing endpoint
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello from ADHD",
    success: true,
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/comment", commentRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectionDB();
});
