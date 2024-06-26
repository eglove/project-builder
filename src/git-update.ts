import chalk from "chalk";
import { simpleGit } from "simple-git";

export const gitUpdate = async (commitMessage: string) => {
  const status = await simpleGit().status();

  if (status.isClean()) {
    return;
  }

  console.info(chalk.greenBright(`Committing: ${commitMessage}`));
  await simpleGit().add(".");
  await simpleGit().commit(commitMessage);
};
