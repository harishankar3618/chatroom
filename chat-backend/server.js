const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

const ChatMessage = require("./models/ChatMessage");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.get("/messages", async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    const chatMessage = new ChatMessage({ user, message });
    await chatMessage.save();
    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start HTTP Server on Port 5000 (Nginx handles SSL)
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
