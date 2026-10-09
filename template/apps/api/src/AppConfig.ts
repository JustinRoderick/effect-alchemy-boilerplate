import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";

/**
 * Typed configuration the domain reads. Raw `Config` reads happen once, in the
 * Worker's construction phase (`fromEnv`), so Alchemy binds them into the Worker.
 */
export class AppConfig extends Context.Service<
  AppConfig,
  {
    readonly maxTodos: number;
    /** Origins allowed to call the API from a browser. Empty allows any origin. */
    readonly allowedOrigins: ReadonlyArray<string>;
  }
>()("@app/api/AppConfig") {}

export const fromEnv = Config.all({
  maxTodos: Config.Int("MAX_TODOS").pipe(Config.withDefault(100)),
  allowedOrigins: Config.String("ALLOWED_ORIGINS").pipe(
    Config.withDefault(""),
    Config.map((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0),
    ),
  ),
});

export const layer = (config: AppConfig["Service"]) =>
  Layer.succeed(AppConfig, AppConfig.of(config));
