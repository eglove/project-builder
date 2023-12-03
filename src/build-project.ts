import * as fs from 'node:fs';

import { rimraf } from 'rimraf';
import tsup from 'tsup';

export async function buildProject(
  publishDirectory: string,
  tsupOptions: tsup.Options,
  tsConfigOverrides?: Record<string, unknown>,
) {
  await rimraf(publishDirectory);

  // if (tsConfigOverrides === undefined) {
  //   runCommand(`tsc --project tsconfig.json`);
  // } else {
  //   const tsConfigString = fs.readFileSync('tsconfig.json', {
  //     encoding: 'utf8',
  //   });
  //   const originalTsConfig = JSON.parse(tsConfigString);
  //
  //   const merged = deepMerge(originalTsConfig, tsConfigOverrides);
  //   fs.writeFileSync('tsconfig.build.json', JSON.stringify(merged, null, 2));
  //
  //   await gitUpdate('Generate tsConfig');
  //
  //   runCommand('tsc --project tsconfig.build.json');
  // }

  await tsup.build({
    dts: { entry: tsupOptions.entry },
    format: ['cjs', 'esm'],
    minify: true,
    sourcemap: true,
    ...tsupOptions,
  });

  fs.copyFileSync('package.json', `${publishDirectory}/package.json`);
}
