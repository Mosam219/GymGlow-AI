
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateGymVersion = async (base64Image: string): Promise<string> => {
  const ai = getAIClient();
  
  // Strip the prefix if present (e.g., data:image/png;base64,)
  const base64Data = base64Image.split(',')[1] || base64Image;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Data,
    },
  };

  const textPart = {
    text: "Analyze the person in this photo. Generate a new photo of this EXACT SAME person immediately after a high-intensity gym workout. They should look visibly sweaty with glistening skin, have a noticeable muscular 'pump', and be wearing athletic fitness apparel. The setting should be a professional, modern gym with weights and machines in the background. Maintain the person's unique facial features and identity perfectly.",
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No response from AI");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in AI response");
  } catch (error) {
    console.error("Error generating gym version:", error);
    throw error;
  }
};
