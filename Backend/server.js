import dns from 'node:dns/promises';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/api" , chatRoutes);
app.use("/api/auth", authRoutes);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const connectDB = async ()=>{
  try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Database Connected");
  }catch(err){
    console.log(err);
  }
}



app.listen(8080, () => {
  console.log("Server running on port 8080");
  connectDB();
});

























// // १. मॅमच्या '/test' ऐवजी नवीन '/chat' एंडपॉईंट
// app.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body; // फ्रंटएंडवरून येणारा मेसेज

//     const response = await ai.models.generateContent({
//       model: "gemini-3.5-flash", // किंवा तुमच्याकडे चालणारे मॉडेल
//       contents: message,
//     });

//     res.json({ reply: response.text });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });