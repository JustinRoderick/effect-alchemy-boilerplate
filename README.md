# create-effect-alchemy

Scaffold a full-stack TypeScript app built with [Effect](https://effect.website) v4 and deployed
to Cloudflare with [Alchemy](https://alchemy.run) v2. The project layout and Effect conventions
come from production codebases that rely on Effect heavily: Effect itself, Alchemy, and t3code.
See [docs/](./docs/README.md).

## Create a project

Run this in the directory where the project should go. The package manager you run it with is the
one the project is set up for.

```sh
bun create effect-alchemy my-app             # or: bunx create-effect-alchemy my-app
pnpm create effect-alchemy my-app            # or: pnpm dlx create-effect-alchemy my-app
npm create effect-alchemy@latest my-app      # or: npx create-effect-alchemy my-app
```

These need the package on npm (see [Publishing](#publishing)).

### From GitHub, without npm

These run the CLI straight from this repository, so they work before (or without) an npm publish.
Nothing is built during install: the built CLI, `dist/bin.mjs`, is committed.

```sh
bunx github:JustinRoderick/effect-alchemy-boilerplate my-app
pnpm dlx github:JustinRoderick/effect-alchemy-boilerplate my-app
npx github:JustinRoderick/effect-alchemy-boilerplate my-app
```

- **Pin a version** by appending `#<branch, tag, or commit>`, for example
  `github:JustinRoderick/effect-alchemy-boilerplate#v0.1.0`.
- **The repository must be public.** Otherwise your git credentials must be able to read it.
- **npm and pnpm also take a full git URL,** for example
  `npx git+https://github.com/JustinRoderick/effect-alchemy-boilerplate.git my-app`. bunx only
  accepts the `github:` form.
- **pnpm drops the template's `pnpm-lock.yaml`** from any package it packs, git installs included.
  `pnpm dlx github:...` projects therefore resolve a fresh lockfile on install, like the bun and npm
  variants. Direct dependencies are still pinned exactly by the catalog. To keep the tested
  lockfile, create the project from a clone.

### From a clone

```sh
git clone https://github.com/JustinRoderick/effect-alchemy-boilerplate.git
node effect-alchemy-boilerplate/dist/bin.mjs my-app --pm bun     # --pm bun | pnpm | npm
```

The CLI has no runtime dependencies, so the clone needs no install.

### Options

| Option | Effect |
| --- | --- |
| `<directory>` | Where to create the project. It must be new or empty. You're prompted if it's omitted |
| `--pm bun\|pnpm\|npm` | Override the detected package manager. Without the flag, the one running the command is used, else pnpm |
| `--no-install` | Skip installing dependencies |
| `--no-git` | Skip `git init` and the first commit |

### Run it

```sh
cd my-app
pnpm dev        # bun run dev / npm run dev: local Worker + D1 + Vite. No Cloudflare account needed.
```

## What you get

```
my-app/
├── alchemy.run.ts          Composition root: the Alchemy Stack
├── packages/contracts/     Effect Schema models, tagged errors, and the HttpApi contract
├── apps/api/               Cloudflare Worker: Effect services, D1 via SqlClient, thin HTTP handlers
├── apps/web/               React + Vite, calling the API through typed atoms from the contract
├── docs/                   These architecture docs and conventions
└── AGENTS.md               Rules for coding agents (CLAUDE.md points here)
```

The project comes with:

- **Strict TypeScript 7**, patched by `@effect/tsgo`, so Effect's diagnostics fail the typecheck.
- **Tooling:** oxlint, oxfmt, Vitest with `@effect/vitest`, and knip.
- **Unit tests** that use in-memory SQLite in place of D1.
- **A deploy-level test** that runs the whole Stack on local emulation.
- **Per-manager setup:**

  | Package manager | How the workspace is configured |
  | --- | --- |
  | pnpm | `pnpm-workspace.yaml` catalog and the template's lockfile |
  | bun | `workspaces.catalog` in `package.json` |
  | npm | Exact versions |

## This repository

```
├── src/                    The create-effect-alchemy CLI (Effect, effect/cli), bundled to dist/bin.mjs
├── template/               The project that gets generated: a real, tested pnpm workspace
└── docs/                   Research and conventions, copied into every generated project
```

`template/` is authored once, in pnpm form. The CLI derives the bun and npm variants from it
(`src/Template.ts`):
- It renames the project and the Stack.
- It rewrites workspaces, catalogs, and scripts for the chosen manager.
- It rewrites the commands in README.md and AGENTS.md.

### Working on the template

```sh
cd template
pnpm install
pnpm check              # format, lint, typecheck, unit tests, knip
pnpm test:integ         # deploys the Stack to local emulation
pnpm dev                # run it
```

### Working on the CLI

```sh
pnpm install
pnpm dev /tmp/try-it --pm npm   # run the CLI from src/
pnpm bundle             # rebuild dist/bin.mjs, then commit it with your src/ change
pnpm check              # format, lint, typecheck (with Effect diagnostics), tests, bundle freshness
```

`dist/bin.mjs` is committed because it's what the GitHub commands run. `pnpm check` fails if it
doesn't match `src/`. The package has no `prepare` or `build` script, because npm and pnpm would
then build it on every git install (`src/distribution.test.ts` enforces this).

### Publishing

Publish from a clean clone or from CI. `npm pack` and `npm publish` walk `template/`, so local
`node_modules` or `.repos` folders inside it would break packing. Use `npm publish`, not
`pnpm publish`: pnpm leaves `template/pnpm-lock.yaml` out of the tarball.

```sh
git clone https://github.com/JustinRoderick/effect-alchemy-boilerplate.git && cd effect-alchemy-boilerplate
pnpm install
npm publish             # `prepublishOnly` checks dist/bin.mjs is current; `files` ships dist, template, and docs
```

## Research references

`.repos/` (gitignored) holds the reference clones used for the research in `docs/`:

```sh
mkdir -p .repos && cd .repos
git clone --depth 50 https://github.com/Effect-TS/effect.git effect
git clone --depth 300 https://github.com/alchemy-run/alchemy.git alchemy
git clone https://github.com/pingdotgg/t3code.git t3code
```

Generated projects get their own `sync:repos` script, which clones effect and alchemy pinned to
the installed versions.
