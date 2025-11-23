import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isDevelopment = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || (isDevelopment ? 3001 : 5000);

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

app.post('/api/ai/analyze-property', async (req, res) => {
  try {
    const { address, price, bedrooms, bathrooms, sqft, description, features, portalStatus, epcRating, media, type } = req.body;

    const missingFields = [];
    if (!description || description.length < 50) missingFields.push('Detailed description');
    if (!media?.videoUrl) missingFields.push('Property video tour');
    if (!media?.floorPlanUrl) missingFields.push('Floor plan');
    if (!media?.virtualTourUrl && type === 'Sales') missingFields.push('Virtual tour');
    if ((!portalStatus?.rightmove && !portalStatus?.zoopla) || !portalStatus?.website) missingFields.push('Portal coverage');
    if (!features || features.length < 3) missingFields.push('More feature highlights');
    if (!epcRating || epcRating === 'E' || epcRating === 'F') missingFields.push('Energy efficiency improvements');

    const prompt = `You are a Real Estate marketing expert. Analyze this property listing and provide specific, actionable improvements:

Property Details:
- Address: ${address}
- Price: ${price}
- Type: ${type}
- Bedrooms: ${bedrooms}, Bathrooms: ${bathrooms}, Size: ${sqft} sqft
- EPC Rating: ${epcRating}
- Current Features: ${features?.join(', ') || 'Not specified'}
- Description Quality: ${description ? 'Provided' : 'Missing'}
- Has Video: ${media?.videoUrl ? 'Yes' : 'No'}
- Has Floor Plan: ${media?.floorPlanUrl ? 'Yes' : 'No'}
- Portal Coverage: Rightmove: ${portalStatus?.rightmove ? 'Yes' : 'No'}, Zoopla: ${portalStatus?.zoopla ? 'Yes' : 'No'}, Website: ${portalStatus?.website ? 'Yes' : 'No'}
- Missing Fields: ${missingFields.join(', ') || 'All key fields present'}

Provide recommendations in JSON format:
{
  "missingFields": [{"field": "name", "importance": "high|medium|low", "reason": "why this matters"}],
  "improvements": [{"title": "Improvement title", "description": "Specific action", "impact": "high|medium|low"}],
  "sellingSummary": "2-3 sentence marketing hook for this property"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" },
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{"missingFields":[],"improvements":[],"sellingSummary":""}');
    res.json(result);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to analyze property', missingFields: [], improvements: [], sellingSummary: '' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

if (!isDevelopment) {
  const distPath = path.join(__dirname, '..', 'dist');
  
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  const mode = isDevelopment ? 'development' : 'production';
  console.log(`Backend server running on http://localhost:${PORT} in ${mode} mode`);
  if (!isDevelopment) {
    console.log(`Serving static files from dist folder`);
  }
});
