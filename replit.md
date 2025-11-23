# BridgeAI Automation Platform

## Overview
BridgeAI is a Real Estate automation platform that provides workflow builders, pipeline management, and AI-powered automation tools for property management businesses. The platform features a visual flow builder for creating custom automation workflows.

## Tech Stack
- **Frontend**: React 19.2.0 + TypeScript
- **Build Tool**: Vite 6.2.0
- **UI Framework**: Tailwind CSS (CDN)
- **Icons**: Lucide React
- **Charts**: Recharts
- **AI Integration**: OpenAI (GPT-5) for workflow insights and automation

## Project Structure
```
├── components/          # React components
│   ├── Dashboard.tsx
│   ├── FlowBuilder.tsx  # Visual workflow builder
│   ├── Inbox.tsx
│   ├── Pipeline.tsx
│   ├── Properties.tsx
│   ├── Tasks.tsx
│   ├── TemplateGallery.tsx
│   └── TemplatePreview.tsx
├── services/           # Service layer
│   └── openaiService.ts # OpenAI integration for AI features
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
├── index.html         # HTML template
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
├── chatData.ts        # Chat data
├── pipelineData.ts    # Pipeline data
├── propertiesData.ts  # Properties data
└── vite.config.ts     # Vite configuration
```

## Recent Changes (November 23, 2025)
- ✅ Migrated from Gemini AI to OpenAI (GPT-5)
- ✅ Configured for Replit environment (port 5000, HMR over WSS)
- ✅ Added OpenAI integration for AI-powered workflow insights
- ✅ Updated service layer to use OpenAI SDK
- ✅ Configured deployment settings for autoscale

## Environment Variables
- `OPENAI_API_KEY` (Secret) - Required for AI features

## Development
The application runs on port 5000 with hot module replacement enabled.

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features
- **Flow Builder**: Visual drag-and-drop workflow builder with AI assistance
- **Pipeline Management**: Track and manage real estate pipelines
- **Task Management**: Organize and assign tasks
- **Properties**: Manage property listings
- **Automations**: Create and manage automation workflows
- **AI Insights**: Get AI-powered suggestions for workflow optimization

## Alto API Integration
The platform integrates with the Alto CRM API for:
- Lead management
- Client management
- Property management
- Sales and lettings progression
- Appointments and viewings
- File notes and documents

## AI Features
- **Flow Builder**: Node description generation using OpenAI GPT-5
- **Flow Builder**: Flow completeness analysis
- **Flow Builder**: Workflow suggestions and improvements
- **Pipeline Progression**: Stage-specific AI analysis with contextual summaries
- **Pipeline Progression**: Smart action suggestions with one-click task creation
- **Pipeline Progression**: Priority-based recommendations (high/medium/low)
- Tone customization (Friendly, Professional, Formal, Playful, Concise)

### AI-Powered Progression Insights
When users click on any stage card in the pipeline:
1. AI analyzes the current stage, property, lead status, and context
2. Provides a concise summary of what typically happens at this stage
3. Suggests 2-3 prioritized actions the agent should take
4. Offers one-click "Create Task" buttons for each suggested action
5. Displays deal details and option to view full progression

## Backend Architecture
The application now uses a secure backend architecture to protect the OpenAI API key:

### Server Setup
- **Express Backend** (Port 3001): Handles all OpenAI API calls
- **Vite Frontend** (Port 5000): React application with proxy to backend
- **Proxy Configuration**: All `/api/*` requests are proxied from frontend to backend

### API Endpoints
- `POST /api/ai/generate-node-description` - Generate workflow node descriptions
- `POST /api/ai/analyze-flow-completeness` - Analyze workflow completeness
- `POST /api/ai/analyze-progression-stage` - Analyze pipeline stages with AI insights
- `GET /api/health` - Backend health check

### Security
- ✅ API key stored securely in environment variables (server-side only)
- ✅ No API key exposure in browser/client code
- ✅ All AI calls routed through secure backend
- ✅ CORS configured for development environment
