
import { GoogleGenAI } from "@google/genai";

export async function getStyleAdvice(prompt: string): Promise<string> {
  try {
    // Initialize GoogleGenAI strictly using process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert celebrity barber and style consultant. A client is asking for advice: "${prompt}". Provide 3 concise, professional recommendations for their hair or beard style. Keep it under 150 words.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a recommendation right now. Please try again later.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI consultant is currently sharpening its scissors. Please try again soon.";
  }
}
