import {gitUpdate} from "./git-update.ts";
import {runCommand} from "./run-command.ts";

export const scripts = {
  "BUILD": "pnpm build",
  "DEDUPE": "pnpm dedupe",
  "LINT": "pnpm lint",
  "TEST": "pnpm test",
  "TURBO_CLEAN": "turbo daemon clean",
  "UPDATE": "pnpm up -i --latest",
  "UPDATE_RECURSIVE": "pnpm up -i -r --latest",
};

function updateBrowsersList (script: keyof typeof scripts) {
  if ("UPDATE" === script || "UPDATE_RECURSIVE" === script) {
    runCommand("pnpx update-browserslist-db");
  }
}

export async function versionBump (
  preVersionBumpScripts: readonly (keyof typeof scripts)[],
  postVersionBumpScripts: readonly (keyof typeof scripts)[],
) {
  if (0 < preVersionBumpScripts.length) {
    for (const dependencyScript of preVersionBumpScripts) {
      runCommand(scripts[dependencyScript]);
      updateBrowsersList(dependencyScript);
    }
  }

  if (0 < postVersionBumpScripts.length) {
    for (const postDependencyScript of postVersionBumpScripts) {
      runCommand(scripts[postDependencyScript]);
      updateBrowsersList(postDependencyScript);
    }
  }

  await gitUpdate("Version Bump");
}
