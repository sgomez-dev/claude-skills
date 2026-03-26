---
description: Generate a complete React/Vue/Svelte component with types, tests, and stories
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Generate a complete UI component.

Steps:
1. Detect the framework (React, Vue, Svelte, Angular) and conventions from the project
2. Generate:

   **Component file**
   - TypeScript interface for props
   - Component implementation with proper patterns
   - React: Functional component with hooks
   - Vue: `<script setup>` with composition API
   - Proper event handling
   - Accessibility attributes (aria-*, role)
   - Responsive design considerations

   **Styles**
   - Follow project convention (CSS Modules, Tailwind, styled-components, etc.)
   - Include responsive breakpoints
   - Dark mode support if project uses it

   **Tests**
   - Render test
   - Props test
   - Event handler test
   - Accessibility test
   - Edge cases (empty data, loading, error states)

   **Story (if Storybook exists)**
   - Default story
   - Variant stories
   - Interactive controls

3. Place in correct directory following project structure
4. Export from barrel file if one exists

Component: $ARGUMENTS
