import { rimraf } from 'rimraf'
import { execSync } from 'child_process'
import tsup from 'tsup'
import fs from 'node:fs'
import inquirer from 'inquirer'
import { simpleGit } from 'simple-git'

const git = simpleGit()
let status = await git.status()

if (!status.isClean()) {
  console.error('Commit your changes!')
  process.exit()
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
    choices: ['patch', 'minor', 'major'],
    message: 'SemVer',
    name: 'semver',
    type: 'list',
  },
])

execSync(`npm version ${semver}`)
await git.push()

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
packageJson.peerDependencies = packageJson.dependencies
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n', 'utf8')

status = await git.status();
if (status.isClean()) {
  process.exit()
}

await git.add('.')
await git.add('Peer Dependency Update')
await git.push()

fs.copyFileSync(
  'package.json',
  'dist/package.json',
)

execSync('cd dist && npm publish --access public && cd ..')
