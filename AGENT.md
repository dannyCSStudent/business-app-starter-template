# AGENTS.md — AI Development Guardrails for CRM Template System

This document defines rules for AI coding agents (Codex or equivalent) working inside this repository.

Agents MUST follow these rules exactly.

Failure to follow these rules may break infrastructure.

---

# Core Principle

This repository is a **production-grade reusable CRM template system**.

Agents must upgrade the system **without modifying working infrastructure** unless explicitly instructed.

Agents must prioritize:

stability
reusability
modularity
design system consistency

over experimentation.

---

# Protected Infrastructure (DO NOT MODIFY)

Agents must NOT change:

Supabase schema structure

environment variable contracts

authentication flow

database relationships

TurboRepo workspace structure

packages/ shared modules architecture

API route signatures

existing endpoint URLs

seed pipeline logic

unless explicitly instructed.

---

# Allowed Modification Zones

Agents MAY modify:

components/

screens/

styles/

theme/

ui/

layout/

design tokens

frontend-only utilities

documentation files

Agents MAY improve:

spacing

typography

animations

component hierarchy

responsive behavior

dark mode compatibility

accessibility improvements

---

# Backend Modification Rules

Agents MAY:

add new endpoints

extend analytics endpoints

extend AI endpoints

add caching

optimize queries

Agents MUST NOT:

rename endpoints

change response shapes

remove fields used by frontend

alter schema expectations

---

# Database Rules

Agents MUST NOT:

drop tables

rename columns

remove indexes

modify enum definitions

change foreign keys

Agents MAY:

add indexes if performance requires

add optional columns if backward-compatible

---

# UI Upgrade Mission

Agents are authorized to transform UI into:

premium SaaS-level interface

mobile-first responsive layout

design-system-driven component architecture

consistent spacing rhythm

accessible typography scale

professional dashboard-grade visual hierarchy

Target quality benchmark:

Linear

Notion

Stripe Dashboard

Vercel Dashboard

Attio CRM

---

# Component Architecture Requirements

Agents must organize UI into:

components/ui/

components/layout/

components/cards/

components/forms/

components/feedback/

components/navigation/

Reusable components required:

Button

Card

Modal

Drawer

Badge

Avatar

Tag

Input

Select

TimelineItem

EmptyState

LoadingSkeleton

---

# Design Token Rules

Agents must centralize:

colors

spacing

radius

typography

shadows

animation durations

inside a shared theme system.

No hardcoded colors allowed inside components.

---

# Mobile Rules

Agents must preserve:

Expo compatibility

cross-platform layout stability

gesture safety

performance optimization

---

# Performance Rules

Agents must:

avoid unnecessary rerenders

use memoization where appropriate

avoid blocking API calls

preserve pagination usage

avoid N+1 fetch patterns

---

# Documentation Rules

Agents must update:

README.md

SYSTEM_ROADMAP.md

DESIGN_HANDOFF.md

when introducing architectural changes.

---

# Template System Objective

This repository is not a single CRM.

It is a **template generator for multiple future business systems**:

CRM

Job tracker

Client portal

Membership manager

Sales pipeline tool

Internal dashboards

Agents must preserve template flexibility at all times.
