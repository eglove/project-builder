import isNil from "lodash/isNil.js";
import {readFileSync, writeFileSync} from "node:fs";

import {gitUpdate} from "./git-update.ts";

export const updatePeerDependencies = async (
  ignorePeerDependencies?: readonly string[],
) => {
  const packageJson = readFileSync(
      "package.json",
      {"encoding": "utf8"},
    ),
    packageObject = JSON.parse(packageJson) as {
      "dependencies": Record<string, unknown>;
      "peerDependencies": Record<string, unknown>;
    };

  packageObject.peerDependencies = {
    ...packageObject.dependencies,
  };

  if (!isNil(ignorePeerDependencies)) {
    for (const ignorePeerDependency of ignorePeerDependencies) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete packageObject.peerDependencies[ignorePeerDependency];
    }
  }

  writeFileSync(
    "package.json",
    `${JSON.stringify(
      packageObject,
      null,
      2,
    )}\n`,
    "utf8",
  );

  await gitUpdate("Peer Dependency Update");
};
