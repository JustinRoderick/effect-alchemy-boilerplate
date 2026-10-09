import * as HttpApi from "effect/http-api/HttpApi";
import * as OpenApi from "effect/http-api/OpenApi";

import { HealthGroup } from "./health.ts";
import { TodosGroup } from "./todos.ts";

/** The whole HTTP API. The Worker implements it; clients derive typed calls from it. */
export class AppApi extends HttpApi.make("app")
  .add(HealthGroup)
  .add(TodosGroup)
  .annotate(OpenApi.Title, "App API") {}
