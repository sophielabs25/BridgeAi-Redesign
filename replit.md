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
- Node description generation using OpenAI GPT-5
- Flow completeness analysis
- Workflow suggestions and improvements
- Tone customization (Friendly, Professional, Formal, Playful, Concise)
