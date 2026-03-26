---
description: Audit UI components for accessibility (WCAG 2.1 compliance)
permissions:
  reads: ["**/*"]
  writes: []
  commands: []
  network: false
  destructive: false
---

Perform an accessibility audit against WCAG 2.1 guidelines.

Steps:
1. Read the specified component/page code
2. Check WCAG 2.1 compliance:

   **Perceivable**
   - Images have meaningful alt text (not "image" or "photo")
   - Color is not the only way to convey information
   - Contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
   - Text can be resized to 200% without loss
   - Media has captions/transcripts

   **Operable**
   - All interactive elements reachable by keyboard
   - Visible focus indicators
   - No keyboard traps
   - Skip navigation link exists
   - Touch targets ≥ 44x44px
   - No content that flashes > 3 times/second

   **Understandable**
   - Language attribute set on HTML
   - Form labels associated with inputs
   - Error messages are descriptive and suggest fixes
   - Consistent navigation patterns

   **Robust**
   - Valid, semantic HTML
   - ARIA used correctly (not overused)
   - Name, role, value exposed to assistive tech
   - Status messages use aria-live

3. For each issue: severity, WCAG criterion, code location, fix with code

Target: $ARGUMENTS
