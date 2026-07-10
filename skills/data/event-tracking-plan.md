---
description: Design a product analytics tracking plan with events, properties, and naming rules
permissions:
  reads: ["src/**", "app/**", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.py", "**/*.yml", "**/*.md"]
  writes: ["tracking_plan.yml", "tracking_plan.md", "docs/tracking_plan*"]
  commands: []
  network: false
  destructive: false
---

Design a product analytics tracking plan: which events to capture, which properties each carries,
and a naming convention the whole team can follow. Ground the plan in the actual product (routes,
components, existing analytics calls found in the code) and deliver it as a versionable YAML file
that doubles as the implementation checklist.

Steps:

1. **Audit what exists**
   - Search the codebase for analytics SDK usage: `track(`, `logEvent(`, `capture(`, `gtag(`,
     `analytics.`, `posthog.`, `mixpanel.`, `amplitude.`, `segment` — inventory every event name and
     property currently sent
   - Detect the analytics tool from dependencies and note its constraints (e.g., GA4 event name limits,
     Amplitude property types)
   - Map the product surface: routes/pages, key components and forms, API endpoints that represent
     user actions — this is the candidate event universe

2. **Anchor on business questions, not events**
   - Ask (or extract from `$ARGUMENTS`): the 3-5 questions the team must answer (activation, conversion,
     retention, feature adoption?) and the product's core value moment
   - Work backwards: every event in the plan must serve at least one question; kill anything that doesn't
     — over-tracking is the most common failure mode

3. **Define the naming convention**
   - Propose (or adopt the dominant existing pattern): `object_action` in snake_case, past tense
     (`signup_completed`, `report_exported`), no page names inside event names — page goes in a property
   - Property conventions: snake_case, ISO-8601 timestamps, booleans as `is_`/`has_` prefixes, enums
     documented with their allowed values, monetary values as integer minor units + `currency`
   - Define reserved/global properties sent on every event: `user_id`, `session_id`, `platform`,
     `app_version`, `page` — implemented once in a wrapper, not repeated per call site

4. **Design the event catalog**
   - For each event: name, trigger (exact user/system action, when precisely it fires — on click or
     on server confirmation?), properties (name, type, required?, allowed values, example), the business
     question it serves, and owner
   - Cover the funnel end-to-end (see `/data--funnel-analysis`): each funnel step must be one event,
     including the failure/abandon variants (`checkout_failed` with `error_code`)
   - Flag identity events explicitly: signup/login → `identify` call with user traits; never put
     PII (email, name) in event properties unless the team confirms their tool/policy allows it

5. **Deliver the plan and implementation map**
   - Write `tracking_plan.yml`: `conventions:` block, `global_properties:` block, then `events:` list
     with the full definition per event — valid YAML the team can lint and diff in code review
   - Include an implementation table mapping each event to the file/component where the call belongs,
     using the real paths found in step 1
   - Summarize in conversation: events added/renamed/deprecated vs current state, and the migration
     note for renamed events (send both names during a transition window; never repurpose an old name)

**Notes:**
- A tracking plan is a contract: changing an event's meaning silently is worse than adding a new event — version the file
- Fire events on confirmed outcomes (server success) rather than intent (button click) when the question is about conversion; track both only when drop-off between them matters
- Keep the v1 plan under ~25 events; teams that ship 100 events analyze none of them
- Downstream, this plan is the input for `/data--funnel-analysis` and `/data--cohort-analysis`; if events land in the warehouse, define their schema with `/data--data-contracts`
- This skill designs the plan; implementing the calls in code is a follow-up task using the implementation map

$ARGUMENTS
