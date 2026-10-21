# The Fountain

Next.js App Router, TypeScript, Tailwind CSS and Neon PostgreSQL.

## Local development

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The public interface runs without a database connection and explicitly shows the archive preparation state. It does not manufacture publication content.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

The production build uses Next.js’s supported Webpack bundler because Turbopack process creation is restricted in the development sandbox.

## Deployment

See [Vercel setup](docs/vercel.md), [.env.example](.env.example), [verified branding](docs/brand-audit.md), and [initial schema](db/migrations/001_initial.sql).

## Current limits

This is an unfinished MVP, suitable for an interface preview. Neon CLI initialization and service deployment have not completed. No live database or authentication integration has been verified. Schema/RLS execution tests, private upload storage, rich text persistence/rendering, draft editing, edition management, newsletter delivery/unsubscribe, complete Wix migration, browser accessibility testing and operational launch checks remain outstanding. The migration audit command currently references a script that has not been implemented. Do not treat a successful build as proof of these workflows.

The original Wix site remains unchanged and available.
