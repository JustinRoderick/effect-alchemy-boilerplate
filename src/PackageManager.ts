import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

export const PackageManager = Schema.Literals(["bun", "pnpm", "npm"]);
export type PackageManager = typeof PackageManager.Type;

export const packageManagers = PackageManager.literals;

export const isPackageManager = Schema.is(PackageManager);

/**
 * Reads the package manager that launched this process from `npm_config_user_agent`,
 * which bun, pnpm, and npm all set (e.g. "pnpm/10.12.1 npm/? node/v24.4.0 linux x64").
 */
export const fromUserAgent = (
  userAgent: string,
): Option.Option<{ readonly name: PackageManager; readonly version: string }> => {
  const [first] = userAgent.trim().split(" ");
  const [name, version] = (first ?? "").split("/");
  return isPackageManager(name) && version ? Option.some({ name, version }) : Option.none();
};

/** Shell command that installs dependencies. */
export const installCommand = (pm: PackageManager): string => `${pm} install`;

/** Shell command that runs a package.json script, forwarding `args` to it. */
export const runCommand = (pm: PackageManager, script: string, args = ""): string => {
  const rest = args.trim();
  switch (pm) {
    case "pnpm":
      // `pnpm deploy` is a pnpm built-in, so scripts that collide with one need `run`.
      return `pnpm ${pnpmBuiltins.has(script) ? "run " : ""}${script}${rest ? ` ${rest}` : ""}`;
    case "bun":
      // `bun test` is bun's own test runner: always go through `run`.
      return `bun run ${script}${rest ? ` ${rest}` : ""}`;
    case "npm":
      // npm swallows flags after the script name unless they follow `--`.
      return `npm run ${script}${rest ? ` -- ${rest}` : ""}`;
  }
};

/** Shell command that runs a binary from node_modules. */
export const execCommand = (pm: PackageManager, binary: string): string => {
  switch (pm) {
    case "pnpm":
      return `pnpm exec ${binary}`;
    case "bun":
      return `bunx ${binary}`;
    case "npm":
      return `npx ${binary}`;
  }
};

const pnpmBuiltins = new Set(["deploy", "publish", "pack", "link", "update", "outdated"]);
