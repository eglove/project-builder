import { gitUpdate } from './git-update.ts';
import { runCommand } from './run-command.ts';

export const scripts = {
  BUILD: 'pnpm build',
  DEDUPE: 'pnpm dedupe',
  LINT: 'pnpm lint',
  PRUNE: 'pnpm prune',
  TEST: 'pnpm test',
  TURBO_CLEAN: 'turbo daemon clean',
  UPDATE: 'pnpm up -i --latest',
  UPDATE_RECURSIVE: 'pnpm up -i -r --latest',
};

export async function versionBump(
  preVersionBumpScripts: (keyof typeof scripts)[],
  postVersionBumpScripts: (keyof typeof scripts)[],
) {
  if (preVersionBumpScripts.length > 0) {
    for (const dependencyScript of preVersionBumpScripts) {
      runCommand(scripts[dependencyScript]);
    }
  }

  if (postVersionBumpScripts.length > 0) {
    for (const postDependencyScript of postVersionBumpScripts) {
      runCommand(scripts[postDependencyScript]);
    }
  }

  await gitUpdate('Version Bump');
}
