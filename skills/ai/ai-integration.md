---
description: Integrate AI/LLM APIs (Claude, OpenAI) into the application with best practices
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: true
  destructive: false
---

Integrate an AI/LLM API into the application.

Steps:
1. Determine the AI provider and use case:
   - Claude (Anthropic) / OpenAI / local models
   - Chat, completion, embedding, image generation, etc.
2. Generate integration code with:

   **Client setup**
   - API key from environment variables (never hardcoded)
   - Proper client initialization
   - Timeout configuration
   - Retry logic with exponential backoff

   **Request handling**
   - Streaming support for long responses
   - Token counting for cost management
   - System prompt management
   - Conversation history management
   - Tool/function calling if needed

   **Error handling**
   - Rate limit handling (429) with retry
   - Token limit exceeded
   - API errors with fallback
   - Network timeouts

   **Best practices**
   - Response caching for identical queries
   - Token usage logging for cost tracking
   - Content filtering/moderation
   - User feedback collection
   - Prompt versioning

3. Generate types for requests and responses
4. Add tests with mocked API responses

Use case: $ARGUMENTS
