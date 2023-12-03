import { projectBuilder } from './dist/project-builder.js'

await projectBuilder('project-builder', 'master', {
  preVersionBumpScripts: ['UPDATE', 'PRUNE'],
  postVersionBumpScripts: ['DEDUPE'],
  publishDirectory: 'dist',
  tsupOptions: {
    outDir: 'dist',
    entry: ['src/*'],
    format: ['cjs', 'esm']
  }
})
