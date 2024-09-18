import { readFileSync, writeFileSync } from "node:fs";
import { sortPackageJson as sort } from "sort-package-json";

export const sortPackageJson = () => {
  const packageJson = readFileSync("package.json", { encoding: "utf8" });
  writeFileSync("package.json", sort(packageJson), "utf8");
};
