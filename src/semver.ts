import fs from 'node:fs';

import { isNil } from '@ethang/util/data.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';

import { runCommand } from './run-command.ts';

export async function semver(branch: string, publishDirectory?: string) {
  const diffSummary = await simpleGit()
    .fetch()
    .diffSummary([`origin/${branch}`]);

  if (diffSummary.changed <= 0) {
    return;
  }

  console.info(
    chalk.bgRed.white(
      `Publishing dir: ${isNil(publishDirectory) ? '.' : publishDirectory}`,
    ),
  );
  const { semver } = await inquirer.prompt([
    {
      choices: ['patch', 'minor', 'major', 'no-publish'],
      message: 'SemVer',
      name: 'semver',
      type: 'list',
    },
  ]);

  if (semver === 'no-publish') {
    return;
  }

  runCommand(`npm version ${semver}`);

  if (publishDirectory === undefined) {
    runCommand('npm publish --access public');
  } else {
    fs.copyFileSync('package.json', `${publishDirectory}/package.json`);
    runCommand(
      `cd ${publishDirectory} && npm publish --access public && cd ..`,
    );
  }
}
