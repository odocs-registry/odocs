# ODocs: Open Documentation Registry for AI Code Generation

<div align="center">
  <img src="https://raw.githubusercontent.com/odocs-registry/odocs/main/assets/odocs-logo.png" alt="ODocs Logo" width="200" height="200" />
  <h3>Solving version blindness in AI-assisted development</h3>
  
![Status: Proof of Concept](https://img.shields.io/badge/Status-Proof%20of%20Concept-orange)
[![GitHub Stars](https://img.shields.io/github/stars/odocs-registry/odocs?style=social)](https://github.com/odocs-registry/odocs/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

## Welcome to ODocs! 👋

ODocs is an open-source documentation registry that works like Docker Hub, but for documentation. It enables AI models to detect your framework versions and access the right documentation, ensuring they generate compatible code on the first try.

## The Problem: Version Blindness in AI

**Every AI coding assistant – regardless of how recent the model is – suffers from "version blindness":**

```javascript
// AI suggests: npx create-next-app@latest
// When AI was trained: Next.js 14.0
// What you get today: Next.js 15.2
// Result: AI generates incompatible code
```

This happens across all programming ecosystems:
- **JavaScript/TypeScript**: React hooks that worked in 17.0 but throw errors in 18.2
- **Python**: Django patterns that were best practice in 4.2 but deprecated in 5.0
- **Java**: Spring Boot configurations that are entirely restructured between versions
- **Ruby**: AI generates Rails 6 code while your project uses Rails 7
- **.NET**: AI provides .NET 6 examples when you're building with .NET 8

The consequences are frustrating and time-consuming:
- Wasted debugging time fixing version incompatibilities
- Security vulnerabilities from outdated patterns
- Missing optimizations introduced in newer versions
- Incorrect error handling from mismatched API responses

## The Solution: ODocs

ODocs solves this problem through an open-source approach:

1. **Documentation Registry**: A central, open-source registry where framework maintainers across programming languages publish LLM-optimized documentation with specific version tags (e.g., `nextjs:latest`, `nextjs:15.2`, `django:5.0`).

2. **Framework Detection**: Tools that automatically scan your project files to identify which frameworks and versions you're using (package.json, requirements.txt, pom.xml, gemfile, etc.)

3. **Vector Database**: Local embedding of documentation for efficient retrieval, reducing token usage and enabling precise search capabilities.

4. **AI Integration Layer**: Open APIs that connect with any AI coding assistant via:
   - Model Context Protocol (MCP) integration
   - Tool-based integration for models like ChatGPT and Claude
   - Direct API integration for IDE providers

## How ODocs Works

When you use IDE extensions or run `odocs serve` in your project:

```bash
# Start the ODocs server (auto-detects frameworks)
$ odocs serve

→ Scanning package.json...
→ Detected frameworks:
  - nextjs:15.2.1
  - react:18.2.0
  - tailwindcss:3.3.0

→ Pulling documentation for detected frameworks...
→ Documentation pulled successfully

→ Embedding documentations for detected frameworks...
→ Documentation embedded successfully

→ API server running at http://localhost:2803/api
→ MCP server running at http://localhost:2803/mcp
```

The system:

1. **Framework Detection**: Automatically scans your project files to identify which frameworks and versions you're using.

2. **Documentation Serving**: Pulls the relevant documentation from the registry and embeds it in a local vector database for efficient retrieval.

3. **AI Integration**: Your AI assistant (ChatGPT, Claude, GitHub Copilot, etc.) connects to ODocs through MCP, API, or IDE plugins.

4. **Contextual Code Generation**: When you ask your AI assistant to generate code, it uses semantic search to find precisely relevant documentation, resulting in code that works with your specific version on the first try.

## Project Status

🧪 **Initial Proof of Concept Available!** 🧪

We've completed an initial working prototype of ODocs! While limited in scope, this proof of concept successfully demonstrates the core value proposition of solving version blindness in AI code generation.

Our current implementation focuses specifically on **Hono 4.7.5**, which already offers LLM-optimized documentation ready for AI consumption. This targeted prototype:

- Uses a documentation repository with version-specific Hono documentation
- Includes a CLI tool that successfully detects Hono in your projects
- Provides a local API server that connects with AI assistants
- Demonstrates how version-specific documentation improves code generation

We've also created a [test repository](https://github.com/odocs-registry/odocs/tree/main/__test__) with sample code that you can run to see the prototype in action.

## Integration Options

ODocs integrates with your workflow through multiple methods, sorted by ease of adoption:

1. **CLI Tools**:
   - Zero-configuration command: `odocs serve` 
   - Automatically detects framework versions from project files
   - Starts a local server with API and MCP endpoints
   - Your AI assistant connects to these endpoints for precise documentation retrieval

2. **VS Code Extension** (Coming Soon):
   - One-click installation from VS Code Marketplace
   - Automatic detection of frameworks from project files
   - Runs a local MCP/API server in the background
   - Seamlessly connects to AI assistants through VS Code
   - Privacy-focused: your code never leaves your machine

3. **GitHub Copilot Integration** (Coming Soon):
   - Companion functionality for GitHub Copilot users
   - Enhances Copilot suggestions with framework-specific context
   - Injects framework version information before code completion
   - Works automatically in the background

## Development Roadmap

### Phase 1: Foundation (Current)
- Defining the documentation registry protocols
- Standardizing LLM-optimized documentation formats
- Building the framework detection tools
- Implementing vector embedding for efficient documentation retrieval
- Creating AI integration layers that leverage semantic search

### Phase 2: Ecosystem
- Additional IDE plugins (JetBrains, Cursor)
- Expanded framework support through community contributions
- Package version registry implementation

### Phase 3: Advanced Features
- Private documentation repositories
- Team collaboration tools
- Custom documentation integration
- Advanced analytics for framework usage
- Breaking changes detection between versions

## How You Can Get Involved

ODocs is an open-source project that thrives on community contributions. Get involved by:

### For Framework Maintainers
We're especially looking for framework maintainers to help us expand beyond our initial Hono implementation. As a maintainer, you can:
- Contribute LLM-optimized documentation for your framework to our registry
- Help define standards for structuring documentation that works well with AI assistants
- Provide insights on version compatibility challenges specific to your ecosystem
- Integrate documentation publishing into your release workflows

### For Developers
- Test our Hono prototype and provide feedback
- Contribute to the core ODocs infrastructure
- Help build IDE extensions and integrations
- Share your experiences with version mismatch issues

Your involvement is crucial to expanding ODocs to support all major frameworks across programming languages!

## Community

- [Blog](https://odocs.dev/blog)
- [Discord](https://discord.gg/xQM2bSvZ)
- [Website](https://odocs.dev)

## Try Our Proof of Concept!

Check out our GitHub repository to test our Hono 4.7.5 implementation and see the difference version-aware AI code generation makes, even with this limited example.

This initial prototype sets the stage for our broader vision of supporting all major frameworks across programming languages. We're actively expanding beyond this first implementation and welcome contributors to help shape the future of version-aware AI coding.

---

*ODocs: Bridging the version gap in AI code generation.*

*Special thanks to Docker for inspiring our registry model approach, and to the Hono team for their LLM-optimized documentation that made our first prototype possible.*