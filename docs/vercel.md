# Vercel deployment

## Preview the interface

1. Push this checkout to `j03yilla/The--fountain-` before importing it. The original repository was empty; local files are not automatically uploaded.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Framework preset: **Next.js**. Root directory: the repository root (`./`).
4. Install command: `npm ci`. Build command: `npm run build`. Leave output directory at the framework default.
5. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL and deploy. An interface-only preview can run without Neon credentials; archive pages show their explicit empty state and submissions stay unavailable.

Keep the preview protected while security and integration checks remain outstanding. Do not replace the Wix site yet.

## Connect Neon and authentication

Neon setup must finish before the production publishing workflows are available. The requested target is organization `org-small-mountain-62061832`, project `wandering-haze-61432898`, branch `production`.

| Environment variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Server-only Neon owner connection, currently used to provision contributor profiles. Never expose it in a client variable. |
| `DATABASE_RUNTIME_URL` | Separate non-owner Neon role with NOBYPASSRLS and the grants listed in the migration. Do not reuse the owner URL. |
| `NEXTAUTH_SECRET` | Strong random authentication secret. |
| `NEXTAUTH_URL` | Full deployment URL. |
| `GITHUB_ID` | GitHub OAuth application client ID. |
| `GITHUB_SECRET` | GitHub OAuth application client secret. |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL. |

Configure the GitHub OAuth callback as `https://YOUR-DOMAIN/api/auth/callback/github`. Apply the schema with a migration-capable connection, create the restricted runtime role and grants, and configure the runtime URL. Secrets belong in Vercel’s environment settings, never Git. Redeploy after configuration changes. Use a separate database branch for previews rather than granting every preview access to production manuscripts.

The CLI has not yet generated a verified `neon.ts` or completed `neon deploy`. Do not assume those steps succeeded. Test database connectivity, anonymous visibility, cross-contributor privacy, editor decisions and publishing against the actual Neon database before launch.

Public content routes may be prerendered during the build; ensure configured Neon credentials work during builds as well as runtime. Current queries must be reviewed for caching and sitemap completeness before launch.
