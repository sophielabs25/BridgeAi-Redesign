import { GoogleGenAI } from "@google/genai";
import { ToneType } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateNodeDescription = async (nodeLabel: string, context: string, tone: ToneType) => {
  const ai = getAiClient();
  if (!ai) return "AI Client not initialized (Missing API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert automation engineer for Real Estate.
      The user is building a Flow Builder and has selected a node labeled "${nodeLabel}".
      
      Context: The workflow is for "${context}".
      Tone: The description should be "${tone}".

      Task: Generate a concise, 1-sentence description for this node. The description should explain the node's purpose clearly to the user.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description.";
  }
};

export const analyzeFlowCompleteness = async (nodeLabels: string[]) => {
  const ai = getAiClient();
  if (!ai) return { missing: [], suggestions: [] };

  try {
    const prompt = `Analyze this Real Estate automation flow structure. 
    Nodes present: ${nodeLabels.join(', ')}.
    Return a JSON object with two arrays: 'missing' (critical missing steps) and 'suggestions' (improvements).
    Return ONLY JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
        responseMimeType: "application/json",
      },
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { missing: [], suggestions: [] };
  }
};