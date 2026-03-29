# DESIGN_HANDOFF.md

## CRM Template V1 Design Brief

This document is the design handoff brief for the Small Business Client Tracker system.

It is intended for:

- design teams
- frontend engineers
- product collaborators
- AI implementation agents

The goal of this document is to define the V1 product surface, design priorities, reusable system requirements, and interaction expectations clearly enough that design work can begin without re-scoping the product.

## 1. Product Context

### Product Name

Northstar CRM

### Product Type

Small Business Client Tracker CRM template

### Platform Priority

- Mobile is the primary product experience.
- Web is the secondary operational dashboard.
- The system should be reusable for future white-label or multi-tenant deployments.

### Primary Users

- small business owners
- operators
- account managers
- client success leads

### Primary Jobs To Be Done

- track client records quickly
- log interactions with minimal friction
- review the relationship timeline
- identify follow-ups that need action
- monitor overall pipeline health

## 2. Design Objective

Create a premium SaaS-grade interface that feels:

- fast
- calm
- intelligent
- modern
- trustworthy
- professional

The visual and interaction quality should compete with products such as:

- Linear
- Notion
- Stripe Dashboard
- Vercel Dashboard
- Attio CRM

The final result must feel like a production product, not a generic starter dashboard.

## 3. Core UX Principles

- mobile-first layout decisions
- minimal cognitive load
- clear hierarchy
- timeline-centric workflows
- fast navigation
- strong typography rhythm
- subtle motion feedback
- dense information without visual clutter

## 4. V1 Product Scope

This section defines the product surface that design should cover for the first handoff.

### In Scope: Mobile

- Client List
- Client Detail
- Activity Timeline
- Add Client
- Edit Client
- Tag Manager
- Search and Filters
- Follow-up Reminders

### In Scope: Web

- Pipeline Overview
- Activity Panel
- Follow-up Alerts Panel
- Team Insights Panel
- Conversion Metrics Panel

### Out of Scope for This Handoff

- role-based permissions design
- onboarding flows
- billing or account settings
- notification center beyond in-context reminders
- advanced reporting customization
- multi-tenant admin interfaces

If design work explores these areas, it should be clearly labeled as future-facing and not block V1 delivery.

## 5. Signature Experience

The activity timeline is the signature experience of the CRM.

It must feel premium, highly readable, and fast to scan. It should support:

- interaction icons
- timestamps
- author attribution
- notes preview
- expandable entries
- filtering by interaction type
- excellent scroll performance
- obvious hierarchy between recent and older events

If design time is limited, prioritize timeline quality over lower-value decorative work.

## 6. Primary User Flows

Designers should use these as canonical V1 flows.

### Flow A: Find a Client and Review Context

1. Open client list
2. Search or filter by status/tag/name
3. Open a client record
4. Review profile summary and latest activity
5. Scan timeline for recent context

### Flow B: Log a New Interaction

1. Open client detail
2. Trigger add activity action
3. Select interaction type
4. Enter notes
5. Save
6. Confirm new activity appears in timeline immediately

### Flow C: Update Client Status

1. Open client detail or dashboard card
2. Change status
3. Save
4. Confirm updated status in all relevant views

### Flow D: Add or Remove Tags

1. Open client detail or tag controls
2. Add or remove tag
3. Confirm tag chip updates immediately
4. Verify filters reflect the change

### Flow E: Review Follow-Ups Due

1. Open dashboard or reminders view
2. See prioritized follow-up items
3. Open affected client
4. Log contact or reschedule next action

## 7. Screen Requirements

These are the minimum design expectations for each core screen.

### Mobile: Client List

Must include:

- searchable client list
- status visibility
- tag visibility
- last-contact or next-action context
- entry point to add client
- empty state

Must optimize for:

- one-handed scanning
- fast filtering
- clear row/card hierarchy

### Mobile: Client Detail

Must include:

- client identity and contact summary
- status control
- tag management entry
- quick action entry points
- timeline preview or embedded timeline

Must optimize for:

- low-friction updates
- readable grouped information
- a strong primary action hierarchy

### Mobile: Activity Timeline

Must include:

- chronological entries
- interaction type indicators
- note preview
- timestamp
- expansion behavior
- filter controls

### Mobile: Add and Edit Client

Must include:

- primary fields
- status selection
- contact fields
- notes support
- validation states
- success feedback

### Mobile: Tag Manager

Must include:

- list of tags
- create/edit/delete states
- color usage rules
- assignment-friendly presentation

### Mobile: Search and Filters

Must include:

- keyword search
- status filters
- tag filters
- clear reset behavior

### Mobile: Follow-Up Reminders

Must include:

- prioritized due items
- urgency cue
- action to open client
- action to resolve/log follow-up

### Web: Pipeline Overview

Must include:

- top-level metrics
- status distribution
- recent client visibility
- fast drill-in paths

### Web: Activity Panel

Must include:

- recent interactions
- filtering
- density suitable for power users
- direct links into editing or detail views

### Web: Follow-Up Alerts Panel

Must include:

- overdue items
- due today items
- next-up items
- prioritization cues

### Web: Team Insights Panel

Must include:

- operational summaries
- light analytical framing
- room for future expansion without redesign

### Web: Conversion Metrics Panel

Must include:

- lead to active visibility
- active to completed visibility
- simple trend or snapshot framing

## 8. Required States

Every core screen should define the following when applicable:

- default populated state
- loading state
- empty state
- error state
- success confirmation state

### Required Empty States

- client list empty
- search empty
- no activity
- no follow-ups due
- no analytics data

Each empty state should include:

- illustration or visual placeholder area
- primary action button
- secondary explanation text

### Loading States

Use skeletons where layout continuity matters:

- client cards
- dashboard metrics
- timeline entries
- detail sections

### Error States

Error states should avoid generic dead ends. They should provide:

- clear explanation
- retry action
- preserved context where possible

## 9. Design System Requirements

Design must define a reusable design system for this product rather than a page-specific visual pass.

### Required Design Tokens

- color palette
- typography scale
- spacing scale
- border radius system
- elevation and shadow system
- icon style direction
- motion guidance
- status semantics

### Required Modes

- light mode
- dark mode

### Brand Flexibility

The design system must support:

- logo replacement
- color overrides
- client rebranding
- reuse across multiple companies

This must work without layout rewrites.

## 10. Color Guidance

Use a restrained, semantic palette.

### Required Semantic Status Colors

- Lead
- Active
- Customer
- Inactive
- Completed
- Follow-up Due
- Priority Tag

### Avoid

- oversaturated palettes
- harsh contrast combinations
- decorative rainbow tag systems
- unnecessary color dependence for meaning

### Prefer

- soft neutrals
- layered surfaces
- semantic accent colors
- strong contrast in key decision areas only

## 11. Typography Guidance

Typography should feel similar to:

- Inter
- Geist
- SF Pro spacing behavior

### Required Hierarchy Levels

- dashboard heading
- section heading
- card heading
- body text
- caption text
- micro-label text

Typography should be a major part of the product's quality signal. The interface should not rely on heavy borders or excessive color to create structure.

## 12. Motion Guidance

Use motion sparingly and intentionally.

### Allowed

- card hover lift
- timeline expand animation
- modal transitions
- button press feedback
- skeleton loading shimmer

### Avoid

- heavy entrance animations
- delayed page transitions
- excessive bounce effects
- motion that blocks task completion

## 13. Layout and Navigation

### Spacing Baseline

- Mobile: 4pt scale
- Web: 8pt scale

### Web Max Content Width

1280px

### Navigation Pattern: Mobile

- bottom navigation
- floating action button where appropriate
- gesture-safe margins

### Navigation Pattern: Web

- left sidebar navigation
- top analytics header
- context panels

## 14. Component Inventory

The following components should be designed as reusable patterns, not one-off page elements:

- Primary Button
- Secondary Button
- Icon Button
- Card Container
- Client Card
- Activity Timeline Item
- Tag Chip
- Status Badge
- Modal
- Drawer
- Bottom Sheet
- Floating Action Button
- Search Input
- Filter Panel
- Dropdown Select
- Avatar
- Empty State
- Loading Skeleton
- Toast Notification
- Confirmation Dialog

For each component, design should define:

- default appearance
- hover or pressed state where relevant
- disabled state
- loading state where relevant
- dark mode behavior
- responsive behavior if it changes by platform

## 15. Accessibility Requirements

- contrast ratio compliant
- minimum 44px touch targets
- keyboard navigation support on web
- screen reader friendly labels
- dark mode compatibility
- status meaning not conveyed by color alone

## 16. Engineering Context

The current product already includes working web and mobile shells with seeded CRM-style data and CRUD-oriented structures.

Design should treat the current implementation as a functional prototype, not as the visual baseline.

Areas already represented in code:

- client list and dashboard cards
- activity feed
- record editing and record management
- tags and status handling
- mobile CRM shell components

Design is free to substantially improve layout, information hierarchy, and interaction patterns as long as the V1 scope remains intact.

## 17. Handoff Deliverables

The design team should deliver:

- sitemap or screen map for V1
- core user flow diagrams
- low-fidelity wireframes for all in-scope screens
- high-fidelity designs for primary flows
- design tokens
- component library specifications
- responsive guidance for mobile and web
- light and dark mode decisions
- redlines or implementation notes for interaction-heavy areas

### Priority Order

1. activity timeline
2. mobile client list
3. mobile client detail
4. web pipeline overview
5. follow-up and filter patterns
6. secondary panels and analytics

## 18. Acceptance Criteria for Design Completion

The V1 handoff is considered ready when:

- all in-scope screens are designed
- all required states are covered
- all core flows can be completed without ambiguity
- token definitions exist
- reusable component rules exist
- timeline behavior is specified clearly
- light and dark mode are both addressed
- engineering can identify implementation intent without guesswork

## 19. Final Standard

This system should feel like a premium SaaS CRM foundation suitable for multiple future client deployments.

It must not feel like:

- a bootstrap dashboard
- a generic admin panel
- a placeholder template
- an unfinished internal tool

When tradeoffs are necessary, prioritize clarity, speed, and timeline quality over novelty.
