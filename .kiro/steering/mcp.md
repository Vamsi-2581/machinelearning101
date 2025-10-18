---
inclusion: always
---

# External Tool Usage Guidelines

## Context7 MCP - Documentation Lookup

When encountering unfamiliar packages, libraries, or dependencies:

1. **First**: Use Context7 MCP tools to gather documentation

   - Resolve library ID: `mcp_Context7_resolve_library_id`
   - Fetch docs: `mcp_Context7_get_library_docs`
   - Focus on: API usage, configuration, integration patterns

2. **Priority libraries for this project**:
   - Nuxt 4, Vue 3, Pinia state management
   - Visualization: Chart.js, D3.js, Plotly.js
   - TypeScript types and patterns

## Playwright MCP - Browser Automation

Use for:

- Accessing documentation sites not available via Context7
- Testing deployed application behavior
- Verifying responsive design and accessibility
- Debugging client-side issues in production builds

## When to Use Which Tool

- **Context7**: API documentation, usage examples, type definitions
- **Playwright**: Live site testing, visual verification, interactive debugging
- **Both**: When Context7 provides API docs but you need to verify behavior in browser
