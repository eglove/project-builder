import inquirer from "inquirer";
import { simpleGit } from "simple-git";

export async function checkUncommitted () {
  const git = simpleGit();
  const status = await git.status();

  if (!status.isClean()) {
    // @ts-expect-error ignore bad type
    const { isCommiting } = await inquirer.prompt<{ "isCommiting": boolean }>([
      {
        "message": "Commit your changes?",
        "name": "isCommiting",
        "type": "confirm",
      },
    ]);

    if (isCommiting as boolean) {
      await git.add(".");
      await git.commit("Update Commit");
    } else {
      const message = "Make sure to commit before updating.";
      console.error(message);
      throw new Error(message);
    }
  }
}
