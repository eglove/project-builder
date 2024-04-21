import * as fs from "node:fs";

import merge from "lodash/merge.js";
import { rimraf } from "rimraf";
import tsup from "tsup";
import type { ReadonlyDeep } from "type-fest";

import { gitUpdate } from "./git-update.ts";
import { runCommand } from "./run-command.ts";

// eslint-disable-next-line max-statements
export const buildProject = async (
  publishDirectory: Readonly<string>,

  tsupOptions: ReadonlyDeep<tsup.Options>,
  tsConfigOverrides?: Readonly<Record<string, unknown>>,
) => {
  await rimraf(publishDirectory);

  if (tsConfigOverrides === undefined) {
    runCommand(`tsc --project tsconfig.json`);
  } else {
    const tsConfigString = fs.readFileSync("tsconfig.json", {
      encoding: "utf8",
    });
    const originalTsConfig = JSON.parse(
      tsConfigString,
    ) as typeof tsConfigOverrides;

    const merged = merge(originalTsConfig, tsConfigOverrides);
    fs.writeFileSync("tsconfig.build.json", JSON.stringify(merged, null, 2));

    await gitUpdate("Generate tsConfig");

    runCommand("tsc --project tsconfig.build.json");
  }

  await tsup.build({
    // @ts-expect-error ignore readonly typing
    format: ["cjs", "esm"],
    minify: true,
    sourcemap: true,
    ...tsupOptions,
  });

  fs.copyFileSync("package.json", `${publishDirectory}/package.json`);
};
