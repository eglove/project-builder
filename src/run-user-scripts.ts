import { runCommand } from "./run-command.ts";

export const runUserScripts = (
  userScripts: readonly string[],
) => {
  if (0 < userScripts.length) {
    for (const script of userScripts) {
      runCommand(script);
    }
  }
};
