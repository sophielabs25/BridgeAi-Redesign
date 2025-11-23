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
│   ├── AIFlowCreator.tsx # AI chat interface for flow generation
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
- ✅ **AI Flow Creator**: Chat-based automation workflow generation
  - Natural language interface where users describe automation needs
  - AI analyzes requirements and generates complete workflow structures
  - Automatic node and edge generation with proper positioning
  - Seamless transition from chat to visual FlowBuilder for customization
  - Backend endpoint `/api/ai/generate-flow` powered by GPT-5
  - Support for all node types: trigger, action, condition, ai_process, integration
  - "New Flow" button now launches AI chat interface instead of template gallery
- ✅ **Consistent AI Suggestions (Top 10-15 per Property)**: Deterministic suggestion system
  - Backend generates 8-12 comprehensive suggestions per property
  - Intelligent caching mechanism using property address + postcode + price + type
  - Same suggestions display every time for the same property (no randomness)
  - Extended property fields: furnishing, availableFrom, commute information
  - Overview tab displays all new property fields with "Not specified" fallbacks
  - Additional Details tab shows comprehensive property information including commute modes
  - Fixed: Removed unsupported temperature parameter for GPT-5 model compatibility
- ✅ **AI Suggestions Accept/Decline Functionality**: Interactive suggestion management
  - Accept/Decline buttons for AI marketing hook suggestions
  - Individual Accept/Decline buttons for each missing field
  - Automatic property updates when accepting suggestions (furnishing, availableFrom, commute, etc.)
  - Visual feedback with success messages for accepted items
  - Declined suggestions automatically hidden from view
  - Property changes reflected immediately across all tabs
  - Async race condition protection using useRef for multi-property switching
  - Per-property state isolation (no leakage between properties)
- ✅ **Property Edit Page with AI Auto-Fill**: Complete edit functionality
  - Click Edit button on property details to open edit page
  - AI automatically analyzes property and suggests improvements
  - "Apply AI" button to auto-fill description with AI-generated marketing hook
  - Edit all fields: address, price, bedrooms, bathrooms, features, EPC rating, etc.
  - Add/remove features dynamically
  - Portal status checkboxes (Rightmove, Zoopla, Website)
  - Save changes updates property data and returns to details view
- ✅ **AI Suggestions Tab**: Property analysis with recommendations
  - Missing information detection (videos, floor plans, descriptions, etc.)
  - Impact-rated improvement suggestions (high/medium/low)
  - AI-generated marketing hooks for property listings
- ✅ **Sidebar Toggle Feature**: Collapsible sidebar with smooth animations
  - Close button in sidebar header pushes content to the right
  - Open button appears in header when sidebar is closed
  - Smooth width transition (260px → 0px)
- ✅ **Secure Backend Architecture**: Migrated AI calls to Express backend
  - Backend server on port 3001 handles all OpenAI API calls
  - Vite proxy routes /api/* requests to backend
  - API key stored securely server-side only
- ✅ Migrated from Gemini AI to OpenAI (GPT-5)
- ✅ Configured for Replit environment (port 5000, HMR over WSS)
- ✅ Added OpenAI integration for AI-powered workflow insights
- ✅ Updated service layer to use OpenAI SDK
- ✅ **Production Deployment Configuration**: Ready for deployment
  - Autoscale deployment target for stateless web applications
  - Production build creates optimized dist folder
  - Production server serves API + static files on single port
  - Environment-aware port configuration (dev: 3001, prod: 5000)
  - No development scripts in production deployment
  - Express 5 compatible catch-all route for SPA routing

## Environment Variables
- `OPENAI_API_KEY` (Secret) - Required for AI features

## Development
The application runs on port 5000 with hot module replacement enabled.

### Commands
- `npm run dev:all` - Start both backend (port 3001) and frontend (port 5000) in development mode
- `npm run build` - Build frontend for production
- `npm start` - Start production server (serves API + static files on port 5000)
- `npm run preview` - Preview production build

### Environment-Aware Configuration
- **Development Mode**: Backend on port 3001, Vite dev server on port 5000 with proxy
- **Production Mode**: Single server on port 5000 serving both API routes and static files from dist folder

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
The application uses a secure backend architecture to protect the OpenAI API key:

### Development Mode
- **Express Backend** (Port 3001): Handles all OpenAI API calls
- **Vite Frontend** (Port 5000): React application with proxy to backend
- **Proxy Configuration**: All `/api/*` requests are proxied from frontend to backend

### Production Mode
- **Express Server** (Port 5000): Serves both API routes and static files from dist folder
- **Static Files**: Built frontend assets served from dist directory
- **API Routes**: All `/api/*` endpoints remain accessible

### API Endpoints
- `POST /api/ai/generate-node-description` - Generate workflow node descriptions
- `POST /api/ai/analyze-flow-completeness` - Analyze workflow completeness
- `POST /api/ai/analyze-progression-stage` - Analyze pipeline stages with AI insights
- `POST /api/ai/generate-flow` - Generate complete workflow from natural language description
- `GET /api/health` - Backend health check

### Security
- ✅ API key stored securely in environment variables (server-side only)
- ✅ No API key exposure in browser/client code
- ✅ All AI calls routed through secure backend
- ✅ CORS configured for development environment
