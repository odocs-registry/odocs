# ODocs: Open Documentation Registry for AI Code Generation

<div align="center">
  <img src="https://raw.githubusercontent.com/odocs-registry/odocs/main/assets/odocs-logo.png" alt="ODocs Logo" width="200" height="200" />
  <h3>Solving version blindness in AI-assisted development</h3>
  
![Under Construction](https://img.shields.io/badge/Status-Under%20Construction-yellow)
[![GitHub Stars](https://img.shields.io/github/stars/odocs-registry/odocs?style=social)](https://github.com/odocs-registry/odocs/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

## Welcome to ODocs! 👋

ODocs is an open-source documentation registry initiative that helps AI models generate code compatible with your specific framework versions, solving the "version blindness" problem in AI-assisted development.

## The Problem: Version Blindness in AI

**Every AI coding assistant – even those released yesterday – suffers from "version blindness":**

```javascript
// AI suggests: npx create-next-app@latest
// When AI was trained: Next.js 14.0
// What you get today: Next.js 15.2
// Result: AI generates incompatible code
```

This happens across all programming ecosystems:
- **React hooks** that worked in 17.0 but throw errors in 18.2
- **Django patterns** that were best practice in 4.2 but deprecated in 5.0
- **Spring Boot** configurations that are entirely restructured between versions

## The Solution: ODocs

ODocs provides:

1. **Documentation Registry**: A central repository where framework maintainers publish version-specific documentation (e.g., `nextjs:latest`, `nextjs:15.2`, `django:5.0`)

2. **Framework Detection**: Tools that scan your project files to identify which frameworks and versions you're using

3. **Vector Database**: Local embedding of documentations for efficient retrieval, reducing token usage

4. **AI Integration**: Connectors that feed the right documentation to your AI assistant through various methods

## How It Will Work

ODocs will:
- Automatically detect which frameworks and versions your project uses
- Pull the right documentation from a versioned registry
- Use vector embeddings to efficiently retrieve relevant documentation
- Feed this context to your AI coding assistant
- Result: Framework-specific code that works on the first try!

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

→ Embedding documentations...
→ Documentation embedded successfully

→ API server running at http://localhost:2803/api
→ MCP server running at http://localhost:2803/mcp
```

## Project Status

🚧 **Under Construction** 🚧

This project is currently in early development. We're validating the concept and building the foundation for the documentation registry.

Current focus:
- Defining the documentation registry protocols
- Standardizing LLM-optimized documentation formats
- Building the framework detection tools
- Implementing vector embedding for efficient documentation retrieval
- Creating AI integration layers that leverage semantic search

## Roadmap

### Phase 1: Foundation (Current)
- Core documentation registry
- Standardized documentation format
- CLI tools for documentation serving
- Framework detection for major ecosystems

### Phase 2: Ecosystem
- VS Code extension
- GitHub Copilot integration
- Additional IDE plugins (JetBrains, Cursor)
- Expanded framework support

### Phase 3: Advanced Features
- Private documentation repositories
- Team collaboration tools
- Custom documentation integration
- Advanced analytics for framework usage

## Get Involved

If you're interested in this project:
- ⭐ Star this repository to show your support
- 📣 Share your experiences with version mismatches in AI coding
- 🧠 Join the discussion in the [Issues](https://github.com/odocs-registry/odocs/issues) section


## Community

- [Blog](https://odocs.dev/blog)
- [Discord](https://discord.gg/xQM2bSvZ)
- [Website](https://odocs.dev)


## Stay Tuned

We'll be sharing more details about our progress and how you can contribute soon!

---

*ODocs: The right documentation for the right version, every time.*
