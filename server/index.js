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

// Simple in-memory cache for property analysis (persistent per property)
const propertyAnalysisCache = new Map();

app.post('/api/ai/analyze-property', async (req, res) => {
  try {
    const { address, price, bedrooms, bathrooms, sqft, description, features, portalStatus, epcRating, media, type, additionalDetails, postcode } = req.body;

    // Create a cache key based on property address and basic details
    const cacheKey = `${address}-${postcode}-${price}-${type}`;
    
    // Check cache first for consistent results
    if (propertyAnalysisCache.has(cacheKey)) {
      console.log('Returning cached analysis for:', address);
      return res.json(propertyAnalysisCache.get(cacheKey));
    }

    // Comprehensive field checking
    const missingFields = [];
    
    // Core listing information
    if (!description || description.length < 50) {
      missingFields.push({field: 'Detailed description', importance: 'high', reason: 'Rich descriptions increase engagement by 50% and help SEO'});
    }
    
    // Furnishing status (critical for lettings)
    if (type === 'Lettings' && !additionalDetails?.furnishing) {
      missingFields.push({field: 'furnishing', importance: 'high', reason: 'Lettings prospects need to know if the home is furnished/part-furnished/unfurnished to qualify themselves'});
    }
    
    // Available from date
    if (!additionalDetails?.availableFrom) {
      missingFields.push({field: 'availableFrom', importance: 'high', reason: 'Move-in date is a key filter on portals; missing it suppresses visibility and lead quality'});
    }
    
    // Visual media
    if (!media?.videoUrl) {
      missingFields.push({field: 'Property video tour', importance: 'high', reason: 'Video tours reduce wasted viewings by 30% and increase qualified enquiries'});
    }
    if (!media?.floorPlanUrl) {
      missingFields.push({field: 'Floor plan', importance: 'high', reason: 'Floor plans are the #1 requested asset; properties without them get 40% fewer saves'});
    }
    if (!media?.virtual3DTourUrl) {
      missingFields.push({field: 'virtual3DTour', importance: 'high', reason: 'A Matterport-style 3D tour reduces wasted viewings and helps relocation/corporate tenants decide remotely'});
    }
    
    // Portal coverage
    if (!portalStatus?.rightmove) {
      missingFields.push({field: 'Rightmove listing', importance: 'high', reason: 'Rightmove drives 70% of online property traffic in the UK'});
    }
    if (!portalStatus?.zoopla) {
      missingFields.push({field: 'Zoopla listing', importance: 'medium', reason: 'Zoopla complements Rightmove and captures different audience segments'});
    }
    if (!portalStatus?.website) {
      missingFields.push({field: 'Website listing', importance: 'medium', reason: 'Your own website builds brand and avoids portal dependency'});
    }
    
    // Features and amenities
    if (!features || features.length < 5) {
      missingFields.push({field: 'More feature highlights', importance: 'medium', reason: 'Listings with 8+ features get 25% more enquiries; buyers/tenants filter by amenities'});
    }
    
    // Building amenities (for flats/apartments)
    if ((address.toLowerCase().includes('apartment') || address.toLowerCase().includes('flat')) && 
        (!features || !features.some(f => f.toLowerCase().includes('gym') || f.toLowerCase().includes('concierge') || f.toLowerCase().includes('lounge')))) {
      missingFields.push({field: 'Detailed building amenities (e.g., residents\' lounge/spa, hours, any fees)', importance: 'medium', reason: 'Clarifies lifestyle offering and value versus comparable buildings'});
    }
    
    // Room dimensions
    if (!description || !description.toLowerCase().includes('m') && !description.toLowerCase().includes('ft')) {
      missingFields.push({field: 'Room dimensions in description (not just on plan)', importance: 'low', reason: 'Improves conversion from mobile viewers who may not open floor plans'});
    }
    
    // EPC
    if (!epcRating || epcRating === 'E' || epcRating === 'F' || epcRating === 'G') {
      missingFields.push({field: 'Energy efficiency improvements or updated EPC', importance: 'medium', reason: 'Low EPC ratings can deter eco-conscious buyers and may face future regulations'});
    }

    // Limit to top 10-12 most important missing fields
    const topMissingFields = missingFields.slice(0, 12);

    const prompt = `You are a Real Estate marketing expert analyzing UK property listings. Provide consistent, deterministic analysis for this property.

IMPORTANT: Your analysis must be comprehensive and consistent. For the same property details, always return the same suggestions.

Property Details:
- Address: ${address}, ${postcode}
- Price: ${price}
- Type: ${type}
- Bedrooms: ${bedrooms}, Bathrooms: ${bathrooms}, Size: ${sqft} sqft
- EPC Rating: ${epcRating || 'Not specified'}
- Current Features: ${features?.join(', ') || 'Not specified'}
- Furnishing: ${additionalDetails?.furnishing || 'Not specified'}
- Available From: ${additionalDetails?.availableFrom || 'Not specified'}
- Description Quality: ${description ? (description.length > 50 ? 'Good' : 'Too short') : 'Missing'}
- Has Video: ${media?.videoUrl ? 'Yes' : 'No'}
- Has Floor Plan: ${media?.floorPlanUrl ? 'Yes' : 'No'}
- Has Virtual 3D Tour: ${media?.virtual3DTourUrl ? 'Yes' : 'No'}
- Portal Coverage: Rightmove: ${portalStatus?.rightmove ? 'Yes' : 'No'}, Zoopla: ${portalStatus?.zoopla ? 'Yes' : 'No'}, Website: ${portalStatus?.website ? 'Yes' : 'No'}

Task: Provide exactly 8-12 specific improvement suggestions that would maximize this property's appeal and conversion rate.

NOTE: When suggesting improvements, consider that property details including commute times, nearby amenities, school ratings, and local area information should be researched and added from reliable UK property data sources.

Respond in JSON format:
{
  "missingFields": ${JSON.stringify(topMissingFields)},
  "improvements": [
    {"title": "Improvement title", "description": "Specific actionable step", "impact": "high|medium|low"}
  ],
  "sellingSummary": "Compelling 2-3 sentence marketing hook highlighting the property's best features and location appeal"
}

Generate exactly 8-12 improvements that are specific to this property type, location, and current state.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: 'You are a consistent Real Estate AI assistant. For identical inputs, provide identical outputs. Be deterministic and comprehensive.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent results
    });
    
    const result = JSON.parse(response.choices[0].message.content || '{"missingFields":[],"improvements":[],"sellingSummary":""}');
    
    // Ensure we have the missing fields we calculated
    result.missingFields = topMissingFields;
    
    // Cache the result for this property
    propertyAnalysisCache.set(cacheKey, result);
    
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
  
  app.use((req, res) => {
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
