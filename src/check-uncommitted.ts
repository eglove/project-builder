import { simpleGit } from "simple-git";

export const checkUncommitted = async () => {
  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    const message = "Commit changes first.";
    console.error(message);
    throw new Error(message);
  }
};
