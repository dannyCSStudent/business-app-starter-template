# COMPONENT_ARCHITECTURE.md — Cross-Platform UI System Blueprint

This document defines the component architecture used by the Small Business Client Tracker CRM template.

It enables:

shared design tokens

cross-platform UI reuse

Codex-assisted UI upgrades

designer → component automation

future template reuse across multiple business apps

This architecture supports:

Expo mobile

Expo web

Next.js dashboards (future-ready)

TurboRepo shared packages

---

# Core Design Philosophy

Design system drives UI.

Tokens drive components.

Components drive screens.

Screens never define styles directly.

All visual styling must flow through:

tokens → primitives → composites → screens

---

# Monorepo UI Structure

UI must live inside:

packages/ui/

Structure:

packages/ui/
tokens/
primitives/
components/
layout/
patterns/
hooks/
theme/

Apps consume UI from:

apps/mobile
apps/web

---

# Layer 1 — Design Tokens

Location:

packages/ui/tokens/

Purpose:

single source of truth for visual language

Required token files:

colors.ts

spacing.ts

radius.ts

typography.ts

shadows.ts

motion.ts

zIndex.ts

Example:

tokens/colors.ts

export const colors = {
primary: "#4F46E5",
secondary: "#06B6D4",
surface: "#FFFFFF",
background: "#F9FAFB",
textPrimary: "#111827",
textSecondary: "#6B7280",
success: "#10B981",
warning: "#F59E0B",
danger: "#EF4444"
}

Never hardcode colors inside components.

---

# Layer 2 — Theme Engine

Location:

packages/ui/theme/

Purpose:

combine tokens into runtime theme

Supports:

light mode

dark mode

brand overrides

client-specific deployments

Example:

theme/index.ts

export const theme = {
colors,
spacing,
radius,
typography,
shadows
}

---

# Layer 3 — Primitives

Location:

packages/ui/primitives/

Purpose:

cross-platform base components

Must wrap React Native primitives.

Required primitives:

Box

Text

Stack

Row

Column

Spacer

Pressable

Surface

Example:

<Box padding="md" background="surface" />

These primitives replace:

View

Text

TouchableOpacity

StyleSheet usage

---

# Layer 4 — Core UI Components

Location:

packages/ui/components/

Reusable system components.

Required components:

Button

Input

Select

Avatar

Badge

Chip

Tag

Divider

IconButton

FAB (Floating Action Button)

Modal

Drawer

BottomSheet

Toast

Tooltip

SkeletonLoader

EmptyState

ConfirmationDialog

Example:

<Button variant="primary" size="lg" />

Variants must come from tokens.

---

# Layer 5 — Layout Components

Location:

packages/ui/layout/

Used to structure screens consistently.

Required layout components:

ScreenContainer

SafeAreaLayout

ScrollLayout

DashboardLayout

SidebarLayout

HeaderBar

Section

Card

Panel

Example:

<ScreenContainer>
    <Section title="Clients">
        ...
    </Section>
</ScreenContainer>

---

# Layer 6 — Pattern Components

Location:

packages/ui/patterns/

Higher-level business UI patterns.

CRM-specific patterns:

ClientCard

ClientRow

ActivityTimeline

TimelineItem

TagSelector

SearchBar

FilterDrawer

StatusBadge

FollowUpIndicator

AnalyticsTile

MetricsPanel

These are reusable across:

CRM

Job Tracker

Membership Manager

Sales Pipeline

Future systems

---

# Activity Timeline Pattern (Signature Component)

Location:

patterns/ActivityTimeline.tsx

Supports:

icon per interaction type

timestamp formatting

expandable notes

author attribution

grouping by day

scroll optimization

filter support

This component defines product identity.

---

# Analytics Panel Pattern

Location:

patterns/MetricsPanel.tsx

Supports:

mini charts

trend indicators

value highlights

comparison deltas

Used in:

dashboard overview

team performance

pipeline insights

conversion analytics

---

# Navigation System

Location:

packages/ui/navigation/

Mobile navigation:

BottomTabs

FloatingActionButton

StackHeader

GestureSafeContainer

Web navigation:

Sidebar

TopNavbar

Breadcrumbs

CommandPalette (future)

---

# Icon System

Location:

packages/ui/icons/

Icons must use:

Ionicons (mobile)

Lucide (web fallback)

All icons wrapped inside:

<AppIcon />

Example:

<AppIcon name="calendar" size="md" />

Never import icons directly in screens.

---

# Typography System

Location:

tokens/typography.ts

Required scale:

displayXL

displayLG

headingXL

headingLG

headingMD

bodyLG

bodyMD

bodySM

caption

micro

Example:

<Text variant="headingLG">

---

# Spacing System

Location:

tokens/spacing.ts

4pt scale:

xs

sm

md

lg

xl

2xl

3xl

Example:

<Box padding="lg">

---

# Radius System

Location:

tokens/radius.ts

Example:

sm

md

lg

xl

2xl

Example usage:

<Card radius="xl">

---

# Shadow System

Location:

tokens/shadows.ts

Example:

sm

md

lg

xl

Used only via:

shadow="md"

Never inline shadow styles.

---

# Motion System

Location:

tokens/motion.ts

Defines:

durationFast

durationNormal

durationSlow

easingStandard

Used in:

modal transitions

timeline expansion

button press feedback

drawer animation

---

# Dark Mode Support

Theme engine must support:

light

dark

system

Example:

useTheme()

returns:

colors

spacing

radius

typographic scale

shadow presets

---

# Accessibility Layer

Components must support:

screen readers

44px touch targets

focus states

keyboard navigation (web)

high contrast compatibility

---

# Codex Implementation Rules

Codex agents must:

never style screens directly

only modify tokens or components

reuse primitives

create variants instead of duplication

avoid inline styling

maintain cross-platform compatibility

---

# Variant System

Components must support:

size variants

style variants

interaction states

Example:

<Button
 variant="primary"
 size="lg"
 loading
/>

Supported states:

hover

focus

pressed

disabled

loading

---

# Screen Composition Example

Correct:

Screen

→ Layout

→ Pattern

→ Component

→ Primitive

Example:

ClientDetailScreen

→ ScreenContainer

→ Section

→ ActivityTimeline

→ TimelineItem

→ Box + Text

Never:

Screen → raw View/Text styling

---

# Token Override Support (White-Label Mode)

Theme must allow:

logo swap

color override

font override

radius override

per-client deployment customization

without modifying components.

---

# Final Architecture Goal

This UI system must support building:

CRM

Job Tracker

Client Portal

Membership Manager

Sales Pipeline Tool

Internal Admin Dashboards

from the same component foundation.

Design once.

Deploy everywhere.
