import * as HttpApiEndpoint from "effect/http-api/HttpApiEndpoint";
import * as HttpApiGroup from "effect/http-api/HttpApiGroup";
import * as Schema from "effect/Schema";

const HealthStatus = Schema.Struct({
  ok: Schema.Boolean,
  service: Schema.String,
});
export type HealthStatus = typeof HealthStatus.Type;

export const HealthGroup = HttpApiGroup.make("health").add(
  HttpApiEndpoint.get("check", "/health", { success: HealthStatus }),
);
