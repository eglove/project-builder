import { projectBuilder } from "./dist/project-builder.js";

// pnpm tsup src/* --outDir dist --format esm
await projectBuilder("project-builder", "master", {
  scripts: [
    "bun x taze major -I",
    "bun lint",
  ],
  publishDirectory: "dist",
  isLibrary: true,
  tsupOptions: {
    outDir: "dist",
    entry: ["src/*"],
    format: ["esm"],
  }
});
