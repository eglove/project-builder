import isNil from "lodash/isNil.js";
import { readFileSync, writeFileSync } from "node:fs";

import { gitUpdate } from "./git-update.ts";
import { runCommand } from "./run-command.js";

export const updatePeerDependencies = async (
  ignorePeerDependencies?: readonly string[],
) => {
  const packageJson = readFileSync("package.json", { encoding: "utf8" }),
    packageObject = JSON.parse(packageJson) as {
      dependencies: Record<string, unknown>;
      peerDependencies: Record<string, unknown>;
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
    `${JSON.stringify(packageObject, null, 2)}\n`,
    "utf8",
  );

  runCommand("pnpx update-browserslist-db");
  await gitUpdate("Peer Dependency Update");
};
