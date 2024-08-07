import chalk from "chalk";
import {execSync} from "node:child_process";

export const runCommand = (command: string) => {

  console.info(chalk.greenBright(command));
  execSync(
    command,
    {
      "stdio": "inherit",
    },
  );

};
