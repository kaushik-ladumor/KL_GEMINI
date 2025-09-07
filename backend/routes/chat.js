import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getOpenAiResponse from "../utils/openAi.js";

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({threadId});
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(200).json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOneAndDelete({threadId});
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res
      .status(404)
      .json({ message: "ThreadId not found or message is empty" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const aiResponse = await getOpenAiResponse(message);
    thread.messages.push({ role: "assistant", content: aiResponse });
    thread.updatedAt = new Date();
    await thread.save();
    res.status(201).json({ reply: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
