import type tsup from "tsup";
import type { ReadonlyDeep } from "type-fest";

import chalk from "chalk";
import isNil from "lodash/isNil.js";
import { simpleGit } from "simple-git";

import { buildProject } from "./build-project.ts";
import { checkUncommitted } from "./check-uncommitted.js";
import { botMessage } from "./constants.js";
import { gitUpdate } from "./git-update.js";
import { runCommand } from "./run-command.js";
import { semver } from "./semver.ts";
import { updatePeerDependencies } from "./update-peer-dependencies.ts";
import { type scripts, versionBump } from "./version-bump.ts";

type ProjectBuilderProperties = ReadonlyDeep<{
  ignorePeerDependencies?: string[];
  isLibrary?: boolean;
  postInstall?: () => Promise<void>;
  publishDirectory?: string;
  scripts: (keyof typeof scripts)[];
  tsConfigOverrides?: Record<string, unknown>;
  tsupOptions?: tsup.Options;
}>;

// eslint-disable-next-line max-statements
export const projectBuilder = async (
  projectName: Readonly<string>,
  branch: Readonly<string>,
  options: ProjectBuilderProperties,
) => {
  const {
    ignorePeerDependencies,
    isLibrary,
    postInstall,
    publishDirectory,
    scripts,
    tsConfigOverrides,
    tsupOptions,
  } = options;

  console.info(chalk.white.bgBlue(`Running for ${projectName}`));

  try {
    await checkUncommitted();
  } catch {
    return;
  }

  const git = simpleGit();
  await git.checkout(branch);
  runCommand("pnpx sort-package-json");
  await versionBump(scripts, postInstall);

  if (true === isLibrary) {
    updatePeerDependencies(ignorePeerDependencies);

    if (!isNil(publishDirectory) && !isNil(tsupOptions)) {
      await buildProject(
        publishDirectory,
        tsupOptions,
        tsConfigOverrides,
      );
    }

    await semver(publishDirectory);
  } else {
    await gitUpdate(botMessage);
    await git.push();
  }

  const remote = await simpleGit().listRemote(["--get-url"]);
  console.info(chalk.blueBright(remote));
};
