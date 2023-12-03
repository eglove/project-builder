import { rimraf } from 'rimraf'
import { execSync } from 'child_process'
import tsup from 'tsup'
import fs from 'node:fs'

await rimraf('dist');

execSync('tsc --project tsconfig.json');

await tsup.build({
  bundle: true,
  minify: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  entry: ['src/*'],
})

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.peerDependencies = packageJson.dependencies;
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8');

fs.copyFileSync(
  'package.json',
  'dist/package.json',
)

execSync('cd dist && npm publish --access public && cd ..')
