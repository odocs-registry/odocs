import axios from 'axios';

// Simple MCP connector
export async function injectContextMCP(message: string) {
  // 1. Extract package mentions from the message
  const packageMentions = extractPackageMentions(message);
  
  // 2. Fetch docs for mentioned packages
  const documentationContext = await fetchDocumentationForPackages(packageMentions);
  
  // 3. Create the context message to inject
  return `
I'll help you with your question. First, let me provide some relevant documentation:

${documentationContext}

Now, let me answer your question.
`;
}

function extractPackageMentions(message: string) {
  // Simple regex to match common package names
  // This would be much more sophisticated in a real implementation
  const packageRegex = /(hono|react|next\.?js)/gi;
  const matches = message.match(packageRegex) || [];
  
  // Return unique matches
  return [...new Set(matches.map(m => m.toLowerCase()))];
}

async function fetchDocumentationForPackages(packages: string[]) {
  let context = '';
  
  for (const pkg of packages) {
    try {
      // Clean up package name
      const cleanPackageName = pkg.replace(/\.?js$/, '');
      
      // Fetch package info from local ODocs server
      const response = await axios.get('http://localhost:2803/api/docs/' + cleanPackageName + '/latest');
      
      // Add relevant parts of the documentation to context
      context += `${response.data.content}\n\n`;
    } catch (error) {
      console.error(`Failed to fetch documentation for ${pkg}`);
    }
  }
  
  return context;
}
