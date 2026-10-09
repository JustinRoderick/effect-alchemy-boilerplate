/**
 * Deploys the real Stack and calls it through the typed client.
 *
 * By default this runs against local emulation (workerd + a local D1), the same
 * topology as `alchemy dev`. Set ALCHEMY_TEST_LIVE=1 to deploy to Cloudflare
 * instead (stage `test_$USER`; set NO_DESTROY=1 to keep it afterwards).
 */
import { AppApi } from "@app/contracts/api";
import { assert } from "@effect/vitest";
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Test from "alchemy/Test/Vitest";
import * as Effect from "effect/Effect";
import * as HttpApiClient from "effect/http-api/HttpApiClient";

import Stack from "../../../alchemy.run.ts";

const live = process.env.ALCHEMY_TEST_LIVE === "1";

const { test, beforeAll, afterAll, deploy, destroy } = Test.make({
  providers: Cloudflare.providers(),
  state: Alchemy.localState(),
  dev: !live,
});

const stack = beforeAll(deploy(Stack));
// Local emulation stops with the test process, so only live deploys need tearing down.
afterAll.skipIf(!live || !!process.env.NO_DESTROY)(destroy(Stack));

test(
  "creates, completes, and removes a todo",
  Effect.gen(function* () {
    const { apiUrl } = yield* stack;
    // Waits out workers.dev propagation on live deploys; a failure here fails the test.
    // @effect-diagnostics-next-line anyUnknownInErrorContext:off -- alchemy types this helper's error as unknown
    yield* Test.getWhenReady(`${apiUrl}/health`).pipe(Effect.orDie);
    const client = yield* HttpApiClient.make(AppApi, { baseUrl: apiUrl });

    const created = yield* client.todos.create({ payload: { title: "Deployed" } });
    const updated = yield* client.todos.update({
      params: { id: created.id },
      payload: { completed: true },
    });
    assert.isTrue(updated.completed);

    yield* client.todos.remove({ params: { id: created.id } });
    const error = yield* client.todos.get({ params: { id: created.id } }).pipe(Effect.flip);
    assert.strictEqual(error._tag, "TodoNotFound");
  }),
);
