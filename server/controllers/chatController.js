import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  try {
    // For text-only input, use the gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
      systemInstruction: `You are AutoMend AI, a professional automotive diagnostic assistant.
      Context: You are part of the AutoMend Garage Management System.
      Your goal is to help users:
      1. Diagnose potential vehicle issues based on symptoms.
      2. Explain automotive terms and parts.
      3. Recommend service types (Home vs Garage).
      4. Provide maintenance tips.
      
      Style: Professional, helpful, and concise. Always suggest booking a professional inspection for safety-critical issues (brakes, steering, fuel leaks).`
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({
      reply: text,
      status: "success"
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      reply: "I'm having trouble connecting to my diagnostic engine right now. Please try again later.",
      error: error.message
    });
  }
};
