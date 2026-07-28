@AGENTS.md
@AGENTS.md

# CareRadar

## What this project is

Nurse recruitment platform connecting Indian nurses with German healthcare providers.
Two components:

1. Marketing website (public-facing, informational)
2. Portal (the main product) — nurse profiles, employer dashboard, application tracking

## Stack

- Next.js + React + TypeScript
- Supabase (database + auth)
- Tailwind CSS
- Razorpay (payments, if applicable to this project)
- Resend (transactional email)
- Deployed on Vercel
- GitHub for version control

## Domain / user types

- **Nurses (candidates)**: create profile, upload documents/credentials, track application status
- **Employers (German hospitals/clinics)**: browse candidates, shortlist, manage hiring pipeline
- Cross-border considerations: language requirements (German), credential recognition, visa/work permit status tracking

## Conventions

- Strict TypeScript — no `any`
- API routes live in `/app/api`
- Never commit `.env` files or expose Supabase service role keys
- Use Supabase Row Level Security (RLS) policies for all data access control — nurses should only see their own data, employers only see shortlisted/relevant candidates
- Prefer server components where possible; use client components only when interactivity is required
- Component naming: PascalCase; file naming: kebab-case

## Current focus

Building out the portal beyond the marketing site:

- Nurse profile management (CRUD, document upload)
- Employer dashboard (candidate browsing, shortlisting)
- Application/status tracking pipeline

## Communication style for Claude Code in this project

- Give full working code, not snippets with "... rest of code here"
- Be direct — exact file paths, exact commands, no filler explanation
- If something is ambiguous, state the assumption and proceed rather than asking multiple clarifying questions

## Notes

- Update this file as the schema, routes, or conventions evolve — treat it as living documentation, not a one-time setup
