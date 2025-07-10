# AI News Agent

An AI-powered news agent that fetches, processes, and delivers news using OpenAI and Firebase.

## Prerequisites

- Node.js >= 16.0.0
- npm (comes with Node.js)
- Firebase project with Firestore database
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your configuration:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your Firebase and OpenAI credentials

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reload
- `npm test` - Run tests (not implemented yet)

## Project Structure

```
ai-news-agent/
├── src/
│   ├── index.js          # Main application entry point
│   └── firebaseClient.js # Firebase client configuration
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email@project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

## API Endpoints

- `GET /status` - Check if the service is running

## License

ISC
