
import { GoogleGenAI, Type } from "@google/genai";
import { WasteCategory } from "../types";

export interface AIWasteAnalysis {
  itemName: string;
  category: WasteCategory;
  isRecyclable: boolean;
  instructions: string;
  impactInfo: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeWasteImage = async (base64Image: string): Promise<AIWasteAnalysis> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image
          }
        },
        {
          text: "Analyze this image of a waste item. Identify the item name, categorize it into one of these: Plastic, Paper, Glass, Metal, Organic, Electronic, or Other. Determine if it is recyclable, provide brief disposal instructions, and a short fact about its environmental impact. Return the result in a clean JSON format."
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING },
          category: { 
            type: Type.STRING,
            description: "Must be one of: Plastic, Paper, Glass, Metal, Organic, Electronic, Other"
          },
          isRecyclable: { type: Type.BOOLEAN },
          instructions: { type: Type.STRING },
          impactInfo: { type: Type.STRING }
        },
        required: ["itemName", "category", "isRecyclable", "instructions", "impactInfo"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as AIWasteAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not analyze waste item.");
  }
};
