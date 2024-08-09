import { simpleGit } from "simple-git";

export async function checkUncommitted() {
  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    const message = "Commit changes first.";
    console.error(message);
    throw new Error(message);
  }
}
