#! /usr/bin/env node

import path from "path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import tauri from "@tauri-apps/cli";
import { intro, outro, text, log, confirm } from "@clack/prompts";
import { scaffoldRawFiles } from "./lib/scaffold-raw-files.js";
import { handleTauriConf } from "./lib/templates/tauri-conf.js";
import { handleCapabilities } from "./lib/templates/capabilities.js";
import { handleCargoToml } from "./lib/templates/cargo-toml.js";
import { handleMainRs } from "./lib/templates/main-rs.js";
import { handleReleaseAction } from "./lib/templates/release-action.js";
import { hasDebugFlag, QUANTUM_ASCII } from "./lib/cli-helpers.js";
import { handleLibRs } from "./lib/templates/lib-rs.js";
import { vice } from "gradient-string";

const DEFAULT_KEY_PATH = (name: string) => `~/.tauri/keys/${name}.key`;

export async function run() {
  console.log(vice.multiline(QUANTUM_ASCII));
  intro("Welcome. Let's get you started. ✨");
  const isDebugMode = hasDebugFlag(process.argv);

  const bundlePath = path.resolve(fileURLToPath(import.meta.url), "..");

  if (isDebugMode) {
    log.warn("Debug mode is enabled");
    log.info(`Bundle path: ${bundlePath}`);
  }

  const name = (await text({
    initialValue: "",
    message: "What is the name of your app?",
    placeholder: "your-new-quantum-app",
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

  const destinationDir = `${process.cwd()}${
    isDebugMode ? "/tmp/" : "/"
  }${name}`;

  log.info(`Creating your app at ${destinationDir}`);

  const identifier =
    ((await text({
      message: "What is the identifier of your app?",
      placeholder: `com.you.${name.replaceAll("-", "")}`,
      validate(value: string | symbol) {
        if (typeof value === "symbol") {
          return `Value must be a string!`;
        }
      },
    })) as string) || `com.you.${name.replaceAll("-", "")}`;

  const signingIdentity = (await text({
    initialValue: "-",
    message: "What is your Apple Developer ID? (used as `signingIdentity`)",
    placeholder: `ABC123XYZ9.${identifier}`,
  })) as string;

  const shouldSetCI = (await confirm({
    message: "Would like to setup a CI workflow with CrabNebula?",
    initialValue: false,
  })) as boolean;

  let cnOrg: string | undefined;
  let keysPath: string | undefined;
  let pubKey: string | undefined;
  let shouldGeneratePubKey: boolean = false;

  if (shouldSetCI) {
    cnOrg = (await text({
      message:
        "For setting auto-updates, we need your org. name at CrabNebula.cloud.",
      placeholder: "Your Organization",
      initialValue: "",
    })) as string | undefined;

    shouldGeneratePubKey = (await confirm({
      message: "Do you want to generate a public key?",
      initialValue: false,
    })) as boolean;

    if (shouldGeneratePubKey && cnOrg) {
      log.step(
        `This will generate a public key + a private key and a password for the private key`
      );

      keysPath = (await text({
        message: "Where would you prefer the keys to be stored?",
        placeholder: DEFAULT_KEY_PATH(name),
        initialValue: DEFAULT_KEY_PATH(name),
      })) as string;

      await tauri.run(["signer", "generate", "-w", keysPath], null);

      pubKey = await readFile(keysPath + ".pub", "utf-8");

      log.warn(
        `Remember to set TAURI_SIGNING_PRIVATE_KEY and TAURI_SIGNING_PRIVATE_KEY_PASSWORD in your repository settings`
      );
    } else if (cnOrg) {
      log.warn("If you don't have a public key, we can't setup auto-updates.");

      pubKey = (await text({
        message: "Please paste the contents of your PubKey?",
        placeholder: "dW50cnVz...JcU5jUDMK",
      })) as string;
    } else {
      pubKey = "";
    }
  } else {
    cnOrg = undefined;
  }

  log.step(`Generating your Quantum app!`);

  try {
    // scaffold needs to happen first to setup the project directories.
    await scaffoldRawFiles(
      path.resolve(bundlePath, "raw-template-files"),
      destinationDir
    );

    await Promise.all([
      handleTauriConf({
        path: path.resolve(destinationDir, "src-tauri", "tauri.conf.json"),
        name,
        identifier,
        signingIdentity,
        pubKey,
        cnOrg,
      }),

      handleCapabilities({
        path: path.resolve(
          destinationDir,
          "src-tauri",
          "capabilities",
          "main.json"
        ),
        hasAutoupdater: Boolean(pubKey) && Boolean(cnOrg),
      }),

      handleCargoToml({
        path: path.resolve(destinationDir, "src-tauri", "Cargo.toml"),
        name,
        hasAutoupdater: Boolean(pubKey) && Boolean(cnOrg),
      }),

      handleMainRs({
        path: path.resolve(destinationDir, "src-tauri", "src", "main.rs"),
        name,
      }),

      handleReleaseAction({
        shouldSetCI,
        path: path.resolve(
          destinationDir,
          ".github",
          "workflows",
          "release.yml"
        ),
        name,
        org: cnOrg,
      }),

      handleLibRs({
        path: path.resolve(destinationDir, "src-tauri", "src", "lib.rs"),
        shouldSetCI,
      }),
    ]);

    log.message("Yay! 🎉");

    outro(`Happy building!`);
  } catch (e) {
    log.error("Failed to generate the template");

    if (typeof e === "string") {
      log.message(e);
    }

    if (isDebugMode) {
      log.info(
        JSON.stringify(
          {
            bundlePath,
            name,
            identifier,
            signingIdentity,
            cnOrg,
            pubKey,
            shouldSetCI,
            keysPath,
            shouldGeneratePubKey,
          },
          null,
          2
        )
      );
    }

    outro(`If you think the error is with the CLI, please create an issue.`);
  }
}

run();
