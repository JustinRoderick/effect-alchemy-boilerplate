/**
 * Pure transforms that turn the pnpm-flavored template into a project for the
 * chosen package manager. The template is authored once, in pnpm form (it is a
 * real, tested pnpm workspace); everything here derives the bun and npm variants.
 */
import type { PackageManager } from "./PackageManager.ts";
import { execCommand, installCommand, runCommand } from "./PackageManager.ts";

/** Values substituted into a scaffolded project. */
export interface ProjectSettings {
  /** npm package name for the root package.json. */
  readonly name: string;
  /** Alchemy Stack name: PascalCase, used to name deployed resources. */
  readonly stackName: string;
  readonly packageManager: PackageManager;
  readonly packageManagerVersion: string;
  /** The template's dependency catalog (package name → exact version). */
  readonly catalog: Readonly<Record<string, string>>;
}

export type PackageJson = Record<string, unknown>;

/** The template's Stack name in alchemy.run.ts, replaced per project. */
export const templateStackName = "EffectAlchemyApp";
/** The template's root package name and README title, replaced per project. */
export const templatePackageName = "effect-alchemy-app";

const workspaceGlobs = ["apps/*", "packages/*"];
const trustedDependencies = ["esbuild", "workerd"];

/** Turns a directory name into a valid npm package name. */
export const toPackageName = (directoryName: string): string => {
  const name = directoryName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[._-]+|[-]+$/g, "");
  return name.length > 0 ? name : "effect-alchemy-app";
};

/** Turns a package name into a PascalCase Alchemy Stack name. */
export const toStackName = (packageName: string): string => {
  const pascal = packageName
    .split(/[^a-zA-Z0-9]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join("");
  if (pascal.length === 0) return templateStackName;
  return /^[0-9]/.test(pascal) ? `App${pascal}` : pascal;
};

/**
 * Reads the `catalog:` block of the template's pnpm-workspace.yaml. Only the flat
 * `name: version` form the template uses is supported.
 */
export const parseCatalog = (workspaceYaml: string): Record<string, string> => {
  const catalog: Record<string, string> = {};
  let inCatalog = false;
  for (const line of workspaceYaml.split("\n")) {
    if (/^\S/.test(line)) {
      inCatalog = line.trim() === "catalog:";
      continue;
    }
    if (!inCatalog) continue;
    const match = /^\s+("?)([^"\s:]+(?:\/[^"\s:]+)?)\1:\s*"?([^"\s#]+)"?/.exec(line);
    if (match?.[2] && match[3]) catalog[match[2]] = match[3];
  }
  return catalog;
};

/** Root package.json: name, packageManager, workspaces, and scripts for the chosen manager. */
export const rootPackageJson = (pkg: PackageJson, settings: ProjectSettings): PackageJson => {
  const { packageManager: pm, catalog } = settings;
  const scripts = mapValues(asStringRecord(pkg["scripts"]), (script) => rewriteScript(script, pm));
  const base: PackageJson = {
    ...pkg,
    name: settings.name,
    packageManager: `${pm}@${settings.packageManagerVersion}`,
    scripts,
  };
  switch (pm) {
    case "pnpm":
      return base;
    case "bun":
      return {
        ...base,
        workspaces: { packages: workspaceGlobs, catalog },
        overrides: { effect: requireVersion(catalog, "effect") },
        trustedDependencies,
      };
    case "npm":
      return {
        ...resolveDependencies(base, settings),
        workspaces: workspaceGlobs,
        overrides: { effect: requireVersion(catalog, "effect") },
      };
  }
};

/** A workspace package's package.json: npm lacks `catalog:` and `workspace:` protocols. */
export const workspacePackageJson = (pkg: PackageJson, settings: ProjectSettings): PackageJson =>
  settings.packageManager === "npm" ? resolveDependencies(pkg, settings) : pkg;

/** Rewrites a root script's pnpm-specific commands for the chosen manager. */
export const rewriteScript = (script: string, pm: PackageManager): string =>
  pm === "pnpm"
    ? script
    : script.replace(/\bpnpm ([a-z][\w:-]*)/g, (_, name: string) => runCommand(pm, name));

/**
 * Rewrites `pnpm …` commands in prose (README, AGENTS.md) for the chosen manager.
 * Arguments end at a double space, so trailing `# comments` in code blocks survive.
 */
export const rewriteCommands = (text: string, pm: PackageManager): string => {
  if (pm === "pnpm") return text;
  return text.replace(
    /\bpnpm ([a-z][\w:-]*)((?: (?!#)[^\s`]+)*)/g,
    (_, command: string, rest: string) => {
      if (command === "install" || command === "i") return installCommand(pm) + rest;
      if (command === "exec") {
        const [binary = "", ...args] = rest.trim().split(" ");
        return [execCommand(pm, binary), ...args].join(" ");
      }
      if (command === "run") {
        const [script = "", ...args] = rest.trim().split(" ");
        return runCommand(pm, script, args.join(" "));
      }
      return runCommand(pm, command, rest);
    },
  );
};

/** Replaces the template's project name and Stack name in a text file. */
export const renameProject = (text: string, settings: ProjectSettings): string =>
  text
    .replaceAll(`"${templateStackName}"`, `"${settings.stackName}"`)
    .replaceAll(`# ${templatePackageName}`, `# ${settings.name}`);

const dependencyFields = [
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "optionalDependencies",
];

const resolveDependencies = (pkg: PackageJson, settings: ProjectSettings): PackageJson => {
  const resolved: PackageJson = { ...pkg };
  for (const field of dependencyFields) {
    const deps = pkg[field];
    if (deps === undefined) continue;
    resolved[field] = mapValues(asStringRecord(deps), (range, name) => {
      if (range === "catalog:") return requireVersion(settings.catalog, name);
      if (range.startsWith("workspace:")) return "*";
      return range;
    });
  }
  return resolved;
};

const requireVersion = (catalog: Readonly<Record<string, string>>, name: string): string => {
  const version = catalog[name];
  if (version === undefined) {
    throw new Error(`"${name}" is used as "catalog:" but missing from the template catalog.`);
  }
  return version;
};

const asStringRecord = (value: unknown): Record<string, string> => {
  const record: Record<string, string> = {};
  if (typeof value === "object" && value !== null) {
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === "string") record[key] = entry;
    }
  }
  return record;
};

const mapValues = (
  record: Record<string, string>,
  f: (value: string, key: string) => string,
): Record<string, string> =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [key, f(value, key)]));
