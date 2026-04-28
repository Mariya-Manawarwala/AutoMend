import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithAI = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `You are AutoMend AI, a professional and helpful assistant for a Garage Management System. 
      Your goal is to help users diagnose vehicle issues, recommend services, and assist with bookings.
      Always be polite, concise, and provide actionable advice.
      
      User query: ${message}`,
    });

    res.json({
      userMessage: message,
      aiResponse: response.text || "I'm sorry, I couldn't process that.",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.json({
      userMessage: message,
      aiResponse: "I am currently offline. Please try again later. (Error: " + error.message + ")",
    });
  }
};
