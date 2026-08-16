import mongoose from "mongoose";

// १. मेसेज स्कीमा (Message Schema)
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "model"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// २. थ्रेड स्कीमा (Thread Schema - यात userId जोडला आहे)
const threadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [messageSchema], // 🟢 messageSchema चा वापर
  },
  { timestamps: true }
);

export default mongoose.model("Thread", threadSchema);