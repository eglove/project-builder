import fs from 'node:fs';

import chalk from 'chalk';
import inquirer from 'inquirer';
import isNil from 'lodash/isNil.js';

import { runCommand } from './run-command.ts';

export async function semver(publishDirectory?: string) {
  console.info(
    chalk.bgRed.white(
      `Publishing dir: ${isNil(publishDirectory) ? '.' : publishDirectory}`,
    ),
  );
  const { semver } = await inquirer.prompt<{ semver: string }>([
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

  if (isNil(publishDirectory)) {
    runCommand('npm publish --access public');
  } else {
    fs.copyFileSync('package.json', `${publishDirectory}/package.json`);
    runCommand(
      `cd ${publishDirectory} && npm publish --access public && cd ..`,
    );
  }
}
