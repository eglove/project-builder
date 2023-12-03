import inquirer from 'inquirer';
import { simpleGit } from 'simple-git';

import { runCommand } from './run-command.ts';

export async function publishProject(publishDirectory?: string) {
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
  await simpleGit().push();

  if (publishDirectory === undefined) {
    runCommand('npm publish --access public');
  } else {
    runCommand(`cd ${publishDirectory} && npm publish --access public && cd..`);
  }
}
