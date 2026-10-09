import { AppApi } from "@app/contracts/api";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Http from "alchemy/Http";
import * as SQL from "alchemy/SQL/D1";
import * as Effect from "effect/Effect";
import * as HttpRouter from "effect/http/HttpRouter";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";
import * as HttpApiScalar from "effect/http-api/HttpApiScalar";
import * as Layer from "effect/Layer";

import * as AppConfig from "./AppConfig.ts";
import { Database } from "./Database.ts";
import * as HealthHttp from "./health/http.ts";
import * as TodoRepo from "./todos/TodoRepo.ts";
import * as Todos from "./todos/Todos.ts";
import * as TodosHttp from "./todos/http.ts";
import * as WebCrypto from "./WebCrypto.ts";

/**
 * The API Worker. Its outer Effect runs at deploy time (to register bindings and
 * config) and once per cold start (to build the app). `fetch` runs per request.
 * This file is wiring only: business rules live in the domain folders.
 */
export default class ApiWorker extends Cloudflare.Worker<ApiWorker>()(
  "ApiWorker",
  { main: import.meta.url },
  Effect.gen(function* () {
    //
    // 1. Bind infrastructure: registers the D1 binding at deploy, returns a client at runtime.
    //
    const d1 = yield* Cloudflare.D1.QueryDatabase(Database);

    //
    // 2. Read config: anything yielded here is bound into the Worker as a secret.
    //
    const config = yield* AppConfig.fromEnv;

    //
    // 3. Compose the runtime: domain services on top, platform adapters at the bottom.
    //
    const layerRuntime = Layer.empty.pipe(
      Layer.provideMerge(Todos.layer),
      Layer.provideMerge(TodoRepo.layer),
      Layer.provideMerge(SQL.D1Layer(d1)),
      Layer.provideMerge(AppConfig.layer(config)),
      Layer.provideMerge(WebCrypto.layer),
    );

    const fetch = Layer.mergeAll(
      HttpApiBuilder.layer(AppApi, { openapiPath: "/openapi.json" }).pipe(
        Layer.provide([HealthHttp.layer, TodosHttp.layer]),
      ),
      HttpApiScalar.layer(AppApi, { path: "/docs" }),
      HttpRouter.cors({ allowedOrigins: config.allowedOrigins }),
    ).pipe(Layer.provide(layerRuntime), Layer.provide(Http.Platform), HttpRouter.toHttpEffect);

    return { fetch };
  }).pipe(Effect.provide(Cloudflare.D1.QueryDatabaseBinding)),
) {}
