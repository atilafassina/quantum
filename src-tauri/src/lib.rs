#[tauri::command]
#[specta::specta]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    let devtools = tauri_plugin_devtools::init();
    let mut builder = tauri::Builder::default();

    let specta_builder =
        tauri_specta::Builder::<tauri::Wry>::new().commands(tauri_specta::collect_commands![greet]);

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(devtools);
    }

    #[cfg(all(debug_assertions, not(mobile)))]
    specta_builder
        .export(
            specta_typescript::Typescript::default()
                .formatter(specta_typescript::formatter::prettier)
                .header("/* eslint-disable */\n"),
            "../src/bindings.ts",
        )
        .expect("failed to export typescript bindings");

    builder
        .plugin(tauri_plugin_shell::init())
        // .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(specta_builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
