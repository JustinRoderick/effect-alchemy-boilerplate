# effect-alchemy-app

A full-stack TypeScript app built with [Effect](https://effect.website) v4 and deployed to
Cloudflare with [Alchemy](https://alchemy.run) v2. Infrastructure, API, and UI are all one typed
Effect program.

```
React (apps/web) ──HttpApiClient──▶ @app/contracts ◀──HttpApiBuilder── Worker (apps/api) ──▶ D1
```

## Getting started

```sh
pnpm install
pnpm dev          # local Worker + D1 (workerd) and the Vite app. No Cloudflare account needed.
```

`alchemy dev` prints the URLs (the API defaults to http://localhost:1337). Interactive API docs are
served at `<apiUrl>/docs`, and the OpenAPI spec at `<apiUrl>/openapi.json`.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Runs the whole Stack locally with hot reload (stage `dev_$USER`) |
| `pnpm test` | Unit tests (`@effect/vitest`, in-memory SQLite in place of D1) |
| `pnpm test:integ` | Deploys the Stack to local emulation and calls it through the typed client |
| `pnpm check` | Format check, lint, typecheck, unit tests, and knip. Run it before you push |
| `pnpm run deploy` | Deploys to Cloudflare (stage `live_$USER`, or `--stage prod`) |
| `pnpm run destroy` | Tears a deployed stage down |
| `pnpm sync:repos` | Clones effect and alchemy source into `.repos/` for coding agents |

## Deploying

1. Log in once: `pnpm exec alchemy profile edit --add Cloudflare`.
2. Deploy your personal stage: `pnpm run deploy`. Deploy production with `pnpm run deploy --stage prod`.
3. Tear a stage down: `pnpm run destroy --stage <stage>`.

Deploys keep Alchemy state in your Cloudflare account (`Cloudflare.state()`), so CI and teammates
share it. `alchemy dev` keeps state locally in `.alchemy/`. In CI, set `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` and deploy with `--stage pr-<number> --yes`.

## Layout

```
alchemy.run.ts            Composition root: Stack, providers, state, outputs
packages/contracts/       Wire types shared by server and client (Schema, errors, HttpApi)
apps/api/
  src/ApiWorker.ts        The Worker: bind resources, read config, compose layers, serve the API
  src/Database.ts         D1 resource declaration (migrations in apps/api/migrations)
  src/AppConfig.ts        Typed config service, read once at Worker construction
  src/todos/              A domain: Todos (rules), TodoRepo (SQL), http.ts (thin handlers), tests
  test/                   Deploy-level tests
apps/web/                 React + Vite, using typed atoms from the shared contract
docs/                     Architecture and Effect conventions (start at docs/README.md)
```

## Adding a feature

Follow [docs/06-checklists.md](./docs/06-checklists.md). In short: add the endpoint to
`packages/contracts`, implement a method on the domain service, wire one call in the domain's
`http.ts`, and test it through the service with `@effect/vitest`.
