# ODocs OpenAI Demo

A simple demo project showing how to use the ODocs API with OpenAI's function calling capability.

## Prerequisite
URL of running ODocs Server

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install:
   - `openai` - OpenAI API client
   - `node-fetch` - For making HTTP requests
   - `dotenv` - For loading environment variables from .env file

2. **Set up environment variables**
   ```bash
   # Copy the example file (if you haven't already)
   cp .env.example .env
   
   # Edit .env to add your OPENAI_API_KEY and ODOCS_SERVER_URL
   ```

3. **Run the demo**
   ```bash
   node odocs-openai-test.js
   ```

## How It Works

The demo:
1. Asks OpenAI about creating middleware in Hono
2. OpenAI decides to use the ODocs tool to get documentation
3. The OpenAI calls the ODocs API via tool and returns the documentation
4. OpenAI provides a final response using the documentation

## Environment Variables

The `.env` file should contain:

```
OPENAI_API_KEY=your_openai_api_key_here
ODOCS_SERVER_URL=http://localhost:2803
```

- `OPENAI_API_KEY`: Your OpenAI API key
- `ODOCS_SERVER_URL`: URL to your ODocs server (local or ngrok)

## Project Structure

- `odocs-openai-test.js` - Main JavaScript demo file
- `package.json` - Project configuration and dependencies
- `.env.example` - Template for environment variables (committed to repository)
- `.env` - Actual environment variables (not committed to repository)