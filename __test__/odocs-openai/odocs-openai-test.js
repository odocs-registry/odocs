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