import { createFile } from "../create-file.js";

interface ReleaseActionParams {
  name: string;
  org?: string;
}

interface HandleReleaseActionParams extends ReleaseActionParams {
  shouldSetCI: boolean;
  path: string;
}

function releaseAction({ name, org }: ReleaseActionParams) {
  return `
  name: ✨ Publish Release

  on:
    workflow_dispatch:
    push:
      branches: ["main"]

  concurrency:
    group: ${"${{ github.workflow }}-${{ github.ref }}"}
    cancel-in-progress: true

  env:
    APP_CARGO_TOML: src-tauri/Cargo.toml
    CN_APP_SLUG: ${org}/${name}

  jobs:
    draft:
      runs-on: ubuntu-latest
      outputs:
        tag_name: ${"${{ steps.read_version.outputs.value }}"}
      permissions:
        contents: write
      steps:
        - uses: actions/checkout@v4

        - name: Read version number
          uses: SebRollen/toml-action@v1.0.2
          id: read_version
          with:
            file: ${"${{ env.APP_CARGO_TOML }}"}
            field: "package.version"

        - name: Create draft release
          uses: crabnebula-dev/cloud-release@v0
          with:
            command: release draft ${"${{ env.CN_APP_SLUG }}"} ${'"${{ steps.read_version.outputs.value }}"'} --framework tauri
            api-key: ${"${{ secrets.CN_API_KEY }}"}

    build:
      needs: draft
      runs-on: ${"${{ matrix.settings.host }}"}
      strategy:
        fail-fast: false
        matrix:
          settings:
            # MacOS Intel
            # - host: macos-latest
            #  target: x86_64-apple-darwin
            # MacOS Silicon
            - host: macos-latest
              target: aarch64-apple-darwin
            # Windows
            - host: windows-latest
              target: x86_64-pc-windows-msvc
            # Linux
            - host: ubuntu-22.04
              target: x86_64-unknown-linux-gnu
      steps:
        - uses: actions/checkout@v4
        
        - name: Install pnpm
          uses: pnpm/action-setup@v3
          with:
            version: 9

        - name: Use Node.js
          uses: actions/setup-node@v4
          with:
            node-version: "20"
            cache: 'pnpm'
        
        - name: Install stable toolchain
          uses: actions-rust-lang/setup-rust-toolchain@v1
          with:
            toolchain: stable
            cache: false

        - name: install Linux dependencies
          if: matrix.settings.host == 'ubuntu-22.04'
          run: |
            sudo apt-get update
            sudo apt-get install -y webkit2gtk-4.1

        - name: build tauri app
          run: |
            pnpm install
            pnpm run tauri build --ci --target ${"${{ matrix.settings.target }}"}
          env:
            TAURI_SIGNING_PRIVATE_KEY: ${"${{ secrets.TAURI_SIGNING_PRIVATE_KEY }}"}
            TAURI_SIGNING_PRIVATE_KEY_PASSWORD: ${"${{ secrets.TAURI_SIGNING_PRIVATE_KEY_PASSWORD }}"}

        - name: upload assets
          uses: crabnebula-dev/cloud-release@v0
          with:
            command: release upload ${"${{ env.CN_APP_SLUG }}"} "${"${{ steps.read_version.outputs.value }}"}" --framework tauri
            api-key: ${"${{ secrets.CN_API_KEY }}"}

    publish:
      needs: [draft, build]
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4

        - name: publish release
          uses: crabnebula-dev/cloud-release@v0
          with:
            command: release publish ${"${{ env.CN_APP_SLUG }}"} "${"{ needs.draft.outputs.tag_name }}"}" --framework tauri
            api-key: ${"${{ secrets.CN_API_KEY }}"}

      `;
}

export async function handleReleaseAction({
  path,
  shouldSetCI,
  ...releaseActionParams
}: HandleReleaseActionParams) {
  if (shouldSetCI) {
    return createFile(path, releaseAction(releaseActionParams));
  } else {
    return Promise.resolve();
  }
}
