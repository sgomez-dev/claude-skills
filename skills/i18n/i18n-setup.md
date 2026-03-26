---
description: Set up internationalization (i18n) with translation extraction and management
permissions:
  reads: ["**/*"]
  writes: ["**/*", "locales/**"]
  commands: []
  network: false
  destructive: false
---

Set up internationalization for the project.

Steps:
1. Detect framework and choose i18n library:
   - React: react-intl, i18next + react-i18next
   - Vue: vue-i18n
   - Next.js: next-intl or built-in i18n routing
   - Backend: i18next, gettext
2. Set up the i18n infrastructure:
   - Configure the i18n library
   - Set up locale detection (URL, cookie, Accept-Language header)
   - Create translation file structure:
     ```
     locales/
     ├── en/
     │   ├── common.json
     │   └── auth.json
     └── es/
         ├── common.json
         └── auth.json
     ```
3. Extract hardcoded strings from the codebase:
   - Find all user-facing strings in components
   - Replace with translation keys: `"Hello"` → `t('common.hello')`
   - Generate initial translation files
4. Handle:
   - Pluralization rules per locale
   - Date/time/number formatting (Intl API)
   - RTL layout support
   - Dynamic content (interpolation)
   - Lazy loading translations per route
5. Set up tooling:
   - Missing translation detection
   - Translation key extraction script

Locales needed: $ARGUMENTS
