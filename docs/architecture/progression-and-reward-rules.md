# Progression And Reward Rules

## Purpose

This document records the current progression and reward rules implemented in the renewed PlanQuest codebase.

It describes what is real today, what is placeholder groundwork, and what is intentionally deferred.

## Current Progression Model

PlanQuest currently has a minimal account-level progression layer backed by `ProgressLedger`.

Implemented pieces:

- per-user XP ledger entries
- deterministic level calculation
- read API for the authenticated user progression summary

Current API:

- `GET /api/progression/me/`

Current summary fields:

- `total_xp`
- `level`
- `next_level_xp`

## Level Threshold Rule

The current level rule is intentionally simple:

- every `100 XP` advances one level

Current formula:

- `level = floor(total_xp / 100) + 1`
- `next_level_xp = level * 100`

Examples:

- `0 XP` -> `Level 1`
- `99 XP` -> `Level 1`
- `100 XP` -> `Level 2`
- `250 XP` -> `Level 3`

## XP Source Reality Today

### What Exists

The backend includes:

- `award_xp(...)`
- `get_total_xp(...)`
- `get_level_for_xp(...)`
- `get_progress_summary(...)`

### What Is Actually Wired Today

The progression domain groundwork is implemented and tested, but broad runtime XP awarding is still limited.

That means:

- the system can store XP entries
- the system can calculate levels and totals
- the profile and dashboard can read progression summary
- not every product action is yet awarding XP in live feature flows

## Reward Preview Rule For Challenges

Challenge creation currently exposes a stable reward preview value.

Current rule:

- if no streak goal is set -> `100 XP`
- if `streak_goal_days` is set -> `max(100, streak_goal_days * 10)`

Examples:

- no streak goal -> `100 XP`
- `7 days` -> `100 XP`
- `30 days` -> `300 XP`

This is a preview/display rule, not yet a full completion payout contract.

## Current Completed Reward-Adjacent Systems

Implemented and user-visible:

- challenge reward preview field
- challenge milestone summary in the hub UI
- achievement awarding for challenge activity
- progression summary display in dashboard/profile

Implemented but still groundwork-like:

- generalized XP ledger for broader product actions

## Reminder-Triggered Notifications

Notifications and reminders are part of the retained growth loop, even though they are not direct XP rewards.

### Event Quest Reminder Windows

Event quest reminders fire at:

- `24h`
- `1h`
- `5m`

### Event Quest Reminder Recipients

Event quest reminders go to:

- event quest creator
- accepted participants

They do not go to:

- pending invitees
- declined invitees
- expired invitees

### Challenge Reminder Window

Challenge reminders currently use one simple window:

- `daily`

### Challenge Reminder Recipient

Challenge reminders currently go to:

- challenge creator only

## Idempotency Rules

Current progression idempotency rule:

- XP ledger writes are protected by `get_or_create` on:
  - `user`
  - `source_type`
  - `source_id`
  - `action`

This prevents duplicate XP awards for the same source/action pair.

Current reminder idempotency rule:

- reminders are not regenerated for the same:
  - user
  - notification type
  - referenced object
  - reminder window

## Deferred Balancing Decisions

Intentionally not finalized yet:

- global XP table for event quest creation/completion
- global XP table for challenge completion
- whether progress logging grants XP directly
- rarity tiers with hard reward meaning
- per-category or per-difficulty reward multipliers
- team/shared XP rules for future collaborative challenges
- leaderboard scoring rules

## Strict Status

Use this summary:

- `progression groundwork: implemented`
- `level calculation: implemented`
- `challenge reward preview: implemented`
- `broad XP economy: intentionally incomplete`
