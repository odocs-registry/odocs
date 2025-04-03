import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import type { Context, Next } from 'hono';
import { DetectedPackage } from '../detection/index.js';
import { fetchDocumentation } from './documentation.js';
import chalk from 'chalk';

// Add a simple logger middleware with proper types
const logger = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  
  await next();
  
  const end = Date.now();
  const time = end - start;
  const status = c.res.status;
  
  const timestamp = new Date().toISOString();
  const statusColor = status >= 400 ? chalk.red : status >= 300 ? chalk.yellow : chalk.green;
  
  console.log(
    `[${chalk.gray(timestamp)}] ${chalk.bold(method)} ${chalk.cyan(url)} - ${statusColor(status)} (${time}ms)`
  );
}

export function startServer(port: number, packages: DetectedPackage[]) {
  const app = new Hono();
  
  // Add the logger middleware to all routes
  app.use('*', logger);
  
  // Register routes
  app.get('/', (c) => c.text('ODocs Server Running'));
  
  app.get('/api/packages', (c) => {
    return c.json(packages);
  });
  
  app.get('/api/docs/:package/:version', async (c) => {
    const packageName = c.req.param('package');
    const version = c.req.param('version');
    
    try {
      const documentation = await fetchDocumentation(packageName, version);
      return c.json(documentation);
    } catch (error) {
      return c.json({ error: error instanceof Error ? error.message : String(error) }, 404);
    }
  });
  
  // Add MCP endpoint
  app.post('/mcp', async (c) => {
    try {
      const body = await c.req.json();
      const query = body.query || '';
      
      // Extract package mentions from the query
      const packageMentions = extractPackageMentions(query, packages);
      
      // If no packages mentioned or detected, return empty context
      if (packageMentions.length === 0) {
        return c.json({ 
          context: "No framework-specific documentation available for this query." 
        });
      }
      
      // Fetch documentation for mentioned packages
      const docsPromises = packageMentions.map(async pkg => {
        try {
          const doc = await fetchDocumentation(pkg.name, pkg.version);
          return `Documentation for ${pkg.name}@${pkg.version}:\n${doc.content}`;
        } catch (error) {
          return `Could not fetch documentation for ${pkg.name}@${pkg.version}`;
        }
      });
      
      const docContents = await Promise.all(docsPromises);
      const context = docContents.join('\n\n');
      
      return c.json({ context });
    } catch (error) {
      return c.json({ 
        error: error instanceof Error ? error.message : String(error) 
      }, 500);
    }
  });
  
  // Start the server
  serve({
    fetch: app.fetch,
    port
  });
}

// Helper function to extract package mentions from a query
function extractPackageMentions(query: string, availablePackages: DetectedPackage[]) {
  // Simple approach: check if package names appear in the query
  return availablePackages.filter(pkg => 
    query.toLowerCase().includes(pkg.name.toLowerCase())
  );
}
