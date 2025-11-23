import OpenAI from "openai";
import { ToneType } from '../types';

// Using blueprint:javascript_openai integration
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const getAiClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY is not set in environment variables.");
    return null;
  }
  return new OpenAI({ apiKey });
};

export const generateNodeDescription = async (nodeLabel: string, context: string, tone: ToneType) => {
  const ai = getAiClient();
  if (!ai) return "AI Client not initialized (Missing API Key).";

  try {
    const response = await ai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'user',
          content: `You are an expert automation engineer for Real Estate.
      The user is building a Flow Builder and has selected a node labeled "${nodeLabel}".
      
      Context: The workflow is for "${context}".
      Tone: The description should be "${tone}".

      Task: Generate a concise, 1-sentence description for this node. The description should explain the node's purpose clearly to the user.`
        }
      ],
    });
    return response.choices[0].message.content || "Could not generate description.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
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

    const response = await ai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });
    
    return JSON.parse(response.choices[0].message.content || '{"missing":[],"suggestions":[]}');
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return { missing: [], suggestions: [] };
  }
};
