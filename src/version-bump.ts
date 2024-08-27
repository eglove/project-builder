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

const postInstall = (
  script: keyof typeof scripts, _postInstall?: () => void,
) => {
  if ("UPDATE" === script || "UPDATE_RECURSIVE" === script) {
    runCommand("pnpx update-browserslist-db");
    _postInstall?.();
  }
};

export const versionBump = (
  userScripts: readonly (keyof typeof scripts)[],
  _postInstall?: () => void,
) => {
  if (0 < userScripts.length) {
    for (const dependencyScript of userScripts) {
      runCommand(scripts[dependencyScript]);
      postInstall(dependencyScript, _postInstall);
    }
  }
};
