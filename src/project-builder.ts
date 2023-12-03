import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import type tsup from 'tsup';

import { buildProject } from './build-project.ts';
import { publishProject } from './publish-project.ts';
import { updatePeerDependencies } from './update-peer-dependencies.ts';
import type { scripts } from './version-bump.ts';
import { versionBump } from './version-bump.ts';

type ProjectBuilderProperties = {
  postVersionBumpScripts: Array<keyof typeof scripts>;
  preVersionBumpScripts: Array<keyof typeof scripts>;
  publishDirectory: string;
  tsConfigOverrides?: Record<string, unknown>;
  tsupOptions: tsup.Options;
};

export async function projectBuilder(
  projectName: string,
  {
    postVersionBumpScripts,
    preVersionBumpScripts,
    publishDirectory,
    tsConfigOverrides,
    tsupOptions,
  }: ProjectBuilderProperties,
) {
  console.info(chalk.white.bgBlue`Running for ${projectName}`);

  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    console.error('Commit your changes!');
    return;
  }

  await versionBump(preVersionBumpScripts, postVersionBumpScripts);
  await updatePeerDependencies();
  await buildProject(publishDirectory, tsupOptions, tsConfigOverrides);
  await publishProject(publishDirectory);
}
