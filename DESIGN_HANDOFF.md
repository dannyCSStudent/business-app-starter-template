# DESIGN_HANDOFF.md — CRM Template UI System Specification

This document defines the visual direction and UI expectations for the Small Business Client Tracker system.

It is used by:

design teams

frontend engineers

Codex AI agents

product collaborators

---

# Project Identity

Product Type:

Small Business Client Tracker CRM Template

Platform Targets:

Mobile (primary)

Web dashboard (secondary)

Future:

multi-tenant SaaS deployments

white-label client systems

---

# Design Objective

Create a premium SaaS-grade interface that feels:

fast

calm

intelligent

modern

trustworthy

professional

The interface must visually compete with:

Linear

Notion

Stripe Dashboard

Vercel Dashboard

Attio CRM

---

# Primary UX Principles

Mobile-first layout

minimal cognitive load

clear hierarchy

timeline-centric workflows

fast navigation

strong typography rhythm

subtle motion feedback

---

# Core Screens

Mobile:

Client List

Client Detail

Activity Timeline

Add Client

Edit Client

Tag Manager

Search / Filters

Follow-up Reminders

Web Dashboard:

Pipeline Overview

Activity Heatmap

Recent Interactions Panel

Follow-up Alerts Panel

Team Insights Panel

Conversion Metrics Panel

---

# Design System Requirements

Designers must define:

Color palette

Typography scale

Spacing scale

Border radius system

Elevation/shadow system

Icon style direction

Interaction animation style

Light mode + dark mode compatibility

---

# Component Inventory

Required reusable components:

Primary Button

Secondary Button

Icon Button

Card Container

Client Card

Activity Timeline Item

Tag Chip

Status Badge

Modal

Drawer

Bottom Sheet (mobile)

Floating Action Button

Search Input

Filter Panel

Dropdown Select

Avatar

Empty State

Loading Skeleton

Toast Notification

Confirmation Dialog

---

# Timeline UI Requirements

Timeline must support:

interaction icons

timestamps

author attribution

notes preview

expandable entries

filter by interaction type

scroll performance optimization

This is the signature experience of the CRM.

It must feel premium.

---

# Color Usage Guidelines

Status colors required:

Lead

Active

Customer

Inactive

Completed

Follow-up Due

Priority Tag

Avoid:

oversaturated palettes

harsh contrast combinations

visual clutter

Prefer:

soft neutrals

layered surfaces

semantic accent colors

---

# Typography Direction

Font should feel similar to:

Inter

Geist

SF Pro style spacing

Hierarchy levels required:

Dashboard heading

Section heading

Card heading

Body text

Caption text

Micro-label text

---

# Motion Guidelines

Use motion sparingly.

Allowed:

card hover lift

timeline expand animation

modal transitions

button press feedback

skeleton loading shimmer

Avoid:

heavy animations

page transition delays

excessive bounce effects

---

# Layout Grid

Mobile spacing baseline:

4pt scale

Web spacing baseline:

8pt scale

Max content width (web):

1280px

---

# Navigation Pattern

Mobile:

bottom navigation

floating action button

gesture-safe margins

Web:

left sidebar navigation

top analytics header

context panels

---

# Empty States Required

Client list empty state

Search empty state

No activity state

No follow-ups due state

No analytics data state

Each empty state should include:

illustration placeholder

primary action button

secondary explanation text

---

# Accessibility Requirements

Contrast ratio compliant

tap targets minimum 44px

keyboard navigation support (web)

screen reader friendly labels

dark mode compatibility required

---

# Brand Flexibility Requirement

System must support:

client rebranding

color overrides

logo replacement

multi-company reuse

without layout rewrites.

---

# Final Design Goal

The finished UI must feel like:

a premium SaaS product

not a starter template

not a bootstrap dashboard

not a generic admin panel

This system will serve as the visual foundation for multiple production client deployments.
