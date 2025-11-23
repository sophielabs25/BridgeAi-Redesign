import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/ai/generate-node-description', async (req, res) => {
  try {
    const { nodeLabel, context, tone } = req.body;

    const response = await openai.chat.completions.create({
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

    res.json({ description: response.choices[0].message.content || "Could not generate description." });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
});

app.post('/api/ai/analyze-flow-completeness', async (req, res) => {
  try {
    const { nodeLabels } = req.body;

    const prompt = `Analyze this Real Estate automation flow structure. 
    Nodes present: ${nodeLabels.join(', ')}.
    Return a JSON object with two arrays: 'missing' (critical missing steps) and 'suggestions' (improvements).
    Return ONLY JSON.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{"missing":[],"suggestions":[]}');
    res.json(result);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to analyze flow', missing: [], suggestions: [] });
  }
});

app.post('/api/ai/analyze-progression-stage', async (req, res) => {
  try {
    const { stageName, propertyAddress, leadName, leadStatus } = req.body;

    const prompt = `You are a Real Estate AI assistant analyzing a sales/lettings progression.
    
    Current Details:
    - Stage: ${stageName}
    - Property: ${propertyAddress}
    - Lead: ${leadName}
    - Status: ${leadStatus}
    
    Provide:
    1. A brief summary (2-3 sentences) of what typically happens at this stage
    2. Suggest 2-3 specific actions the agent should take next
    
    Return a JSON object with:
    {
      "summary": "Brief stage summary...",
      "suggestedActions": [
        {"title": "Action title", "description": "Why this action", "priority": "high|medium|low"}
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{"summary":"","suggestedActions":[]}');
    res.json(result);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to analyze progression', summary: "Could not generate AI insights.", suggestedActions: [] });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
