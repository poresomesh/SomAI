import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function getGeminiAPIResponse(message) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "No response received.";
  } catch (error) {
    console.error("Groq Processing Error:", error);
    throw error;
  }
}