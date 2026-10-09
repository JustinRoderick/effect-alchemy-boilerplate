import { AppApi } from "@app/contracts/api";
import * as Effect from "effect/Effect";
import * as HttpApiBuilder from "effect/http-api/HttpApiBuilder";

export const layer = HttpApiBuilder.group(AppApi, "health", (handlers) =>
  handlers.handle("check", () => Effect.succeed({ ok: true, service: "api" })),
);
