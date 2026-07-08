# Project Description

This project is a web platform for managing candidate registration for Kesmond Human Action Training.

The platform allows:

- candidates to submit online applications;
- administrators to review applications;
- administrators to approve or reject candidates;
- staff members to manage training programs and registrations.

The project follows a feature-based architecture and emphasizes maintainable, scalable, and strongly typed code.

# Coding Guidelines

- Use TypeScript everywhere.
- Prefer Server Components unless client-side interaction is required.
- Keep components small and reusable.
- Never duplicate business logic.
- Prefer composition over inheritance.
- Always validate user input with Zod.
- All database operations must go through Prisma.
- Use async/await.
- Avoid using `any`.

# 2 stack

- next js 16
- orm: prisma
- react-hook-form
- daisy ui/tailwind css
- tantack query
- zod
- zustand

# Architecture

The project follows a feature-first architecture.

app/
Contains application routes.

components/
Reusable UI components shared across multiple features.

features/
Contains business logic grouped by feature.

Each feature contains:

service.ts
Business logic and Prisma operations.

action.ts
Server Actions used by the UI.

hook.ts
React hooks related to the feature.

schema.ts
Zod validation schemas.

components/
UI components specific to the feature.

store/
Contains Zustand stores for shared UI state and global business state.

# Database Rules

- Prisma is the only ORM.
- Never write raw SQL unless strictly necessary.
- Use transactions when modifying multiple tables.
- Keep queries inside service.ts.
- Never call Prisma directly from UI components.

# Next.js Rules

- Use App Router.
- Prefer Server Components.
- Use Client Components only when necessary.
- Fetch data on the server whenever possible.
- Use Server Actions for mutations.

# React Rules

- Forms must use React Hook Form.
- Validation must use Zod.
- Remote state must use TanStack Query.
- Global state must use Zustand.
- Avoid prop drilling.

# Agent Instructions

Before generating code:

- understand the existing architecture;
- reuse existing components whenever possible;
- avoid creating duplicate utilities;
- follow existing naming conventions;
- keep generated code simple;
- explain significant architectural changes before implementing them;
- generate production-ready TypeScript.
