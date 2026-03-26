---
description: Fix accessibility issues - add ARIA, keyboard nav, focus management, semantic HTML
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: []
  network: false
  destructive: false
---

Fix accessibility issues in the specified component or page.

Steps:
1. Read the code and identify a11y issues
2. Fix common problems:

   **Semantic HTML**
   - Replace div/span with button, nav, main, article, section, aside
   - Use heading hierarchy (h1 → h2 → h3, no skipping)
   - Use lists for list content
   - Use table for tabular data (not div grids)

   **Keyboard navigation**
   - Add tabindex where needed (0 for focusable, -1 for programmatic focus)
   - Implement arrow key navigation for custom widgets
   - Add Escape to close modals/dropdowns
   - Manage focus on route changes (SPA)
   - Trap focus in modals

   **ARIA attributes**
   - aria-label for icon-only buttons
   - aria-expanded for collapsible content
   - aria-describedby for form help text
   - aria-live for dynamic content updates
   - role for custom widgets (dialog, tablist, menu)
   - aria-hidden="true" for decorative elements

   **Forms**
   - Every input has a visible label (not just placeholder)
   - Error messages linked with aria-describedby
   - Required fields marked with aria-required
   - Fieldset/legend for radio/checkbox groups

3. Apply fixes while preserving visual design

Target: $ARGUMENTS
