# AGENTS.md — LENS Business App Template Development Guide

This document defines architecture rules and development instructions for AI coding agents working inside this repository.

Agents must read this file before making any modifications.

---

# Project Overview

This repository contains a TurboRepo-based AI Business App Starter Template used to generate production-grade applications for small businesses.

The first application being built from this template is:

Small Business Client Tracker CRM

The goal is to produce the most advanced small-business client tracking system available in its category.

The system must support:

* mobile interface
* web dashboard
* FastAPI backend
* Supabase database
* AI-assisted workflow intelligence
* scalable reusable architecture

Agents must extend the system without breaking the template structure.

Agents must NOT delete existing working infrastructure.

---

# Technology Stack

Frontend Mobile:
Expo + React Native + NativeWind

Frontend Web:
Next.js

Backend:
FastAPI (Python)

Database:
Supabase

Monorepo:
TurboRepo

Package Manager:
pnpm only

Agents must NOT introduce npm or yarn.

---

# Repository Structure Rules

Agents must preserve this structure:

apps/
mobile/
web/
api/

packages/
ui/
types/
config/
database/

Agents must not move files across boundaries unless explicitly instructed.

Shared logic belongs in packages/.

Application-specific logic belongs in apps/.

---

# Backend Architecture Rules

Backend lives inside:

apps/api/

Agents must:

* keep route logic modular
* place DB connectors inside app/db/
* place config inside app/core/
* place routers inside app/routes/
* place schemas inside app/models/

Agents must NOT place database logic inside route files.

All DB access must use:

app/db/supabase_client.py

---

# Supabase Rules

Supabase is the primary datastore.

Agents must:

* use service role key only in backend
* never expose service role key to frontend
* implement typed CRUD endpoints
* design schema migrations safely

Tables must include:

created_at
updated_at

when appropriate.

---

# Frontend Architecture Rules

Mobile app lives in:

apps/mobile/

Web app lives in:

apps/web/

Agents must:

* reuse UI components from packages/ui
* reuse types from packages/types
* reuse configs from packages/config

Agents must not duplicate components across apps.

---

# Shared Packages Rules

packages/ui

Reusable UI components shared across mobile and web.

packages/types

Shared TypeScript interfaces.

packages/config

Shared environment config utilities.

packages/database

Database schema definitions if required later.

Agents must centralize shared logic here.

---

# Authentication Requirements

System must support:

Supabase Auth

Agents must implement:

* login
* signup
* session persistence
* protected routes
* role-based access control

Roles required:

admin
staff
viewer

---

# AI Intelligence Layer Requirements

This application must include AI-assisted workflow features.

Agents must implement:

client note summarization

lead priority suggestions

follow-up reminders

activity insight generation

AI endpoints must live inside:

app/routes/ai/

Agents must not mix AI logic with CRUD endpoints.

---

# Client Tracker CRM Requirements

Agents must implement:

Client entity system

Fields:

id
name
phone
email
status
notes
tags
last_contacted_at
created_at
updated_at

Status options:

lead
active
inactive
customer
completed

Agents must create CRUD endpoints for clients.

---

# Activity Tracking System

Agents must implement:

client interaction logging

Fields:

interaction_type
notes
timestamp

Examples:

call
email
meeting
follow-up

This system supports timeline intelligence features later.

---

# Search System Requirements

Agents must implement:

full-text client search

status filtering

tag filtering

date filtering

Search must scale.

---

# Dashboard Requirements

Agents must implement:

client statistics panel

recent activity panel

lead conversion insights

follow-up reminders

---

# Mobile App Requirements

Mobile app must support:

client list screen

client detail screen

add client screen

edit client screen

activity timeline screen

AI summary panel

---

# Web Dashboard Requirements

Web dashboard must support:

admin analytics

team usage overview

lead pipeline visualization

activity insights

---

# API Endpoint Requirements

Agents must implement:

GET /clients

POST /clients

PATCH /clients/{id}

DELETE /clients/{id}

GET /clients/search

GET /clients/{id}/activity

POST /clients/{id}/activity

POST /ai/summarize-client-notes

POST /ai/suggest-followups

---

# Performance Requirements

Agents must:

paginate client results

optimize DB queries

avoid loading full tables

use indexed filtering fields

---

# Safety Rules

Agents must NOT:

delete infrastructure files

modify environment loading system

replace Supabase with another DB

replace FastAPI with another backend

switch package manager

remove TurboRepo structure

---

# Code Quality Requirements

Agents must:

write typed code

create modular routers

create reusable services

separate business logic from transport layer

---

# Task Execution Plan

Agents must complete tasks in order:

Task 1:

Create client database schema

Task 2:

Create CRUD client API

Task 3:

Create activity tracking schema

Task 4:

Create activity tracking API

Task 5:

Create AI summary endpoint

Task 6:

Create mobile client list screen

Task 7:

Create mobile client detail screen

Task 8:

Create dashboard analytics endpoint

Task 9:

Create web dashboard UI

Task 10:

Create search system

---

# Long-Term System Vision

This repository will become:

a reusable AI-powered internal tools generator

for building:

CRM systems

booking systems

inventory systems

automation dashboards

agents must maintain template compatibility at all times
