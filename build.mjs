import { projectBuilder } from './dist/project-builder.js'

await projectBuilder('project-builder', 'master', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE', 'LINT'],
  publishDirectory: 'dist',
})
