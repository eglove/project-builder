import isNil from "lodash/isNil.js";
import { readFileSync, writeFileSync } from "node:fs";

export const updatePeerDependencies = (
  ignorePeerDependencies?: readonly string[],
) => {
  const packageJson = readFileSync(
    "package.json",
    { encoding: "utf8" },
  );

  const packageObject = JSON.parse(packageJson) as {
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
    `${JSON.stringify(
      packageObject,
      null,
      2,
    )}\n`,
    "utf8",
  );
};
