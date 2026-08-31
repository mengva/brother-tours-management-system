# 🤖 AI Usage Disclosure (AI-USAGE.md)

This document details the usage of AI tools (ChatGPT / Gemini / Claude) during the development of the **Brother Tours Management System**.

## 1. Tools & Scope of Usage

- **Architecture & Infrastructure Setup:** Used AI to help structure the Turborepo Monorepo setup (Next.js + Hono + tRPC + Drizzle ORM) and debug deployment issues on Vercel/Render.
- **Boilerplate & Schema Drafting:** Assisted in drafting initial Drizzle Schema definitions, TypeScript DTO types, and Seed Data generation.
- **Debugging & Error Handling:** Used AI for fast diagnosis of CORS errors, Cookie SameSite configurations, TypeScript `verbatimModuleSyntax` errors, and Vitest setup issues.

## 2. Verification & Ownership

- **Code Review:** All AI-generated code snippets were thoroughly reviewed, refactored, and integrated manually to ensure compatibility with our architecture.
- **Testing:** Automated tests and manual API flow tests were executed to confirm business logic compliance (e.g., balance calculation, authorization middlewares, and supplier price warnings).
- **Security Audit:** Ensured environment variables and secrets were kept isolated and never exposed via AI prompts.