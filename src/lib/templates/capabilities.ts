interface CapabilitiesParams {
  hasAutoupdater: boolean;
}
export function capabilities({
  hasAutoupdater = false,
}: CapabilitiesParams): string {
  const permissions = [
    "dialog:default",
    "dialog:allow-ask",
    "dialog:allow-message",
    "updater:default",
    "updater:allow-check",
    "updater:allow-download-and-install",
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
