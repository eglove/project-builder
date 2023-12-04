import fs from 'node:fs';

import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';

import { runCommand } from './run-command.ts';

export async function semver(publishDirectory: string) {
  const status = await simpleGit().status();

  if (status.isClean()) {
    return;
  }

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
    runCommand(`cd ${publishDirectory} && npm publish --access public && cd..`);
  }
}
