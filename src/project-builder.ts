import { isNil } from '@ethang/util/data.js';
import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import type tsup from 'tsup';

import { buildProject } from './build-project.ts';
import { runCommand } from './run-command.js';
import { semver } from './semver.ts';
import { updatePeerDependencies } from './update-peer-dependencies.ts';
import type { scripts } from './version-bump.ts';
import { versionBump } from './version-bump.ts';

type ProjectBuilderProperties = {
  ignorePeerDependencies?: string[];
  isLibrary?: boolean;
  postVersionBumpScripts: (keyof typeof scripts)[];
  preVersionBumpScripts: (keyof typeof scripts)[];
  publishDirectory?: string;
  tsConfigOverrides?: Record<string, unknown>;
  tsupOptions?: tsup.Options;
};

export async function projectBuilder(
  projectName: string,
  branch: string,
  {
    isLibrary,
    ignorePeerDependencies,
    postVersionBumpScripts,
    preVersionBumpScripts,
    publishDirectory,
    tsConfigOverrides,
    tsupOptions,
  }: ProjectBuilderProperties,
) {
  console.info(chalk.white.bgBlue(`Running for ${projectName}`));

  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    console.error('Commit your changes!');
    return;
  }

  await git.checkout(branch);
  await versionBump(preVersionBumpScripts, postVersionBumpScripts);

  if (isLibrary === true) {
    await updatePeerDependencies(ignorePeerDependencies);

    if (!isNil(publishDirectory) && !isNil(tsupOptions)) {
      await buildProject(publishDirectory, tsupOptions, tsConfigOverrides);
    }

    await semver(publishDirectory);
  }

  runCommand('pnpm store prune');

  await simpleGit().push();
  const remote = await simpleGit().listRemote(['--get-url']);
  console.info(chalk.blueBright(remote));
}
