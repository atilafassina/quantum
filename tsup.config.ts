import { defineConfig } from "tsup";

export default defineConfig({
  name: "create-quantum",
  bundle: false,
  clean: true,
  dts: true,
  entry: ["src/**/*", "!src/**/*.test.*", "!src/raw-template-files/**/*"],
  format: "esm",
  outDir: "bin",
  sourcemap: true,
  onSuccess: "cp -a src/raw-template-files/. bin/raw-template-files",
});
