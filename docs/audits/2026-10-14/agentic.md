# Agent-readiness audit: cloudwise.co.ke and /ai-training (checked 2026-10-14)

## Scores
- Lighthouse Agentic Browsing: unavailable. PSI returned HTTP 429 (daily quota) for mobile and desktop. No X/N reported.
- Agent-UX heuristic: 100/100 (status complete). 895 a11y nodes, 41 interactive, 0 unnamed interactive, 0 div-onclick widgets, 16 landmarks. Separate from Lighthouse.
- Overall readiness (judgement): 78/100.

## Access policy (robots.txt, one group "*")
- Training (GPTBot, ClaudeBot): allowed, no named group, no Content-Signal.
- Search (OAI-SearchBot, Claude-SearchBot): allowed.
- User-triggered (ChatGPT-User, Claude-User, Perplexity-User): allowed. Vendor docs: Claude-User honours robots.txt; ChatGPT-User may not; Perplexity-User generally ignores it.
- Disallowed for all: /checkout/, /studio, /api/. Sitemap declared.

## Findings
P0: none. Page is server-rendered (1154 words without JS), robots.txt reachable, real 404s.

P1
- No Content-Signal line. File: src/app/robots.js (Next MetadataRoute cannot emit it; needs a route handler). Preference only, draft, Google does not act on it (checked 2026-09-23).
- No llms.txt (404). Opportunity; Lighthouse drops the audit if absent, a valid file adds a counted pass. Add src/app/llms.txt/route.js.
- AI training dates/prices are readable: Course JSON-LD has price 13500 KES, 3 CourseInstances (2026-11-07, 2026-12-05, 2027-01-02), and the visible "Next cohorts" list shows Saturday pairs. Register action is a real link to /ai-training/register (2 links, status 200). Agent can complete discovery. Gap: page is force-dynamic, so output is not cached and dates change by request.

P2
- No Markdown delivery (no Accept negotiation, no .md, no rel=alternate). Opportunity, not a defect. Would need Vary: Accept.
- WebMCP: 0 registerTool sites; only form on /ai-training is the chat footer form (class _chatFooterForm), unannotated. The register form is in src/components/training/RegistrationForm.js. WebMCP is a W3C Community Group draft (checked 2026-09-23). Optional.
- The register page form was not rendered or tested by an agent in this run.

P3
- /.well-known: api-catalog, oauth-*, agent-card.json, ai-catalog.json (ARD draft), ucp all 404. Not applicable, nothing to publish unless Cloudwise runs agent services.
- No named AI-bot groups; fine unless policy differs by purpose.

## Standards notes (check date 2026-09-23 from vendor matrix)
WebMCP, Content-Signal, ai-catalog.json and Web Bot Auth are drafts or proposals. No ranking, citation or traffic effect is promised.
