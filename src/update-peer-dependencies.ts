import * as fs from 'node:fs';

import { isNil } from '@ethang/util/data.js';

import { gitUpdate } from './git-update.ts';

export async function updatePeerDependencies(
  ignorePeerDependencies?: string[],
) {
  const packageJson = fs.readFileSync('package.json', { encoding: 'utf8' });

  const packageObject = JSON.parse(packageJson);

  // eslint-disable-next-line functional/immutable-data
  packageObject.peerDependencies = {
    ...packageObject.dependencies,
  };

  if (!isNil(ignorePeerDependencies)) {
    for (const ignorePeerDependency of ignorePeerDependencies) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete,functional/immutable-data
      delete packageObject.peerDependencies[ignorePeerDependency];
    }
  }

  fs.writeFileSync(
    'package.json',
    JSON.stringify(packageObject, null, 2) + '\n',
    'utf8',
  );

  await gitUpdate('Peer Dependency Update');
}
