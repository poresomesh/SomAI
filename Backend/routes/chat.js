import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/gemini.js";

const router = express.Router();

// १. फक्त चालू युझरचे थ्रेड्स आणणे
router.get("/thread", async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) return res.status(400).json({ error: "UserId is required" });
    const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// २. थ्रेडचे मेसेजेस मिळवणे
router.get("/thread/:threadId", async (req, res) => {
  try {
    const thread = await Thread.findOne({ threadId: req.params.threadId });
    res.json(thread ? thread.messages : []);
  } catch (err) {
    res.status(500).json({ error: "Error loading thread" });
  }
});

// ३. नवीन मेसेज सेव्ह करणे
router.post("/chat", async (req, res) => {
  const { threadId, message, userId } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        threadId,
        userId: userId || "65f000000000000000000000",
        title: message.slice(0, 30),
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const botReply = await getGeminiAPIResponse(message);
    thread.messages.push({ role: "model", content: botReply });
    await thread.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat Router Error:", err);
    res.status(500).json({ error: "Chat processing error" });
  }
});

// ४. थ्रेड डिलीट करणे
router.delete("/thread/:threadId", async (req, res) => {
  try {
    await Thread.findOneAndDelete({ threadId: req.params.threadId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete error" });
  }
});

export default router;