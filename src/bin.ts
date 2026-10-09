#!/usr/bin/env node
import * as NodeRuntime from "@effect/platform-node/NodeRuntime";
import * as NodeServices from "@effect/platform-node/NodeServices";
import * as Command from "effect/cli/Command";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Path from "effect/Path";

import packageJson from "../package.json" with { type: "json" };
import { cli } from "./cli.ts";
import * as Scaffold from "./Scaffold.ts";

// The template and docs ship beside src/ (dev) and dist/ (published), one level up.
const layerScaffold = Layer.unwrap(
  Effect.gen(function* () {
    const path = yield* Path.Path;
    return Scaffold.layer({
      templateDir: yield* path.fromFileUrl(new URL("../template", import.meta.url)),
      docsDir: yield* path.fromFileUrl(new URL("../docs", import.meta.url)),
    });
  }).pipe(Effect.orDie),
);

Command.run(cli, { version: packageJson.version }).pipe(
  Effect.provide(layerScaffold.pipe(Layer.provideMerge(NodeServices.layer))),
  NodeRuntime.runMain,
);
