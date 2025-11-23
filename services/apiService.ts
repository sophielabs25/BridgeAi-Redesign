import { ToneType } from '../types';

const API_BASE_URL = '/api';

export const generateNodeDescription = async (nodeLabel: string, context: string, tone: ToneType): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-node-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeLabel, context, tone }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    return data.description;
  } catch (error) {
    console.error('API Error:', error);
    return "Could not generate description.";
  }
};

export const analyzeFlowCompleteness = async (nodeLabels: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-flow-completeness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodeLabels }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze flow');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { missing: [], suggestions: [] };
  }
};

export const analyzeProgressionStage = async (
  stageName: string, 
  propertyAddress: string, 
  leadName: string, 
  leadStatus: string
): Promise<{ summary: string; suggestedActions: any[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-progression-stage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stageName, propertyAddress, leadName, leadStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze progression');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { summary: "Could not generate AI insights.", suggestedActions: [] };
  }
};

export const analyzePropertyData = async (propertyData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-property`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze property');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { missingFields: [], improvements: [], sellingSummary: '' };
  }
};
