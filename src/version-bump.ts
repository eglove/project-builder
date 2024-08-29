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

const postInstall = async (
  script: keyof typeof scripts, _postInstall?: () => Promise<void>,
) => {
  if ("UPDATE" === script || "UPDATE_RECURSIVE" === script) {
    runCommand("pnpx update-browserslist-db");
    await _postInstall?.();
  }
};

export const versionBump = async (
  userScripts: readonly (keyof typeof scripts)[],
  _postInstall?: () => Promise<void>,
) => {
  if (0 < userScripts.length) {
    for (const dependencyScript of userScripts) {
      runCommand(scripts[dependencyScript]);
      // eslint-disable-next-line no-await-in-loop
      await postInstall(dependencyScript, _postInstall);
    }
  }
};
