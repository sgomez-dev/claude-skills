# Skills Expansion to 325 — Design Spec

**Date:** 2026-07-10
**Goal:** Grow the collection from 156 → 325 skills (+169), adding 13 new categories anchored by a Sales & Growth suite (lead generation), plus documentation realignment.

## Motivation

- The repo has drifted: README claims 102 skills, CLAUDE.md claims 135, reality is 156. Categories `debugging`, `networking`, `marketing`, `meta` (partial), `web` (partial) exist but are undocumented or partially documented.
- The collection is dev-only. Businesses run on sales, product, data, finance, and operations too — skills there have outsized value and no equivalent in public registries.

## Conventions (every new skill)

```markdown
---
description: One line, under 80 chars, shown in command palette
permissions:
  reads: []          # glob patterns the skill reads
  writes: []         # glob patterns the skill writes
  commands: []       # shell commands it may run
  network: true|false
  destructive: false # true requires explicit user confirmation steps
---

Intro paragraph: what the skill does.

Steps:
1. Numbered, actionable steps
2. Detect project/business context before acting
3. Present results; confirm before writing files

**Notes:** edge cases, quality bars.

$ARGUMENTS
```

- Language: **English** (matches ~150/156 existing skills). Output language adapts to the user's market/lead.
- Context-aware: never hardcode a stack; detect from the project or ask.
- Web-search skills declare `network: true` and use only public/free sources (no paid APIs like Apollo/ZoomInfo).
- `legal/` skills include a "not legal advice — review with counsel" disclaimer.
- Focused: one task per skill.

## New Categories & Skills (169 total)

### sales/ — Sales & Growth (21) ⭐ anchor category
| Skill | One-liner |
|---|---|
| icp-builder | Build an Ideal Customer Profile from customers, product, or website; outputs search queries for lead-finder |
| lead-finder ⭐ | Find and score leads matching an ICP via web search, or enrich/prioritize an existing CSV list |
| lead-enrichment | Enrich a lead list with public data: tech stack, size, funding, hiring, news |
| intent-radar | Detect buying signals for target accounts: hiring spikes, funding, tech changes, expansion |
| territory-planner | Segment a market into territories/tiers with account distribution and coverage plan |
| lead-qualifier | Score and qualify leads with BANT/MEDDIC/CHAMP; outputs tiers + next actions |
| account-plan | Strategic account plan: org map, pains, initiatives, entry points, plays |
| discovery-prep | Pre-call research brief: company, attendees, hypotheses, discovery questions |
| competitor-intel | Competitive intelligence report: positioning, pricing, feature matrix, gaps |
| sales-battlecard | Battlecards vs a specific competitor: traps, counters, proof points, landmines |
| cold-outreach | Multi-touch cold sequences (email + LinkedIn) personalized per lead/segment |
| email-assistant | Draft/reply sales emails matched to deal stage, tone, and intent |
| objection-handler | Objection-handling playbook: reframes, proof points, next steps per objection |
| follow-up-sequencer | Follow-up cadences per deal stage with timing and exit triggers |
| social-selling | LinkedIn presence audit + social selling content plan for a niche |
| proposal-generator | Commercial proposal/SOW from discovery notes: scope, timeline, pricing options |
| pricing-strategy | Pricing & packaging strategy with tiers, anchoring, and willingness-to-pay logic |
| rfp-responder | Draft RFP/RFI responses from a requirements matrix with compliance tracking |
| case-study-generator | Customer case study from project notes and metrics (problem→solution→results) |
| deal-risk-analyzer | Analyze deal/pipeline notes for risk signals; flag stalls and single-threading |
| call-notes-to-crm | Convert messy call notes into structured CRM fields, tasks, and follow-ups |

### product/ — Product Management (12)
prd, feature-spec, user-stories, rice-prioritization, roadmap, user-research-synthesis, pr-faq, okr-builder, ab-test-design, competitive-teardown, launch-plan, user-interview-guide

### data/ — Data & Analytics (12)
analytics-sql, dbt-model, event-tracking-plan, dashboard-spec, data-quality-audit, metric-definition, etl-pipeline, warehouse-schema, cohort-analysis, funnel-analysis, data-contracts, csv-wrangler

### finance/ — Finance & SaaS Metrics (10)
saas-metrics, pricing-model, financial-model, unit-economics, burn-runway, fundraising-deck, invoice-generator, budget-planner, revenue-forecast, cap-table

### legal/ — Legal & Compliance (8) — all with "not legal advice" disclaimer
privacy-policy, terms-of-service, gdpr-audit, contract-review, oss-license-check, dpa-gen, cookie-policy, sla-gen

### fullstack/ — Full-Stack Features (12)
saas-starter, auth-flow, payments-integration, realtime-feature, file-upload, background-jobs, notification-system, feature-flags, admin-panel, search-feature, multi-tenancy, onboarding-flow

### mobile/ — Mobile Development (10)
react-native-scaffold, flutter-scaffold, push-notifications, deep-linking, offline-sync, app-store-listing, mobile-performance, mobile-release, biometric-auth, mobile-navigation

### cloud/ — Cloud Architecture (10)
aws-architect, gcp-architect, azure-architect, serverless-api, cloud-cost-audit, iam-least-privilege, cloud-migration, disaster-recovery, autoscaling-strategy, infra-diagram

### observability/ — Observability & SRE (8)
logging-strategy, metrics-setup, tracing-setup, alerting-rules, slo-sli, incident-response, runbook-gen, postmortem

### content/ — Content & Copywriting (8)
blog-post, seo-content, newsletter, social-posts, video-script, technical-writing, content-calendar, docs-site

### ecommerce/ — E-commerce (8)
store-scaffold, checkout-flow, product-catalog, inventory-management, shipping-setup, abandoned-cart, product-descriptions, payment-methods

### automation/ — Automation & Integration (8)
web-scraper, browser-automation, workflow-automation, email-automation, report-automation, pdf-processing, spreadsheet-automation, scheduled-tasks

### ml/ — Machine Learning (8)
dataset-prep, feature-engineering, model-training, model-evaluation, mlops-pipeline, time-series-forecast, recommender-system, model-deployment

### ai/ — expand 3 → 18 (+15)
agent-builder, mcp-server, rag-eval, llm-eval, structured-output, guardrails, semantic-cache, llm-observability, chatbot-scaffold, fine-tuning, tool-calling, multi-agent, voice-agent, llm-cost-optimizer, context-engineering

### Existing category additions (+19)
- testing (+4): load-testing, contract-testing, mutation-testing, visual-regression
- devops (+4): ansible, helm-chart, gitops, secrets-management
- security (+3): threat-model, rate-limiting, pentest-prep
- git (+2): git-hooks, monorepo-git
- docs (+2): onboarding-guide, api-changelog
- performance (+2): web-vitals, db-performance
- utils (+2): json-tools, benchmark

**Total: 156 + 169 = 325 skills, 32 categories.**

## Supporting Work

- **Pipelines:** `pipelines/sales-outbound.yaml` (icp-builder → lead-finder → lead-qualifier → cold-outreach) and `pipelines/llm-app.yaml` (chatbot-scaffold → embeddings → rag-eval → guardrails).
- **Tests:** `.test.yaml` companions for anchor skills `sales/lead-finder` and `ai/agent-builder`.
- **marketplace.json:** add bundles for all 13 new categories + missing existing ones (debugging, networking, marketing, meta); fix counts in descriptions.
- **README.md:** fix count (102 → 325) and badges, add category tables for all new + previously undocumented categories, update project structure.
- **CLAUDE.md:** fix count (135 → 325) and structure tree.
- **CONTRIBUTING.md:** add new categories to the category table.
- Installers discover categories dynamically — no changes needed.

## Execution Plan

1. Write exemplar skill (`sales/lead-finder.md`) by hand — sets the quality bar.
2. Launch parallel subagents, one per category batch, each following the exemplar + conventions.
3. Review pass: frontmatter validity, permission manifests match instructions, description length, `$ARGUMENTS` present.
4. Docs alignment (README, CLAUDE.md, CONTRIBUTING, marketplace.json), pipelines, test files.
5. Run `scripts/test-runner.sh` as final validation.
