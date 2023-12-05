import { simpleGit } from 'simple-git';

export async function gitUpdate(commitMessage: string) {
  const status = await simpleGit().status();

  if (status.isClean()) {
    return;
  }

  await simpleGit().add('.');
  await simpleGit().commit(commitMessage);
}
