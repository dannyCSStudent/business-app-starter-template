# DESIGN_SCENARIOS.md

## Northstar CRM V1 Content And Scenario Pack

This document provides realistic product scenarios for design exploration.

Use it to:

- ground wireframes in believable data
- define states beyond the happy path
- test hierarchy and density decisions
- avoid generic placeholder content

This file should be used with:

- [DESIGN_HANDOFF.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_HANDOFF.md)
- [DESIGN_SCREEN_MAP.md](/home/dee/Documents/repos/business-app-starter-template/DESIGN_SCREEN_MAP.md)

## 1. Content Principles

Design work should use realistic CRM content rather than lorem ipsum.

Content should feel:

- operational
- concise
- credible
- slightly varied in length
- representative of small-business client work

Avoid:

- joke placeholder names
- obviously fake corporate language
- every record looking equally complete

A good scenario pack should include:

- clean records
- incomplete records
- urgent records
- quiet records
- long-history records
- empty states

## 2. Canonical Client Status Definitions

Use these definitions consistently across screens.

### Lead

A potential client not yet converted into active work.

### Active

A current working relationship with ongoing activity.

### Completed

A finished engagement or closed workstream.

### Inactive

A client relationship that is dormant, paused, or no longer currently engaged.

### Follow-Up Due

Not a lifecycle status. This is a reminder state or alert condition that may appear alongside another status.

## 3. Canonical Tag Examples

Design should use a restrained set of tags with clear semantics.

Recommended examples:

- Priority
- Design
- Finance
- Legal
- Follow Up
- VIP
- Renewal
- Onboarding

Do not assume every client has tags.

## 4. Primary Scenario Set

These scenarios should be used repeatedly across client list, detail, timeline, reminders, filters, and dashboard views.

### Scenario A: New Lead With Minimal History

Client:

- name: Blue Peak Logistics
- status: Lead
- email: ops@bluepeaklogistics.com
- phone: not yet added
- tags: Follow Up
- last contact: 3 days ago

Context:

- initial intro call completed
- pricing summary sent
- awaiting response

Design value:

- tests sparse detail view
- tests lead presentation
- tests follow-up reminder logic

Example activity:

- Intro call completed. Prospect asked for pricing tiers and implementation timing.
- Sent pricing summary and case study by email. Awaiting budget confirmation.

### Scenario B: Active Client With Dense Timeline

Client:

- name: Acorn Atelier
- status: Active
- email: ops@acornatelier.com
- phone: (312) 555-0148
- tags: Priority, Design
- last contact: today

Context:

- currently in active delivery
- frequent collaboration
- multiple recent touchpoints

Design value:

- tests timeline density
- tests quick-action workflows
- tests premium feel of the signature experience

Example activity:

- Reviewed onboarding checklist and confirmed implementation milestones.
- Shared revised homepage mockups and requested sign-off by Friday.
- Logged follow-up note after client requested a revised rollout sequence.
- Confirmed asset handoff and next stakeholder review meeting.
- Sent recap email with decisions, blockers, and owners.

### Scenario C: Completed Client With Handoff Notes

Client:

- name: Fern Harbor Dental
- status: Completed
- email: frontdesk@fernharbor.example
- phone: (773) 555-0199
- tags: none
- last contact: 8 days ago

Context:

- project finished
- final assets delivered
- relationship may reopen later

Design value:

- tests completed-state presentation
- tests no-tag case
- tests handoff or archive styling

Example activity:

- Shared final handoff notes and credentials package.
- Confirmed launch checklist completion and support window details.
- Marked engagement complete after final review call.

### Scenario D: Inactive Client Ready For Re-engagement

Client:

- name: Northline Wellness Studio
- status: Inactive
- email: hello@northlinewellness.com
- phone: (469) 555-0116
- tags: Renewal
- last contact: 74 days ago

Context:

- no recent activity
- likely re-engagement opportunity

Design value:

- tests inactive styling
- tests long-gap timeline behavior
- tests reminder strategy for dormant accounts

Example activity:

- Last check-in completed. Client paused work until next quarter.
- Renewal reminder created for upcoming outreach window.

### Scenario E: VIP Client With Follow-Up Risk

Client:

- name: Cedar & Stone Hospitality Group
- status: Active
- email: partnerships@cedarstonehospitality.com
- phone: (214) 555-0172
- tags: VIP, Priority, Follow Up
- last contact: 6 days ago

Context:

- high-value account
- delayed response could become an issue

Design value:

- tests urgency treatment
- tests tag density
- tests dashboard prioritization

Example activity:

- Client requested updated rollout estimate for second location.
- Follow-up reminder triggered after no response for six days.
- Internal note added to escalate if no reply by tomorrow.

### Scenario F: Incomplete Record Needing Cleanup

Client:

- name: Harbor Lane Events
- status: Lead
- email: missing
- phone: missing
- tags: none
- last contact: unknown

Context:

- record created quickly during intake
- requires follow-up to complete

Design value:

- tests partial-data layouts
- tests empty field handling
- tests whether UI degrades cleanly

Example activity:

- Lead captured from referral. Contact details still pending.

## 5. Dashboard Data Scenarios

Use these to design analytics and summary panels.

### Dashboard Scenario 1: Healthy Pipeline Snapshot

Metrics:

- leads: 12
- active: 18
- completed: 9
- follow-ups due: 4
- activity this week: 27

Implication:

- balanced mix of pipeline stages
- normal dashboard density

### Dashboard Scenario 2: Empty Analytics State

Metrics:

- no clients yet
- no activity yet
- no reminders due

Implication:

- first-run experience
- onboarding-like empty presentation without building a full onboarding flow

### Dashboard Scenario 3: Follow-Up Heavy Workload

Metrics:

- leads: 8
- active: 11
- completed: 5
- follow-ups due: 12
- overdue: 7

Implication:

- alerts should dominate attention
- urgency hierarchy must be clear

### Dashboard Scenario 4: Mature Portfolio With Quiet Activity

Metrics:

- leads: 2
- active: 7
- completed: 29
- follow-ups due: 1
- activity this week: 3

Implication:

- dashboard should still feel useful when activity volume is low

## 6. Empty State Scenarios

These should be explicitly designed, not left as afterthoughts.

### Empty Client List

Condition:

- system has no clients yet

Recommended message direction:

- explain value of adding the first client
- provide a clear primary action

### Empty Search Result

Condition:

- filters or search return no matches

Recommended message direction:

- confirm no matches found
- encourage clearing or changing filters

### Empty Timeline

Condition:

- client exists but has no recorded activity

Recommended message direction:

- explain that no interactions have been logged yet
- provide an action to log the first activity

### Empty Follow-Up Queue

Condition:

- nothing requires attention right now

Recommended message direction:

- reassure without sounding celebratory
- reinforce system health

### Empty Analytics

Condition:

- insufficient data for dashboard views

Recommended message direction:

- explain that metrics appear after client and activity data exists

## 7. Error State Scenarios

Design these as recoverable system moments, not dead ends.

### Error A: Client Save Failed

Condition:

- user edits client info and save fails

Design should support:

- persistent form data
- visible error message
- retry path

### Error B: Activity Log Failed

Condition:

- user submits a new note or interaction and the request fails

Design should support:

- draft preservation
- retry action
- clear feedback near the action

### Error C: Dashboard Failed To Load

Condition:

- analytics or list data fails to fetch

Design should support:

- localized panel failure or full-page failure handling
- retry action
- non-destructive fallback treatment

## 8. Loading State Scenarios

Loading states should preserve layout rhythm.

### Loading A: Client List Initial Load

Use:

- skeleton rows or cards
- visible search/filter shell if possible

### Loading B: Client Detail Load

Use:

- summary placeholder
- action placeholder
- timeline placeholder

### Loading C: Dashboard Metrics Load

Use:

- metric card skeletons
- panel placeholder blocks

### Loading D: Timeline Append Or Refresh

Use:

- subtle loading treatment
- avoid full screen reset if existing content is already visible

## 9. Interaction Content Examples

Use short, believable note styles.

Recommended note patterns:

- Reviewed revised proposal and aligned on next approval step.
- Left voicemail after missed check-in. Will retry Thursday morning.
- Sent invoice reminder and attached updated payment link.
- Confirmed kickoff date and requested final asset bundle.
- Followed up on outstanding legal review before launch.
- Captured client request to split rollout into two phases.

Avoid:

- long paragraph notes everywhere
- overly polished marketing language
- notes that all sound written by the same person

## 10. Stress Cases For Visual Design

Design should be tested against difficult content situations.

### Stress Case A: Very Long Client Name

Example:

- Great Lakes Multi-Location Pediatric Therapy Partners

### Stress Case B: Very Long Tag Combination

Example:

- Priority, Renewal, Follow Up, Finance

### Stress Case C: Long Note Preview

Example:

- Client requested that we delay the launch recommendation until internal legal review is complete, but still wants revised timeline options prepared by Monday.

### Stress Case D: Missing Contact Data

Example:

- no email
- no phone
- no last-contact date

### Stress Case E: High Activity Density

Example:

- 12 timeline entries across 10 days

## 11. Suggested Scenario Coverage By Screen

Use the following pairings as a default:

- Client List: scenarios A, B, E, F
- Client Detail: scenarios B, C, D, F
- Timeline: scenarios B, C, D
- Follow-Up Reminders: scenarios A, D, E
- Tag Manager: shared tag examples from section 3
- Web Dashboard: dashboard scenarios 1 through 4

## 12. Definition Of A Good Design Mock Using These Scenarios

A strong design mock should:

- show varied record completeness
- handle urgency without visual chaos
- make sparse and dense records both look intentional
- preserve readability under long names and long notes
- use realistic activity language
- avoid requiring perfect data to look good
