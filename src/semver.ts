import chalk from "chalk";
import inquirer from "inquirer";
import isNil from "lodash/isNil.js";
import fs from "node:fs";

import { runCommand } from "./run-command.ts";

export const semver = async (publishDirectory?: string) => {
  console.info(chalk.bgRed.white(`Publishing dir: ${isNil(publishDirectory)
    ? "."
    : publishDirectory}`));
  // @ts-expect-error ignore bad type
  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      choices: [
        "patch",
        "minor",
        "major",
        "no-publish",
      ],
      message: "SemVer",
      name: "choice",
      type: "list",
    },
  ]);

  if ("no-publish" === choice) {
    return;
  }

  runCommand(`npm version ${choice}`);

  if (isNil(publishDirectory)) {
    runCommand("npm publish --access public");
  } else {
    fs.copyFileSync(
      "package.json",
      `${publishDirectory}/package.json`,
    );
    runCommand(`cd ${publishDirectory} && npm publish --access public && cd ..`);
  }
};
