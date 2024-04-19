import fs from "node:fs";

import chalk from "chalk";
import inquirer from "inquirer";
import isNil from "lodash/isNil.js";

import { runCommand } from "./run-command.ts";

export const semver = async (publishDirectory?: string) => {
  console.info(
    chalk.bgRed.white(
      `Publishing dir: ${isNil(publishDirectory) ? "." : publishDirectory}`,
    ),
  );
  const { choice } = await inquirer.prompt<{ choice: string }>([
    {
      choices: ["patch", "minor", "major", "no-publish"],
      message: "SemVer",
      name: "choice",
      type: "list",
    },
  ]);

  if (choice === "no-publish") {
    return;
  }

  runCommand(`npm version ${choice}`);

  if (isNil(publishDirectory)) {
    runCommand("npm publish --access public");
  } else {
    fs.copyFileSync("package.json", `${publishDirectory}/package.json`);
    runCommand(
      `cd ${publishDirectory} && npm publish --access public && cd ..`,
    );
  }
};
