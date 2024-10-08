import type { ReadonlyDeep } from "type-fest";

import fsExtra from "fs-extra";
import attempt from "lodash/attempt.js";
import isError from "lodash/isError.js";
import merge from "lodash/merge.js";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import tsup from "tsup";

import { runCommand } from "./run-command.ts";

// eslint-disable-next-line max-statements
export const buildProject = async (
  publishDirectory: Readonly<string>,
  tsupOptions: ReadonlyDeep<tsup.Options>,
  tsConfigOverrides?: Readonly<Record<string, unknown>>,
) => {
  await fsExtra.remove(publishDirectory);

  if (tsConfigOverrides === undefined) {
    runCommand("tsc --project tsconfig.json");
  } else {
    const tsConfigString = readFileSync(
      "tsconfig.json",
      {
        encoding: "utf8",
      },
    );

    const originalTsConfig = attempt<string>(JSON.parse, tsConfigString);

    if (isError(originalTsConfig)) {
      throw new Error("Failed to parse tsconfig");
    }

    const merged = merge(
      originalTsConfig,
      tsConfigOverrides,
    );

    writeFileSync(
      "tsconfig.build.json",
      JSON.stringify(
        merged,
        null,
        2,
      ),
    );

    runCommand("tsc --project tsconfig.build.json");
  }

  await tsup.build({
    // @ts-expect-error ignore readonly typing
    format: [
      "cjs",
      "esm",
    ],
    minify: true,
    sourcemap: true,
    ...tsupOptions,
  });

  copyFileSync(
    "package.json",
    `${publishDirectory}/package.json`,
  );
};
