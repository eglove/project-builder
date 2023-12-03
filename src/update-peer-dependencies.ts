import * as fs from 'node:fs';

import { gitUpdate } from './git-update.ts';

export async function updatePeerDependencies() {
  const packageJson = fs.readFileSync('package.json', { encoding: 'utf8' });

  const packageObject = JSON.parse(packageJson);

  // eslint-disable-next-line functional/immutable-data
  packageObject.peerDependencies = packageObject.dependencies;

  fs.writeFileSync(
    'package.json',
    JSON.stringify(packageObject, null, 2) + '\n',
    'utf8',
  );

  await gitUpdate('Peer Dependency Update');
}
