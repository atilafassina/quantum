<div align="center">
<img src="/docs/quantum-dark-mode.svg#gh-dark-mode-only" width="250" />
<img src="/docs/quantum-dark-mode.svg#gh-light-mode-only" width="250" />
  <h1>Quantum</h1>
  <p>A big leap developing with Tauri + SolidStart + TypeScript.</p>
</div>

## Let's get going! 🐑

```sh
pnpm create quantum
```

```sh
npm create quantum
```

```sh
yarn create quantum
```

## Running 🚤

Once scaffolding is done, you can `cd` into your project, install dependencies and start rocking! 🤘

The snippets below use [PNPM](https://pnpm.io) as the package manager and task runner, but Yarn, NPM, Bun, or Cargo should also work with the appropriate syntax.

> 🛟 Check the [Tauri Docs](https://v2.tauri.app/) for more guidance on building your app.

First step is always to install JavaScript dependencies from the root:

```sh
pnpm install
```

## Desktop (MacOS, Linux, or Windows) 🖥️

Once the template is properly cloned, install Node.js dependencies and you can run the Tauri app.

```sh
pnpm tauri dev
```

## iOS 🍎

<img src="/docs/ios.png" align="right" height="300"/>

[Check the prerequisites](https://v2.tauri.app/guides/prerequisites/#ios) for having iOS ready to run (MacOS only).
Once that is done, let’s create the XCode project:

```sh
pnpm tauri ios init
```

If everything runs successfully (keep an eye for warnings on your terminal).
You can start the development server:

```sh
pnpm tauri ios dev --open
```

This command will open XCode with your project, select the simulator and get ready to run.

## Android 🤖

<img src="/docs/android.png" align="right" height="300"/>

[Android Studio and a few other steps will be required](https://v2.tauri.app/guides/prerequisites/#android) to get things up and running.
Once that's done, you can initialize the project:

```sh
pnpm tauri android init
```

Open the Android Studio, and run the development build:

```sh
pnpm tauri android dev
```

This command will open the Android Pixel simulator.

## Continuous Integration and deployment

This template implements a GitHub Action workflow that builds and publishes the binaries for MacOS, Linux, and Windows. You can check the `.github/workflows/release.yml` file for more details. The draft and publishing of release happens through [CrabNebula Cloud](https://crabnebula.dev/cloud). To fully use this feature you will need to have a CrabNebula account and add the necessary secrets to your repository.

| Key                                  | Description                                                  |
| ------------------------------------ | ------------------------------------------------------------ |
| `CN_API_KEY`                         | The API key for your CrabNebula account.                     |
| `CN_APP_SLUG`                        | The slug of the app you want to publish.                     |
| `TAURI_SIGNING_PRIVATE_KEY`          | The private key used to sign the MacOS and Windows binaries. |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | The password for the private key.                            |

Besides those, in the `tauri.conf.json` it is also important to add a `pubkey` for the auto-updater.

## Build Optimization ⚡

With a few opinionated defaults, Quantum enforces a smaller binary size than stock Tauri templates. Except for some special cases, these work particularly well.

- `panic = "abort"`
  The compiler will abort the program immediately when a panic occurs in production. Without performing any cleanup. Code will execute faster, the tradeoff is you won't get as much information about the panic when it occurs.

- `codegen-units = 1`
  Explicitly tells the compiler to use only one code generation unit during compilation. Code generation units (CGUs) represent individual units of code that the compiler processes independently.

Reducing CGUs to a minimum will potentially reduces memory consumption and leads to faster compilation time. This setting hinders parallelization, so it's worth to benchmark in your particular app.

- `lto = true`
  Link Time Optimization (lto) enables the compiler to make more aggressive optimizations than it can do at the individual file level, resulting in potentially significant performance improvements in the final executable. However, enabling LTO may increase compilation times and require more memory during the linking phase, as the compiler needs to analyze and optimize a larger amount of code.

- `opt-level = "s"`

Specifying the optimization level to be "size-optimized." This option instructs the compiler to prioritize reducing the size of the generated code while still aiming for reasonable performance.

Using `"s"` is a **balanced** optimization. Some apps may find faster compilation times with `opt-level="z"`, though this may bring slower runtime performance as a tradeoff.

- `strip = true`

Stripping symbols from generated code is generally recommended for release builds where binary size is a concern, and debuggability is less critical. It helps produce leaner binaries, which can be beneficial for deployment, distribution, or running in resource-constrained environments. Additionally, it can slightly enhance security because it makes the binaries harder to analyze.

## Suggested VSCode extensions 💡

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://atila.io"><img src="https://avatars.githubusercontent.com/u/2382552?v=4?s=100" width="100px;" alt="Atila Fassina"/><br /><sub><b>Atila Fassina</b></sub></a><br /><a href="#maintenance-atilafassina" title="Maintenance">🚧</a> <a href="https://github.com/atilafassina/quantum/commits?author=atilafassina" title="Code">💻</a> <a href="https://github.com/atilafassina/quantum/commits?author=atilafassina" title="Documentation">📖</a> <a href="https://github.com/atilafassina/quantum/issues?q=author%3Aatilafassina" title="Bug reports">🐛</a> <a href="https://github.com/atilafassina/quantum/commits?author=atilafassina" title="Tests">⚠️</a> <a href="#ideas-atilafassina" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://brendonovich.dev"><img src="https://avatars.githubusercontent.com/u/14191578?v=4?s=100" width="100px;" alt="Brendan Allan"/><br /><sub><b>Brendan Allan</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/commits?author=brendonovich" title="Code">💻</a> <a href="#ideas-brendonovich" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/atilafassina/quantum/issues?q=author%3Abrendonovich" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://erikras.com"><img src="https://avatars.githubusercontent.com/u/4396759?v=4?s=100" width="100px;" alt="Erik Rasmussen"/><br /><sub><b>Erik Rasmussen</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/commits?author=erikras" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/FelipeEmos"><img src="https://avatars.githubusercontent.com/u/10969700?v=4?s=100" width="100px;" alt="Felipe Emos"/><br /><sub><b>Felipe Emos</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/commits?author=felipeemos" title="Code">💻</a> <a href="https://github.com/atilafassina/quantum/issues?q=author%3Afelipeemos" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com/"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/commits?author=JoshuaKGoldberg" title="Documentation">📖</a> <a href="https://github.com/atilafassina/quantum/commits?author=JoshuaKGoldberg" title="Code">💻</a> <a href="#infra-JoshuaKGoldberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://kunalsin9h.com"><img src="https://avatars.githubusercontent.com/u/82411321?v=4?s=100" width="100px;" alt="Kunal Singh"/><br /><sub><b>Kunal Singh</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/commits?author=kunalsin9h" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://eu.virtuaires.com.br/"><img src="https://avatars.githubusercontent.com/u/61759797?v=4?s=100" width="100px;" alt="Vitor Ayres"/><br /><sub><b>Vitor Ayres</b></sub></a><br /><a href="https://github.com/atilafassina/quantum/issues?q=author%3Avasfvitor" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
