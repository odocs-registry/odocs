# @odocs/cli

> Solving version blindness in AI-assisted development (Early Prototype)

[![npm version](https://img.shields.io/npm/v/@odocs/cli.svg)](https://www.npmjs.com/package/@odocs/cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-prototype-orange.svg)]()

ODocs CLI is a command-line tool that aims to solve the "version blindness" problem in AI coding assistants. This early prototype currently only supports **Hono 4.7.5** as a proof of concept. It demonstrates how detecting frameworks in your projects and providing version-specific documentation to your AI assistants can ensure they generate compatible code on the first try.

## Why ODocs?

AI coding assistants are powerful but suffer from "version blindness" - they can't detect which framework versions you're using or access the correct documentation. This results in:

- Broken code suggestions that don't work with your specific versions
- Wasted time debugging compatibility issues
- Security vulnerabilities from outdated patterns
- Missing optimizations introduced in newer versions

ODocs bridges this gap by providing version-specific documentation to your AI assistants.

## Installation

```bash
# Install globally
npm install -g @odocs/cli

# Or use with npx
npx @odocs/cli serve
```

## Quick Start (Prototype)

> **IMPORTANT**: This prototype currently only supports **Hono 4.7.5**. Your project must use this specific version of Hono for the prototype to work properly.

```bash
# Navigate to your Hono 4.7.5 project directory
cd your-hono-project

# Start the ODocs server
odocs serve
```

This will:
1. Scan your project files to detect if Hono 4.7.5 is being used
2. Pull the Hono 4.7.5 documentation from our prototype repository
3. Start a local server that your AI assistant can connect to
4. Enable version-aware code generation for Hono 4.7.5

## Commands

### `odocs serve`

Starts the local documentation server.

```bash
odocs serve [options]
```

Options:
- `--port <port>`: Specify the server port (default: 2803)
- `--cache-dir <path>`: Set custom cache directory
- `--verbose`: Enable verbose logging
- `--no-cache`: Disable documentation caching

Example:
```bash
odocs serve --port 3000 --verbose
```

### `odocs detect`

Scans your project and displays detected frameworks and versions.

```bash
odocs detect
```

Example output:
```
→ Scanning package.json...
→ Detected frameworks:
  - hono:4.7.5
```

> Note: In this prototype, only Hono 4.7.5 will be detected. Support for other frameworks and versions is planned for future releases.

### `odocs pull`

Manually pulls documentation for a specific package.

```bash
odocs pull <package> [version]
```

Arguments:
- `package`: Framework name (e.g., `hono`, `nextjs`)
- `version`: Optional version (defaults to latest)

Example:
```bash
odocs pull hono 4.7.5
```

> Note: In this prototype, only `hono 4.7.5` is supported by the `pull` command.

## Connecting to AI Assistants

Once the ODocs server is running, you can connect your AI assistant to it in several ways:

### Method 1: Function Calling

If your AI assistant supports function calling, use this schema:

```javascript

// file: odocs-openai-test.js
// node odocs-openai-test.js

import { OpenAI } from 'openai';
import fetch from 'node-fetch';
import 'dotenv/config';

// OpenAI API key from .env file
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Replace with your ngrok URL
const ODOCS_SERVER_URL = process.env.ODOCS_SERVER_URL || "http://localhost:2803";

// Define your tool for OpenAI
const tools = [
  {
    type: "function",
    function: {
      name: "get_package_documentation",
      description: "Get documentation for a specific package and version",
      parameters: {
        type: "object",
        properties: {
          package: {
            type: "string",
            description: "The name of the package (e.g., 'hono')"
          },
          version: {
            type: "string",
            description: "The version of the package (e.g., '4.7.5')",
            default: "latest"
          }
        },
        required: ["package"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_detected_packages",
      description: "Get the list of packages detected in the current project",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  }
];

// Function to call ODocs API through ngrok
async function callODocsAPI(functionName, args) {
  try {
    if (functionName === "get_package_documentation") {
      const { package: packageName, version = "latest" } = args;
      const response = await fetch(`${ODOCS_SERVER_URL}/api/docs/${packageName}/${version}`);
      return await response.json();
    } else if (functionName === "get_detected_packages") {
      const response = await fetch(`${ODOCS_SERVER_URL}/api/packages`);
      return await response.json();
    }
    
    return { error: "Unknown function name" };
  } catch (error) {
    return { error: error.message };
  }
}

async function runTest() {
  try {
    // First, ask a question that should trigger tool use
    const messages = [
      { role: "system", content: "You are a helpful assistant for programming tasks." },
      { role: "user", content: "How do I create middleware in Hono? Make sure to use the latest version." }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      tool_choice: "auto"
    });

    const responseMessage = response.choices[0].message;
    console.log("Initial assistant response:", responseMessage);

    // Check if the assistant wants to use a tool
    if (responseMessage.tool_calls) {
      const toolCalls = responseMessage.tool_calls;
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`Tool call: ${functionName}(${JSON.stringify(functionArgs)})`);
        
        // Call the ODocs API through ngrok
        const functionResponse = await callODocsAPI(functionName, functionArgs);
        console.log("ODocs response:", JSON.stringify(functionResponse).substring(0, 200) + "...");
        
        // Add the function response to the messages
        messages.push(responseMessage);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(functionResponse)
        });
      }
      
      // Get a new response from the assistant with the function information
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages
      });
      
      console.log("\nFinal response with ODocs information:");
      console.log(secondResponse.choices[0].message.content);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

runTest();
```

### Method 2: MCP Integration

For AI assistants that support the Model Context Protocol, the server automatically exposes an MCP endpoint at `http://localhost:2803/mcp`.

## API Endpoints

The ODocs server exposes these endpoints:

```
GET /api/packages
Returns: [{ name: "hono", version: "4.7.5", installedPath: "./node_modules/hono" }]

GET /api/docs/hono/4.7.5
Returns: { content: "# Hono Documentation content..." }

GET /api/docs/hono/latest
Returns: { version: "4.7.5", content: "# Hono Documentation content..." }

> Note: In this prototype, only endpoints related to Hono 4.7.5 will return meaningful results.
```

## Supported Frameworks

This prototype currently **only** supports:

- **JavaScript/TypeScript**:
  - Hono 4.7.5

This limited implementation serves as a proof of concept for the broader vision of ODocs. Future development plans include support for:

- Next.js
- React
- Vue/Nuxt
- TailwindCSS
- Django
- FastAPI
- And many more...

The prototype is intentionally limited in scope to demonstrate the core concept of version-aware documentation for AI code generation. Framework maintainers interested in participating in future developments can reach out via our GitHub repository.

## Local Caching

ODocs caches documentation locally to improve performance:

- Downloaded documentation stored in user's directory under `.odocs` folder
- Cached by framework name and version
- Default TTL-based expiry of 7 days (configurable)

## Configuration (Limited in Prototype)

In this prototype, configuration options are limited. Basic server options can be specified through command-line flags:

```bash
odocs serve --port 3000 --verbose
```

Advanced configuration via `odocs.config.js` is planned for future releases but not fully supported in this prototype. The following is a preview of the planned configuration format:

```javascript
// Note: Limited functionality in prototype
module.exports = {
  // Server configuration
  server: {
    port: 2803,
    host: 'localhost'
  },
  
  // Cache configuration
  cache: {
    directory: './.odocs-cache',
    ttl: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }
};
```

## Prototype Limitations

This early prototype has several limitations to be aware of:

1. **Single Framework Support**: Only Hono 4.7.5 is currently supported
2. **Limited Error Handling**: The prototype may not gracefully handle all edge cases
3. **Basic Documentation Format**: The documentation is provided in a simple format without advanced vector embedding
4. **Simplified Caching**: Basic file system caching without sophisticated management
5. **Limited Configuration**: Few configuration options available compared to planned features

## Contributing to the Prototype

ODocs is an open-source project in its early stages, and we welcome contributions! Visit our [GitHub repository](https://github.com/odocs-registry/odocs) to:

- Test the prototype with Hono 4.7.5 projects and provide feedback
- Report bugs in the current implementation
- Suggest features for future development
- Help improve documentation
- Contribute to expanding framework support beyond Hono

## License

MIT

## Roadmap

This prototype is the first step in our journey to solve the version blindness problem for AI code generation. Our roadmap includes:

1. **Expanded Framework Support**: Adding more frameworks and programming languages
2. **Vector Database**: Implementing efficient semantic search of documentation
3. **IDE Integrations**: Creating VS Code extensions and other editor plugins
4. **MCP Protocol Refinement**: Improving the Model Context Protocol integration
5. **Documentation Registry**: Building a full-featured registry for framework maintainers

## Testing the Prototype

To test this prototype:

1. Create or use a project with Hono 4.7.5 installed
2. Install and run the ODocs CLI
3. Interact with an AI assistant, informing it about the ODocs server
4. Ask the AI to generate Hono-specific code
5. Compare results with and without ODocs

---

Built with ❤️ by the ODocs team | [odocs.dev](https://odocs.dev)

---

**Note**: This is an early prototype to demonstrate the concept of version-aware AI code generation. We appreciate your patience and feedback as we work to build out the full vision of ODocs.