# Deploying Bekhair to Cloudflare (Workers + OpenNext)

The app is built with [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) and runs as a Cloudflare Worker with static assets (worker name `bekhair`). It stays Vercel-compatible (`next build` is unchanged).

## What changed to make this work

| Area | Change |
| --- | --- |
| Next.js / React | Upgraded to Next 15.5.29 (OpenNext requires `>=15.5.29 <16`) and React 19. Route `params` are async (codemod applied; `lib/supabase/server.ts` `createClient()` is now async because `cookies()` is async). `framer-motion` -> 12, `cmdk` -> 1.1, `lucide-react` -> 0.577 for React 19 peers. `react-query` v3 -> `@tanstack/react-query` v5 (3 files). Unused `lottie-react`, `react-scroll-parallax`, `next-seo` removed. |
| Filesystem | Workers have no runtime `fs`. `scripts/generate-content-bundle.ts` (runs on `prebuild`, `predev`, `prelint`, `pretype-check`) reads `content/` (posts, authors, doa) into `lib/generated/content/` (git-ignored). `lib/mdx/mdx-utils.ts`, `lib/author-utils.ts`, `lib/doa-utils.ts` read it through `lib/content-source.ts`. |
| MDX | `next-mdx-remote` evaluates MDX with `new Function`, which Workers forbid. Blog posts are compiled to React modules at build time (same remark/rehype plugins) and loaded through a static registry. The inline intro texts on a few pages (`renderMd`) now use `react-markdown`. `next-mdx-remote` and the unused `MDXLayout` were removed. |
| Images | `sharp` removed. `wrangler.jsonc` has an `IMAGES` binding so `next/image` (`/_next/image`, remotePatterns kept) is optimized by Cloudflare Images. |
| Middleware | `middleware.ts` (Supabase session refresh) runs as OpenNext's edge middleware. It now skips the refresh when the Supabase env vars are missing instead of failing every request. |
| Scripts | Build scripts run with `tsx` instead of `ts-node` loaders. `next build` no longer fails on pre-existing lint errors (`eslint.ignoreDuringBuilds`); run `npm run lint`. |

## One-time setup

```bash
npm install
cp .dev.vars.example .dev.vars   # local env for preview
npx wrangler login               # only needed to deploy
```

## Environment variables and secrets

| Name | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Build time** | Inlined into the client bundle and required by `integrations/supabase/client.ts` (the build fails without them, on Vercel too). Export them in the shell / CI before `npm run deploy`. Also read at runtime by the API routes and middleware (Worker variables/secrets). |
| `NEXT_PUBLIC_ONESIGNAL_APP_ID`, `NEXT_PUBLIC_ONESIGNAL_DEV_APP_ID`, `NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID`, `NEXT_PUBLIC_GA_ID` | Build time | Inlined into the client bundle. |
| `QURAN_API_URL` | Worker variable (`vars` in `wrangler.jsonc`) | Base URL of the Quran API (the `arrlancore/quran-api` Worker). Read at runtime on the server; falls back to the default in `config.ts`. The service worker (`public/sw.js`) has its own hardcoded copy. |
| `OPENROUTER_API_KEY` | Worker secret | `npx wrangler secret put OPENROUTER_API_KEY` |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Worker secrets | Used by `/api/upload`. |

## Commands

```bash
npm run preview     # opennextjs-cloudflare build + local workerd preview
npm run deploy      # build + deploy to Cloudflare (needs credentials)
npm run upload      # build + upload a new version without deploying
npm run cf-typegen  # generate cloudflare-env.d.ts from wrangler.jsonc
npm run dev         # normal Next dev server
```

## GitHub Actions (optional)

`.github/workflows/cloudflare-deploy.yml` is `workflow_dispatch` only. Add repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and the Supabase build variables, then run it manually.

## Caveats

- **Worker size**: about 20.7 MiB uncompressed / 2.6 MiB gzip, under the 3 MiB gzip free-plan limit but with little headroom (the bundled Quran pages and content are large).
- **No ISR/revalidate cache** (`open-next.config.ts` uses defaults). Prerendered pages are rendered per request. Add an R2 incremental cache if you want them cached.
- **Content changes need a rebuild** (content is bundled at build time).
- `next build` regenerates `public/sw.js` version and sitemap files; those are build outputs.
- Unknown routes return 404 from `not-found`; dynamic pages that call `notFound()` stream a 404 page with status 200 because of the root `loading.tsx` (same as on Vercel).
