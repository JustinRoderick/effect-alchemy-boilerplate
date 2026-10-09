import * as Cloudflare from "alchemy/Cloudflare";

/**
 * The app's D1 database. Migrations are applied in order on every deploy and
 * already-applied files are skipped. The path is relative to the repo root,
 * where `alchemy.run.ts` lives and the Alchemy CLI runs.
 */
export const Database = Cloudflare.D1.Database("Database", {
  migrations: "./apps/api/migrations",
});
