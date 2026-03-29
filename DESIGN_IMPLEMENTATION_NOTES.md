# DESIGN_IMPLEMENTATION_NOTES.md

## Northstar CRM V1 Design And Engineering Alignment Notes

This document explains how the current codebase relates to the design handoff.

Use it to:

- keep design exploration grounded in implementation reality
- clarify which areas can change freely
- identify likely engineering follow-up work after design delivery
- reduce avoidable handoff churn between design and engineering

This file should be used with:

- [DESIGN_HANDOFF.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_HANDOFF.md)
- [DESIGN_SCREEN_MAP.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_SCREEN_MAP.md)
- [DESIGN_SCENARIOS.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_SCENARIOS.md)

## 1. Current Product State

The repo currently contains a functional product prototype across web, mobile, shared UI, and API layers.

Broadly:

- the API layer supports client, activity, tag, and client-tag operations
- the web app already renders dashboard-style CRM views and editing flows
- the mobile app already contains CRM-focused shells and components
- shared types exist across applications
- some shared web UI primitives exist, but the design system is not mature yet

This means the product is beyond blank-slate wireframing, but not yet constrained by a mature design system.

## 2. What Exists Today

### Backend And Data Shape

The current API and data model already assume these concepts:

- clients
- client status
- client activity
- tags
- client-tag relationships

This is a useful constraint. Design should not invent a radically different product model for V1.

### Web Product Shell

The current web app includes:

- top-level dashboard page
- summary metrics
- client dashboard and filtering
- activity dashboard
- quick actions
- record editing
- record management

Relevant files include:

- [apps/web/app/page.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/page.tsx)
- [apps/web/app/client-dashboard.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/client-dashboard.tsx)
- [apps/web/app/activity-dashboard.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/activity-dashboard.tsx)
- [apps/web/app/quick-actions.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/quick-actions.tsx)
- [apps/web/app/record-editor.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/record-editor.tsx)
- [apps/web/app/record-manager.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/record-manager.tsx)
- [apps/web/app/layout.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/layout.tsx)
- [apps/web/app/globals.css](/home/dee/Documents/repos/business-app-starter-template/apps/web/app/globals.css)

### Mobile Product Shell

The current mobile app includes:

- CRM-flavored hero and utility components
- client detail screen
- activity and tag actions
- mobile sync and CRM support logic

Relevant files include:

- [apps/mobile/app/client/[id].tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/app/client/[id].tsx)
- [apps/mobile/components/crm/crm-hero.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/components/crm/crm-hero.tsx)
- [apps/mobile/components/crm/activity-history.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/components/crm/activity-history.tsx)
- [apps/mobile/components/crm/client-detail-form.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/components/crm/client-detail-form.tsx)
- [apps/mobile/components/crm/tag-manager.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/components/crm/tag-manager.tsx)
- [apps/mobile/components/crm/quick-activity-form.tsx](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/components/crm/quick-activity-form.tsx)
- [apps/mobile/constants/theme.ts](/home/dee/Documents/repos/business-app-starter-template/apps/mobile/constants/theme.ts)

### Shared UI

There is already a small shared UI package, but it is limited and not yet a full tokenized system.

Relevant file:

- [packages/ui/src/client-card.tsx](/home/dee/Documents/repos/business-app-starter-template/packages/ui/src/client-card.tsx)

## 3. Current Constraints Designers Should Respect

These are reasonable V1 constraints based on the current codebase.

### Constraint A: Keep The Core Data Model Stable

The design should continue to center around:

- client records
- statuses
- activity timeline entries
- tags
- follow-up concepts

Design should not require introducing a fundamentally different object model for V1.

### Constraint B: CRUD-Centric Interaction Model Already Exists

The product already supports create, edit, update, and delete oriented workflows.

Design can improve how these actions are presented, grouped, or prioritized, but should not assume a workflow model that removes direct editing entirely.

### Constraint C: Web And Mobile Should Share Semantics

The two platforms do not need identical layouts, but they should share:

- status meanings
- tag meanings
- primary interaction vocabulary
- hierarchy of key actions

Design should not create platform-specific product logic unless there is a strong reason.

### Constraint D: The Codebase Does Not Yet Have A Mature Token System

Design should define one, but engineering should expect follow-up implementation work to establish:

- shared color tokens
- typography tokens
- spacing tokens
- reusable component variants

Design should not assume these already exist.

## 4. Areas That Can Change Freely

The following areas are safe for major redesign if the V1 scope stays intact:

- overall visual direction
- layout hierarchy
- component styling
- navigation framing
- dashboard composition
- density and spacing decisions
- placement of actions and filters
- card versus table-like presentation choices
- empty state design
- loading state design

In short, most of the current visual shell should be treated as replaceable.

## 5. Areas That Need Coordination Before Major Redesign

These areas can change, but they should be called out explicitly in design review because they affect implementation complexity.

### Web Navigation Architecture

The current web app uses a simple top header shell. The design brief prefers a left sidebar and analytics header.

This is a valid redesign direction, but it changes the page shell meaningfully and should be acknowledged as a structural implementation task.

### Timeline Interaction Model

If design introduces:

- multi-level expansion
- grouped sticky headers
- virtualized long-history behavior
- inline editing within timeline items

engineering should review feasibility before those behaviors are treated as final V1 requirements.

### Tag Management Complexity

If tags become:

- heavily color-coded
- nested
- grouped into categories
- permission-sensitive

that would exceed the current simplicity of the data model and should be treated as future-facing unless implementation is explicitly expanded.

### Follow-Up Logic

The product should support reminder-style follow-up views, but if design implies:

- scheduling workflows
- recurring reminder logic
- calendar-like systems
- multi-user assignment logic

that should be reviewed as product expansion, not just UI polish.

## 6. Current Implementation Gaps Design Should Help Solve

Design should directly address these known weaknesses in the current prototype.

### Gap A: No Unified Design System

Current styles are distributed across app files and are only lightly standardized.

Design needs to define:

- tokens
- component rules
- interaction rules
- dark mode behavior

### Gap B: Web Layout Does Not Yet Match The Intended Product Shape

The web app currently feels like a functional demo shell more than a finished operational product.

Design should clarify:

- sidebar or shell structure
- dashboard panel hierarchy
- metrics presentation
- panel density rules

### Gap C: Mobile And Web Visual Language Are Not Fully Aligned

Design should unify the product across platforms while keeping mobile primary.

### Gap D: Empty, Loading, And Error States Need Deliberate Treatment

The prototype is functional, but state design is not yet comprehensive or polished.

### Gap E: The Timeline Needs To Become The Premium Centerpiece

The handoff explicitly identifies timeline quality as the core product differentiator. Design should spend disproportionate attention here.

## 7. Recommended Engineering Interpretation Of Design Deliverables

When design is handed back to engineering, implementation should likely happen in this order:

1. establish shared tokens and base surfaces
2. implement app shell and navigation changes
3. rebuild shared components
4. implement timeline pattern
5. align client list and detail views
6. complete empty, loading, and error states
7. refine analytics panels and secondary screens

This reduces the risk of styling isolated screens before the system foundations exist.

## 8. Decisions Design Should Make Explicit

To avoid ambiguity, design should answer these directly in review:

- Is the mobile primary navigation tab-based only, or mixed with contextual actions?
- Is add client a full-screen flow, sheet, or modal pattern?
- Does the client detail screen prioritize summary first or timeline first?
- Do timeline entries expand inline or open deeper detail?
- Are filters persistent, inline, or moved into a modal surface?
- Does web use a persistent left sidebar?
- How are follow-up alerts visually distinct from lifecycle status?
- What are the default and dark-mode surface depth rules?

If these are left implicit in mocks, implementation risk rises sharply.

## 9. What Design Should Not Worry About Yet

The design handoff does not need to solve:

- production analytics instrumentation
- authorization model details
- tenant administration
- billing systems
- exhaustive reporting architecture
- future plugin or extensibility systems

Those can be deferred without weakening the V1 design package.

## 10. Definition Of A Good Designer-To-Engineer Handoff

A strong handoff in this repo will:

- preserve the current product model
- improve the current visual and interaction quality substantially
- define reusable patterns instead of one-off screens
- call out structural shell changes explicitly
- distinguish V1 requirements from future ideas
- give engineering enough specificity to implement without guessing

If design delivers attractive screens without interaction rules, state coverage, token logic, or platform consistency, the handoff will still be weak even if the visuals look polished.
