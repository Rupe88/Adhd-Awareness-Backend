const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectionDB = require("./config/connection");
const cookieParser = require("cookie-parser");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const translate  = require('google-translate-open-api');

// Routes
const authRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "https://adhd-awareness-frontend.vercel.app",
  credentials: true,
}));

// Greeting and processing chat messages
app.post('/chat', async (req, res) => {
  const message = req.body.message;
  const translateToNepali = message.toLowerCase().includes('translate it in nepali');

  try {
    const prompt = `
      Namaste, I am Rupesh AI. How can I help you?
      You are an AI assistant specializing in ADHD awareness and mental health.
      Provide accurate and helpful information about ADHD or mental health based on the following question: ${message}
    `;

    // Generate content using Google Generative AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (translateToNepali) {
      // Translate the response to Nepali
      const translated = await translate(text, { tld: 'com', to: 'ne' });
      return res.json({ response: translated.data[0] });
    }

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
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
