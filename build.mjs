import { rimraf } from 'rimraf'
import { execSync } from 'child_process'
import tsup from 'tsup'
import fs from 'node:fs'
import inquirer from 'inquirer'
import { simpleGit } from 'simple-git'

const git = simpleGit()
const status = await git.status();

if (!status.isClean()) {
  console.error('Commit your changes!')
  process.exit();
}

await rimraf('dist')

execSync('tsc --project tsconfig.json')

await tsup.build({
  bundle: true,
  minify: true,
  outDir: 'dist',
  format: ['cjs', 'esm'],
  entry: ['src/*'],
})

const { semver } = await inquirer.prompt([
  {
    choices: ['patch', 'minor', 'major', 'no-publish'],
    message: 'SemVer',
    name: 'semver',
    type: 'list',
  },
])

if (semver !== 'no-publish') {
  execSync(`npm version ${semver}`)
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
packageJson.peerDependencies = packageJson.dependencies
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')

const peerDepStatus = await git.status();
if (!peerDepStatus.isClean()) {
  await git.add('.')
  await git.add('Peer Dependency Update')
}

fs.copyFileSync(
  'package.json',
  'dist/package.json',
)

if (semver !== 'no-publish') {
  execSync('cd dist && npm publish --access public && cd ..')
}

const finalStatus = await git.status();
if (!finalStatus.isClean()) {
  await git.push();
}
