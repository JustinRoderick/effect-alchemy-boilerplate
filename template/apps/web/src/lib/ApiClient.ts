import { AppApi } from "@app/contracts/api";
import * as FetchHttpClient from "effect/http/FetchHttpClient";
import * as AtomHttpApi from "effect/reactivity/AtomHttpApi";

/**
 * The app's single API client, derived from the shared contract. `ApiClient.query`
 * and `ApiClient.mutation` return atoms whose types (success and typed errors) come
 * straight from `AppApi`, so the UI can't drift from the server.
 */
export class ApiClient extends AtomHttpApi.Service<ApiClient>()("@app/web/ApiClient", {
  api: AppApi,
  httpClient: FetchHttpClient.layer,
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:1337",
}) {}
