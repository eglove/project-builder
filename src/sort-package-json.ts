import { readFileSync, writeFileSync } from "node:fs";
import { sortPackageJson as sort } from "sort-package-json";

export const sortPackageJson = () => {
  const packageJson = readFileSync(
    "package.json",
    { encoding: "utf8" },
  );

  const sorted = sort(packageJson);

  writeFileSync(
    "package.json",
    sorted,
    "utf8",
  );
};
