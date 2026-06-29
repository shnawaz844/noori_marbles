
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInteriorAdvice = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `You are a professional interior design consultant for Noori Marbels, a premium showroom in Bareilly. 
        We specialize in: Tiles, Ply boards, Furniture, PVC sheets, Sanitary wares, Hardware, Doors, Taps, and Laminates.
        Provide helpful, luxurious, and concise advice. Suggest products based on our categories. 
        Always mention that they should visit the showroom Near Airforce Gate for a personalized touch.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my design library. Please contact our experts at the showroom directly!";
  }
};
