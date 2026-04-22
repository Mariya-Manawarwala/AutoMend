import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithAI = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `You are AutoMend AI Assistant for a garage management system.\n\nUser query: ${message}`,
          },
        ],
      },
    ],
  });

  res.json({
    userMessage: message,
    aiResponse: response.text || "Error processing request",
  });
};
