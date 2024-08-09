import chalk from "chalk";
import inquirer from "inquirer";
import isNil from "lodash/isNil.js";
import split from "lodash/split.js";
import fs, { readFileSync, writeFileSync } from "node:fs";
import { simpleGit } from "simple-git";

import { botMessage } from "./constants.js";
import { gitUpdate } from "./git-update.js";
import { runCommand } from "./run-command.ts";

const packageJsonString = "package.json";

// eslint-disable-next-line max-lines-per-function,max-statements
export const semver = async (publishDirectory?: string) => {
  const git = simpleGit();
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
    await gitUpdate(botMessage);
    await git.push();
    return;
  }

  const packageJson = readFileSync(
    packageJsonString,
    { encoding: "utf8" },
  );

  const packageObject = JSON.parse(packageJson) as {
    version: string;
  };

  if (isNil(packageObject.version)) {
    throw new Error(`Add version to ${packageJsonString}`);
  }

  let [major, minor, patch] = split(packageObject.version, ".");

  switch (choice) {
    case "major": {
      major = String(Number(major) + 1);
      minor = "0";
      patch = "0";
      break;
    }
    case "minor": {
      minor = String(Number(minor) + 1);
      patch = "0";
      break;
    }
    case "patch": {
      patch = String(Number(patch) + 1);
      break;
    }
  }

  packageObject.version = [major, minor, patch].join(".");

  writeFileSync(
    packageJsonString,
    `${JSON.stringify(
      packageObject,
      null,
      2,
    )}\n`,
    "utf8",
  );

  const newVersion = `v${major}.${minor}.${patch}`;
  await gitUpdate(newVersion);
  await git.push();

  console.log(chalk.blueBright(newVersion));
  runCommand("gh release create");

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
