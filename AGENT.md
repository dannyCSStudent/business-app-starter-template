# SYSTEM_ROADMAP.md — Small Business Client Tracker Build Plan

This document defines the execution roadmap for AI agents working inside this repository.

Agents must follow tasks in order.

Agents must NOT skip steps.

Agents must NOT refactor working infrastructure unless instructed.

---

# Project Goal

Build the most advanced small-business Client Tracker CRM available as a reusable TurboRepo template.

The finished system must support:

mobile usage

web dashboard analytics

Supabase authentication

timeline interaction tracking

AI workflow intelligence

team collaboration readiness

template reuse for future client systems

---

# Phase 0 — Infrastructure Validation

Objective:

Ensure baseline template runs correctly before feature development begins.

Tasks:

Verify FastAPI server starts successfully

Verify Supabase connection works

Verify environment variables load correctly

Verify Expo mobile app launches

Verify web dashboard launches

Verify TurboRepo workspace builds correctly

Completion Criteria:

apps/api runs without errors

apps/mobile launches simulator

apps/web loads homepage

---

# Phase 1 — Database Schema Design

Objective:

Create production-ready CRM schema.

Agents must create tables:

clients

client_activity

users_roles

tags

client_tags

---

## Table: clients

Fields:

id (uuid primary key)

name

email

phone

status

notes

last_contacted_at

owner_user_id

created_at

updated_at

Indexes required:

email

status

owner_user_id

---

## Table: client_activity

Fields:

id

client_id

interaction_type

notes

timestamp

created_by

Indexes required:

client_id

timestamp

---

## Table: users_roles

Fields:

user_id

role

Roles allowed:

admin

staff

viewer

---

## Table: tags

Fields:

id

name

color

---

## Table: client_tags

Fields:

client_id

tag_id

---

Completion Criteria:

Tables created

Indexes created

Relations verified

---

# Phase 2 — Backend Client API

Objective:

Build scalable CRUD endpoints.

Agents must implement:

GET /clients

GET /clients/{id}

POST /clients

PATCH /clients/{id}

DELETE /clients/{id}

GET /clients/search

Requirements:

Pagination required

Filtering required

Status filtering required

Tag filtering required

Date filtering required

---

# Phase 3 — Activity Timeline API

Objective:

Enable interaction intelligence tracking.

Agents must implement:

GET /clients/{id}/activity

POST /clients/{id}/activity

PATCH /activity/{id}

DELETE /activity/{id}

Interaction types allowed:

call

email

meeting

note

follow_up

---

# Phase 4 — Authentication System

Objective:

Secure multi-user CRM environment.

Agents must implement:

Supabase Auth integration

Login screen

Signup screen

Session persistence

Protected routes

Role middleware

Role enforcement inside API routes

---

# Phase 5 — Mobile Client Tracker UI

Objective:

Deliver demo-ready mobile CRM experience.

Agents must implement:

Client List Screen

Client Detail Screen

Add Client Screen

Edit Client Screen

Delete Client Action

Client Activity Timeline Screen

Tag assignment UI

Follow-up reminder indicator

Completion Criteria:

Mobile app fully usable for client tracking

---

# Phase 6 — Smart Search System

Objective:

Deliver fast business-grade filtering.

Agents must implement:

Search by name

Search by email

Search by phone

Filter by tag

Filter by status

Filter by last_contacted_at

Sort by recent activity

Sort alphabetically

---

# Phase 7 — AI Workflow Intelligence Layer

Objective:

Create premium differentiation feature.

Agents must implement endpoints:

POST /ai/summarize-client-notes

POST /ai/suggest-followups

POST /ai/activity-insights

AI must support:

conversation summarization

recommended next action

priority detection

relationship strength estimation

---

# Phase 8 — Dashboard Analytics Engine

Objective:

Deliver business intelligence layer.

Agents must implement endpoints:

GET /analytics/client-count

GET /analytics/conversion-rate

GET /analytics/followups-due

GET /analytics/activity-volume

GET /analytics/team-performance

---

# Phase 9 — Web Dashboard Interface

Objective:

Create admin control center.

Agents must implement:

Client pipeline overview

Activity heatmap

Recent interactions panel

Follow-up reminders panel

Team performance panel

Conversion insights panel

---

# Phase 10 — Notification System

Objective:

Improve retention and engagement.

Agents must implement:

Follow-up reminder notifications

Activity alerts

Assignment alerts

Future support:

push notifications

email reminders

---

# Phase 11 — Role-Based Permissions Engine

Objective:

Support multi-team deployment readiness.

Agents must enforce:

admin full access

staff limited modification access

viewer read-only access

API endpoints must enforce role access

---

# Phase 12 — Performance Optimization

Objective:

Prepare production-scale deployment readiness.

Agents must:

Add DB indexes where missing

Add pagination everywhere required

Avoid N+1 queries

Cache analytics queries if necessary

Optimize search queries

---

# Phase 13 — Template Conversion Mode

Objective:

Convert CRM into reusable generator template.

Agents must:

Move shared logic into packages/

Extract reusable UI components

Extract reusable DB schema patterns

Extract reusable API services

Ensure new systems can be created from template easily

---

# Phase 14 — Demo Readiness Mode

Objective:

Prepare portfolio-grade showcase system.

Agents must ensure:

seed demo client data exists

seed demo activity history exists

analytics panels show realistic data

mobile app usable without configuration friction

web dashboard visually complete

---

# Final Completion Criteria

System qualifies as complete when:

mobile CRM works end-to-end

web dashboard analytics functional

AI insights operational

Supabase auth working

timeline tracking operational

search system production-ready

template reusable for future builds
