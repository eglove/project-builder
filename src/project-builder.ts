import type tsup from "tsup";
import type { ReadonlyDeep } from "type-fest";

import chalk from "chalk";
import isNil from "lodash/isNil.js";
import { simpleGit } from "simple-git";

import { buildProject } from "./build-project.ts";
import { checkUncommitted } from "./check-uncommitted.js";
import { botMessage } from "./constants.js";
import { gitUpdate } from "./git-update.js";
import { runUserScripts } from "./run-user-scripts.ts";
import { semver } from "./semver.ts";
import { sortPackageJson } from "./sort-package-json.js";
import { updatePeerDependencies } from "./update-peer-dependencies.ts";

type ProjectBuilderProperties = ReadonlyDeep<{
  ignorePeerDependencies?: string[];
  isLibrary?: boolean;
  publishDirectory?: string;
  scripts: string[];
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
  sortPackageJson();
  runUserScripts(scripts);

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
