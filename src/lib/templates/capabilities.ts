import { createFile } from "../create-file.js";

interface CapabilitiesParams {
  hasAutoupdater: boolean;
}

interface HandleCapabilitiesParams extends CapabilitiesParams {
  path: string;
}

function capabilities({ hasAutoupdater = false }: CapabilitiesParams): string {
  const permissions = [
    "dialog:default",
    "dialog:allow-ask",
    "dialog:allow-message",
    "core:event:allow-listen",
    "core:event:default",
  ];

  if (hasAutoupdater) {
    permissions.push("updater:default");
    permissions.push("updater:allow-check");
    permissions.push("updater:allow-download-and-install");
  }

  return JSON.stringify(
    {
      identifier: "main",
      description: "permissions for desktop app",
      local: true,
      windows: ["main"],
      permissions: permissions,
    },
    null,
    2
  );
}

export async function handleCapabilities({
  path,
  ...capabilitiesParams
}: HandleCapabilitiesParams) {
  return createFile(path, capabilities(capabilitiesParams));
}
