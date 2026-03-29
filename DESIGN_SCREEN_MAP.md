# DESIGN_SCREEN_MAP.md

## Northstar CRM V1 Screen Map And Wireframe Checklist

This document translates the design brief into a concrete screen inventory and wireframe plan.

Use it to:

- sequence design work
- confirm V1 scope coverage
- track wireframe completion
- reduce ambiguity between design and engineering

This file should be used alongside [DESIGN_HANDOFF.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_HANDOFF.md).

## 1. Design Work Order

Design work should happen in this order unless a project constraint forces a change:

1. mobile activity timeline
2. mobile client list
3. mobile client detail
4. mobile add or edit client
5. mobile search and filters
6. mobile follow-up reminders
7. mobile tag manager
8. web pipeline overview
9. web activity panel
10. web follow-up alerts
11. web team insights
12. web conversion metrics

This order prioritizes the signature interaction model first, then the primary day-to-day user flows, then the supporting analytics views.

## 2. Global Design Coverage Checklist

Every in-scope screen should be checked against this list:

- default populated state designed
- loading state designed
- empty state designed where applicable
- error state designed where applicable
- success feedback designed where applicable
- light mode considered
- dark mode considered
- mobile or web responsiveness considered
- primary action identified
- secondary actions identified
- accessibility notes included for non-obvious interactions

## 3. Mobile Screen Map

### M1. Client List

Purpose:

- provide fast access to all client records
- support scanning, filtering, and entry into detail views

Required content:

- header/title region
- search input
- status filter
- tag filter entry point
- client list items or cards
- add client entry point
- quick scan indicators for status and recent contact context

Required states:

- populated
- loading
- no clients
- no search results
- sync or fetch error

Key decisions for wireframes:

- list rows versus stacked cards
- placement of search and filters
- visibility of tags at rest
- whether follow-up urgency appears in-line
- FAB behavior and placement

Checklist:

- primary list layout chosen
- card or row density defined
- filter interaction model defined
- add client action placement defined
- empty state CTA defined

### M2. Client Detail

Purpose:

- provide the main operational view for one client
- support reviewing context and taking quick actions

Required content:

- client identity block
- contact details
- status badge or control
- tag display and edit entry
- notes or summary section if used
- timeline preview or embedded timeline
- quick actions

Required states:

- populated
- loading
- no activity yet
- save/update success
- save/update error

Key decisions for wireframes:

- summary-first versus timeline-first layout
- sticky actions versus inline actions
- how status editing appears
- how tag editing is entered
- whether quick actions live in a bottom bar, toolbar, or section

Checklist:

- information hierarchy defined
- quick action model defined
- status change interaction defined
- tag management entry defined
- no activity state defined

### M3. Activity Timeline

Purpose:

- present relationship history clearly and efficiently

Required content:

- timeline list
- interaction type indicator
- timestamp
- author attribution placeholder
- note preview
- expanded detail behavior
- filter controls

Required states:

- populated
- loading
- no activity
- filtered empty state
- save success after new item

Key decisions for wireframes:

- compact versus spacious item density
- inline expand versus separate detail presentation
- filter chip versus dropdown model
- date grouping treatment
- sticky filter behavior on scroll

Checklist:

- item anatomy defined
- expanded state defined
- filtering pattern defined
- date grouping rule defined
- no activity state defined

### M4. Add Client

Purpose:

- create a new client record with minimal friction

Required content:

- form header
- required identity fields
- optional contact fields
- status selection
- notes field if included
- save action
- cancel or dismiss action

Required states:

- blank form
- validation errors
- saving
- save success
- save failure

Key decisions for wireframes:

- full screen form versus sheet
- required field presentation
- single-step versus grouped sections
- success behavior after save

Checklist:

- form structure defined
- validation presentation defined
- save state defined
- success destination defined

### M5. Edit Client

Purpose:

- modify client fields without losing context

Required content:

- editable identity and contact fields
- status control
- notes field if supported
- save and cancel actions

Required states:

- prefilled form
- validation errors
- saving
- save success
- save failure

Checklist:

- edit entry point defined
- edit form structure defined
- cancel behavior defined
- save feedback defined

### M6. Search And Filters

Purpose:

- refine the client list and timeline efficiently

Required content:

- search query input
- status filters
- tag filters
- clear all action
- active filter visibility

Required states:

- no filters selected
- one or more filters active
- filtered empty results

Key decisions for wireframes:

- modal, drawer, sheet, or inline filter model
- persistent versus temporary filters
- visibility of active filters after applying

Checklist:

- filter container defined
- active filter presentation defined
- clear all behavior defined
- empty search result state defined

### M7. Follow-Up Reminders

Purpose:

- help users identify clients needing action

Required content:

- due today section
- overdue section
- upcoming section if included
- urgency cues
- direct navigation to client
- resolve or log action

Required states:

- populated
- no follow-ups due
- loading
- fetch error

Checklist:

- reminder grouping rule defined
- urgency semantics defined
- primary action defined
- no follow-up state defined

### M8. Tag Manager

Purpose:

- create and maintain reusable client tags

Required content:

- tag list
- create tag action
- edit tag action
- delete tag action
- color semantics guidance

Required states:

- populated
- no tags
- create/edit form
- destructive confirmation
- save error

Checklist:

- tag list layout defined
- create/edit flow defined
- delete confirmation defined
- empty state defined

## 4. Web Screen Map

### W1. Pipeline Overview

Purpose:

- provide at-a-glance business and pipeline health visibility

Required content:

- analytics header
- top-level metrics
- status breakdown
- recent client snapshot
- entry points into client detail or workflow views

Required states:

- populated
- loading
- no analytics data
- API/fetch error

Checklist:

- information hierarchy defined
- metric card system defined
- summary-to-detail navigation defined
- empty analytics state defined

### W2. Activity Panel

Purpose:

- support dense review of recent interactions by power users

Required content:

- recent activity list
- filters
- search if included
- edit or open detail path

Required states:

- populated
- filtered empty
- loading
- fetch error

Checklist:

- activity row/card density defined
- filtering treatment defined
- action affordances defined

### W3. Follow-Up Alerts Panel

Purpose:

- surface near-term operational risk

Required content:

- overdue section
- due today section
- upcoming section if used
- urgency semantics
- open client action

Required states:

- populated
- no alerts
- loading
- fetch error

Checklist:

- prioritization model defined
- alert visual semantics defined
- empty state defined

### W4. Team Insights Panel

Purpose:

- show light operational insight without becoming a heavy BI dashboard

Required content:

- summary modules
- supporting labels
- trend or comparison placeholders if included

Required states:

- populated
- no data

Checklist:

- insight module pattern defined
- level of density defined
- no-data state defined

### W5. Conversion Metrics Panel

Purpose:

- show basic movement through the pipeline

Required content:

- lead to active metric
- active to completed metric
- simple trend or snapshot framing

Required states:

- populated
- no data

Checklist:

- metric visualization style defined
- terminology clarified
- no-data state defined

## 5. Cross-Screen Components To Wireframe Early

These should be explored early because they affect many screens:

- client card or client row
- status badge
- tag chip
- search input
- filter control pattern
- timeline item
- empty state
- loading skeleton
- toast or inline success feedback
- primary button and secondary button
- modal, drawer, or bottom sheet pattern

If these are not stabilized early, later screens will drift.

## 6. Shared Interaction Decisions

The design team should make explicit decisions on the following before high-fidelity work expands:

- whether mobile primary navigation is tab-based only or mixed with stacked contextual flows
- whether client creation uses a full screen form or bottom sheet
- whether timeline entries expand inline or navigate deeper
- whether filter controls are persistent or tucked into a modal surface
- whether web uses a true left sidebar shell or a lighter dashboard rail
- how dark mode changes depth, elevation, and borders

## 7. Wireframe Completion Definition

A screen is wireframe-complete when:

- layout hierarchy is clear
- primary actions are visible
- navigation paths are unambiguous
- all required states are represented
- reusable components are identified
- open interaction questions are called out explicitly

High-fidelity design should not begin for a screen until wireframe completion criteria are met.

## 8. Recommended Review Cadence

Review design progress in three checkpoints:

1. flow review
Confirm that primary user tasks can be completed cleanly across mobile and web.

2. wireframe review
Confirm coverage of all in-scope screens and states before high-fidelity exploration.

3. system review
Confirm tokens, components, and interaction rules are coherent before engineering implementation begins.
