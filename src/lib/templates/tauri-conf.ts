interface TauriConfParams {
  name: string;
  identifier: string;
  signingIdentity: string;
  pubKey?: string;
  cnOrg?: string;
}
export function tauriConf({
  name,
  identifier,
  signingIdentity,
  pubKey,
  cnOrg,
}: TauriConfParams): string {
  const shouldHaveAutoupdate = Boolean(pubKey) && Boolean(cnOrg);
  return JSON.stringify(
    {
      $schema: "../node_modules/@tauri-apps/cli/schema.json",
      productName: name,
      identifier: identifier,
      build: {
        beforeDevCommand: "pnpm dev",
        devUrl: "http://localhost:3000",
        beforeBuildCommand: "pnpm build",
        frontendDist: "../.output/public",
      },
      plugins: Boolean(shouldHaveAutoupdate)
        ? {
            updater: {
              endpoints: [
                `https://cdn.crabnebula.app/update/${shouldHaveAutoupdate}/${name}/{{target}}-{{arch}}/{{current_version}}`,
              ],
              pubkey: pubKey,
            },
          }
        : {},
      app: {
        windows: [
          {
            title: name,
            width: 800,
            height: 600,
          },
        ],
        security: {
          csp: null,
        },
        withGlobalTauri: false,
      },
      bundle: {
        createArtifacts: Boolean(shouldHaveAutoupdate),
        macOS: {
          signingIdentity,
        },
        active: true,
        targets: "all",
        icon: [
          "icons/32x32.png",
          "icons/128x128.png",
          "icons/128x128@2x.png",
          "icons/icon.icns",
          "icons/icon.ico",
        ],
      },
    },
    null,
    2
  );
}
