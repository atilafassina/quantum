// #!/usr/bin/env node

import path from "path";
import { fileURLToPath } from "url";
import tauri from "@tauri-apps/cli";
import { intro, outro, text, log, confirm } from "@clack/prompts";
import { scaffoldRawFiles } from "./lib/scaffold-raw-files.js";
import { createFile } from "./lib/create-file.js";
import { tauriConf } from "./lib/templates/tauri-conf.js";
import { capabilities } from "./lib/templates/capabilities.js";
import { cargoToml } from "./lib/templates/cargo-toml.js";
import { mainRs } from "./lib/templates/main-rs.js";
import { releaseAction } from "./lib/templates/release-action.js";

const DEFAULT_KEY_PATH = (name: string) => `~/.tauri/keys/${name}.key`;

export async function run() {
  const bundlePath = path.resolve(fileURLToPath(import.meta.url), "..");

  intro(`Creating your Quantum app`);

  log.info(bundlePath);

  const name = (await text({
    initialValue: "your-new-quantum-app",
    message: "What is the name of your app?",
    placeholder: "Not sure",
    validate(value: string | symbol) {
      const regex = /^[a-zA-Z_-]+$/;

      if (typeof value === "symbol") {
        return `Value must be a string!`;
      }
      if (value.length === 0) {
        return `Value is required!`;
      }

      return regex.test(value)
        ? void 0
        : `Only numbers, letters, '-' and '_' are allowed`;
    },
  })) as string;

  const destinationDir = process.cwd() + "/" + name;

  const identifier = (await text({
    initialValue: `com.you.${name.replaceAll("-", "")}`,
    message: "What is the identifier of your app?",
    placeholder: "com.yourcompany.yourapp",
    validate(value: string | symbol) {
      if (typeof value === "symbol") {
        return `Value must be a string!`;
      }
      if (value.length === 0) {
        return `Value is required!`;
      }
    },
  })) as string;

  const signingIdentity = (await text({
    initialValue: "-",
    message: "What is your Apple Developer ID? (used as `signingIdentity`)",
    placeholder: `ABC123XYZ9.${identifier}`,
  })) as string;

  const cnOrg = (await text({
    message:
      "For setting auto-updates, we need your org. name at CrabNebula.cloud.",
    placeholder: "Your Organization",
    initialValue: "",
  })) as string | undefined;

  const shouldGeneratePubKey = await confirm({
    message: "Do you want to generate a public key?",
    initialValue: false,
  });

  let pubKeyPath: string;

  if (shouldGeneratePubKey && cnOrg) {
    log.step(
      `This will generate a public key + a private key and a password for the private key`
    );

    pubKeyPath = (await text({
      message: "What is the path of your public key?",
      placeholder: DEFAULT_KEY_PATH(name),
      initialValue: DEFAULT_KEY_PATH(name) + ".pub",
    })) as string;

    await tauri.run(["signer", "generate", "-w", pubKeyPath], null);

    log.warn(
      `Remember to set TAURI_SIGNING_PRIVATE_KEY and TAURI_SIGNING_PRIVATE_KEY_PASSWORD in your repository settings`
    );
  } else if (cnOrg) {
    log.warn("If you don't have a public key, we can't setup auto-updates.");

    pubKeyPath = (await text({
      message: "What is the path of your public key?",
      placeholder: DEFAULT_KEY_PATH(name),
    })) as string;
  } else {
    pubKeyPath = "";
  }

  log.step(`Generating your Quantum app!`);

  try {
    await scaffoldRawFiles(
      path.resolve(bundlePath, "raw-template-files"),
      destinationDir
    );

    await Promise.all([
      createFile(
        path.resolve(destinationDir, "src-tauri", "tauri.conf.json"),
        tauriConf({
          name,
          identifier,
          signingIdentity,
          pubKey: pubKeyPath,
          cnOrg,
        })
      ),

      createFile(
        path.resolve(destinationDir, "src-tauri", "capabilities", "main.json"),
        capabilities({ hasAutoupdater: Boolean(pubKeyPath) && Boolean(cnOrg) })
      ),

      createFile(
        path.resolve(destinationDir, "src-tauri", "Cargo.toml"),
        cargoToml({
          name,
          hasAutoupdater: Boolean(pubKeyPath) && Boolean(cnOrg),
        })
      ),

      createFile(
        path.resolve(destinationDir, "src-tauri", "src", "main.rs"),
        mainRs({ name })
      ),

      createFile(
        path.resolve(destinationDir, ".github", "workflows", "release.yaml"),
        releaseAction({ name, org: cnOrg })
      ),
    ]);

    log.message("Yay! 🎉");

    outro(`Happy building!`);
  } catch (e) {
    log.error("Failed to generate the template");

    if (typeof e === "string") {
      log.message(e);
    }

    outro(`If you think the error is with the CLI, please create an issue.`);
  }
}

run();
