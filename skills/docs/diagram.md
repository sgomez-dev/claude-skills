---
description: Generate architecture diagrams using Mermaid from code analysis
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Generate Mermaid diagrams by analyzing the codebase.

Steps:
1. Read the specified code/module/directory
2. Determine the best diagram type:
   - **Flowchart**: For process flows, algorithms
   - **Sequence diagram**: For API calls, service interactions
   - **Class diagram**: For OOP class hierarchies
   - **ER diagram**: For database schemas
   - **State diagram**: For state machines, status flows
   - **C4 diagram**: For system architecture
3. Analyze code to extract:
   - Module dependencies and relationships
   - Function call chains
   - Data flow between components
   - API request/response flows
4. Generate clean Mermaid syntax with:
   - Clear labels on all nodes and edges
   - Logical grouping with subgraphs
   - Consistent styling
5. Output the diagram in a ```mermaid code block
6. Also explain the diagram in plain text for context

Target: $ARGUMENTS
