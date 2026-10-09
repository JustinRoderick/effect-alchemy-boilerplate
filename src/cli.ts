import * as Argument from "effect/cli/Argument";
import * as CliError from "effect/cli/CliError";
import * as Command from "effect/cli/Command";
import * as Flag from "effect/cli/Flag";
import * as Prompt from "effect/cli/Prompt";
import * as Config from "effect/Config";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

import * as PackageManager from "./PackageManager.ts";
import * as Scaffold from "./Scaffold.ts";

const directory = Argument.String("directory").pipe(
  Argument.withDescription("Where to create the project (must be new or empty)"),
  Argument.withFallbackPrompt(Prompt.String({ message: "Project directory", default: "my-app" })),
);

const packageManager = Flag.Literals("pm", PackageManager.packageManagers).pipe(
  Flag.withDescription(
    "Package manager to set the project up for. Defaults to the one running this command (bunx, pnpm dlx, npx), else pnpm.",
  ),
  Flag.optional,
);

const install = Flag.Boolean("install").pipe(
  Flag.withDescription("Install dependencies after scaffolding (--no-install to skip)"),
  Flag.withDefault(true),
);

const git = Flag.Boolean("git").pipe(
  Flag.withDescription("Initialize a git repository with a first commit (--no-git to skip)"),
  Flag.withDefault(true),
);

const userAgent = Config.String("npm_config_user_agent").pipe(Config.withDefault(""));

export const cli = Command.make(
  "create-effect-alchemy",
  { directory, packageManager, install, git },
  Effect.fn("cli")(function* (input) {
    const launchedBy = PackageManager.fromUserAgent(yield* userAgent);
    const chosen = Option.getOrElse(input.packageManager, () =>
      Option.match(launchedBy, { onNone: () => "pnpm" as const, onSome: (pm) => pm.name }),
    );
    const scaffold = yield* Scaffold.Scaffold;
    const result = yield* scaffold
      .create({
        directory: input.directory,
        packageManager: chosen,
        packageManagerVersion: launchedBy.pipe(
          Option.filter((pm) => pm.name === chosen),
          Option.map((pm) => pm.version),
        ),
        install: input.install,
        git: input.git,
      })
      // The CLI renders UserError messages itself, without a stack trace.
      .pipe(
        Effect.mapError(
          (error) => new CliError.UserError({ cause: error, userMessage: error.message }),
        ),
      );

    const pm = result.settings.packageManager;
    const steps = [
      `cd ${input.directory}`,
      ...(result.installed ? [] : [PackageManager.installCommand(pm)]),
      PackageManager.runCommand(pm, "dev"),
    ];
    yield* Console.log(
      [
        "",
        `Created ${result.settings.name} in ${result.directory}`,
        "",
        "Next steps:",
        ...steps.map((step) => `  ${step}`),
        "",
        `Deploy to Cloudflare with ${PackageManager.runCommand(pm, "deploy")} (log in first: ${PackageManager.execCommand(pm, "alchemy profile edit --add Cloudflare")}).`,
        "Conventions and architecture: docs/README.md",
        "",
      ].join("\n"),
    );
  }),
).pipe(Command.withDescription("Scaffold a full-stack Effect + Alchemy app on Cloudflare"));
