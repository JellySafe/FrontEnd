<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# JellySafe Repository Rules

## Project Overview

JellySafe is a Jeju jellyfish safety service.

This pnpm/Turborepo monorepo contains:

- `apps/public`: public mobile web application
- `apps/admin`: standalone desktop admin dashboard
- `packages/design-system`: shared design tokens, icons, and UI primitives

Public and Admin are separate services.

- Do not implement role-based switching between them.
- Do not import application code directly across apps.
- The backend is being developed separately with Nest.js.
- Do not invent API endpoints, DTOs, response structures, or authentication methods.

## Communication

- Respond to the user in Korean.
- Use English for code identifiers.
- Write concise code comments in Korean.
- Do not add comments that merely repeat the code.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- pnpm
- Turborepo

Use only when needed:

- TanStack Query: server state
- Zustand: shared client UI state
- React Hook Form + Zod: form validation

Ask before installing a new production dependency.

## Structure

Use a lightweight feature-based structure:

    src/
      app/
      features/
      shared/

- `app`: routes, layouts, providers, metadata, and page composition
- `features`: product features grouped by domain
- `shared`: application-local UI, hooks, utilities, constants, and types

Do not create empty layers or unnecessary abstractions.

## Naming Conventions

- Directories and route segments: `kebab-case`
- React component names and files: `PascalCase`
- Hooks and hook files: `useSomething.ts`
- Utility, schema, and service files: `kebab-case.ts`
- Variables and functions: `camelCase`
- Types and interfaces: `PascalCase`
- Boolean values: `is`, `has`, `can`, or `should`
- Callback props: `onSomething`
- Internal handlers: `handleSomething`
- Global constants: `UPPER_SNAKE_CASE`
- CSS variables: `kebab-case`

Keep required Next.js filenames unchanged:

- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- `route.ts`

## React and TypeScript

- Use Server Components by default.
- Add `"use client"` only when required.
- Keep `page.tsx` focused on composition.
- Do not use `any`.
- Avoid unsafe type assertions.
- Remove unused code.
- Prefer string unions over enums when sufficient.
- Prefer named exports except where Next.js requires default exports.
- Use `@/*` for application-local imports.
- Import shared UI through `@jellysafe/design-system`.

## Design System

Figma is the visual source of truth.

Public and Admin use one shared design system.

Implement in this order:

1. Figma inventory
2. Primitive tokens
3. Semantic tokens
4. Typography and layout foundations
5. Shared assets
6. Shared UI components
7. Application layouts
8. Screens

Rules:

- Shared tokens and primitives belong in `packages/design-system`.
- Do not use raw hex colors in application TSX.
- Prefer semantic tokens.
- Reuse existing components before creating new ones.
- Do not apply third-party default styles over the Figma design.
- Do not install an icon or UI library without approval.

Repeated Figma layer names are not automatically duplicates.

Several repeated layers may be internal visual parts of one component. For example, multiple shapes may form one loading spinner. Inspect the parent, variants, properties, and constraints before deciding component boundaries.

## Figma Workflow

When Figma MCP is available:

1. Open the exact frame or component.
2. Inspect metadata when the target is large.
3. Fetch design context and a screenshot.
4. Inspect existing tokens and components.
5. Retrieve the exact assets.
6. Implement one component group or screen at a time.
7. Compare with the Figma screenshot.
8. Run verification commands.

Do not claim to have inspected Figma without using the MCP tool.

Do not blindly copy generated markup.

## Assets

- Use exact Figma SVGs, icons, images, and illustrations.
- Do not replace them with approximate library icons.
- Do not leave temporary Figma URLs in production code.
- Download permanent assets into the repository.

Asset locations:

- Shared icons: `packages/design-system/src/assets/icons`
- Public assets: `apps/public/public/assets`
- Admin assets: `apps/admin/public/assets`

## API and State

- Use TanStack Query for server state after API integration begins.
- Use Zustand only when local state, props, or URL state are insufficient.
- Do not copy server data into Zustand without a clear reason.
- Do not invent API contracts before backend information is provided.
- Do not expose `.env` values.
- Update `.env.example` when adding environment variable names.

## Agent Safety

- Check `git status` before broad changes.
- Preserve unrelated and uncommitted work.
- Do not revert or reformat unrelated files.
- Ask before deleting many files or adding dependencies.
- Do not run commit, push, reset, rebase, or force commands unless requested.
- Report changed files and verification results after completing work.

Required checks:

    pnpm lint
    pnpm typecheck
    pnpm build