import { projectBuilder } from "./dist/project-builder.js";

// pnpm tsup src/* --outDir dist --format esm
await projectBuilder("project-builder", "master", {
  scripts: [
    "pnpm up -i --latest",
    "pnpm dedupe",
    "pnpm lint",
  ],
  publishDirectory: "dist",
  isLibrary: true,
  tsupOptions: {
    outDir: "dist",
    entry: ["src/*"],
    format: ["esm"],
  }
});
