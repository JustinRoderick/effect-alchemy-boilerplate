import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";

import ApiWorker from "./apps/api/src/ApiWorker.ts";

/**
 * `alchemy dev` keeps state on disk (.alchemy/), so it runs with no cloud setup.
 * Deploys keep state in your Cloudflare account, so CI and teammates share it.
 */
const state = Layer.unwrap(
  Effect.gen(function* () {
    const { dev } = yield* Alchemy.AlchemyContext;
    return dev ? Alchemy.localState() : Cloudflare.state();
  }),
);

// Composition root: name the Stack, pick providers and state, wire units, return outputs.
// Resources and runtime code live in apps/*; if this file grows, something is missing a home.
export default Alchemy.Stack(
  "EffectAlchemyApp",
  { providers: Cloudflare.providers(), state },
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const api = yield* ApiWorker;

    const web = yield* Cloudflare.Website.Vite("Web", {
      rootDir: path.resolve(import.meta.dirname, "apps/web"),
      env: { VITE_API_URL: api.url.as<string>() },
    });

    return {
      apiUrl: api.url.as<string>(),
      webUrl: web.url.as<string>(),
    };
  }),
);
