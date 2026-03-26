---
description: Optimize AI/LLM prompts for better results - system prompts, user prompts, tool definitions
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Optimize prompts for AI/LLM interactions.

Steps:
1. Read the current prompt or understand the goal
2. Analyze and improve:

   **System prompts**
   - Clear role definition
   - Specific output format instructions
   - Constraints and guardrails
   - Examples (few-shot) for complex tasks
   - Edge case handling instructions

   **User prompts**
   - Clear task description
   - Context and constraints
   - Desired output format
   - Examples of good/bad output

   **Tool/Function definitions**
   - Clear, unambiguous descriptions
   - Proper parameter types and descriptions
   - Required vs optional parameters
   - Example invocations

3. Apply prompt engineering best practices:
   - Be specific over vague
   - Use structured output formats (JSON, XML)
   - Break complex tasks into steps
   - Use delimiters for input data
   - Specify what NOT to do for common mistakes
   - Use chain-of-thought for reasoning tasks
4. Test the improved prompt against edge cases
5. Provide A/B comparison of original vs improved

Prompt to optimize: $ARGUMENTS
