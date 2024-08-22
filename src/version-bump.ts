import { runCommand } from "./run-command.ts";

export const scripts = {
  BUILD: "pnpm build",
  DEDUPE: "pnpm dedupe",
  LINT: "pnpm lint",
  TEST: "pnpm test",
  TURBO_CLEAN: "turbo daemon clean",
  UPDATE: "pnpm up -i --latest",
  UPDATE_RECURSIVE: "pnpm up -i -r --latest",
};

const updateBrowsersList = (script: keyof typeof scripts) => {
  if ("UPDATE" === script || "UPDATE_RECURSIVE" === script) {
    runCommand("pnpx update-browserslist-db");
  }
};

export const versionBump = (
  userScripts: readonly (keyof typeof scripts)[],
) => {
  if (0 < userScripts.length) {
    for (const dependencyScript of userScripts) {
      runCommand(scripts[dependencyScript]);
      updateBrowsersList(dependencyScript);
    }
  }
};
