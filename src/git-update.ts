import chalk from 'chalk';
import { simpleGit } from 'simple-git';

export async function gitUpdate(commitMessage: string) {
  const status = await simpleGit().status();

  if (status.isClean()) {
    return;
  }

  await simpleGit().add('.');
  await simpleGit().commit(commitMessage);
  await simpleGit().push();
  const remote = await simpleGit().listRemote(['--get-url']);
  console.info(chalk.blueBright(`Pushed to ${remote}`));
}
