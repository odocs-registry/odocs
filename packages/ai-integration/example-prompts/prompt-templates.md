# ODocs AI Prompting Templates

## Basic Template

When working with your AI assistant, provide context about your ODocs server:

```
I am using ODocs to provide version-specific documentation for my project.
ODocs has detected the following packages:
- hono: 4.7.5

Please use these versions when generating code examples.
```

## Function Calling Template

For AI assistants that support function calling:

```
I'm working with Hono in my project. Can you show me how to create middleware?

Make sure to use the ODocs function to get version-specific documentation.
```

## Tool Usage Example

```
Please use the ODocs tool to get documentation for Hono version 4.7.5,
then show me the best way to create middleware in this version.
```
