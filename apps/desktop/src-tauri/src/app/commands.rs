//! IPC commands of the `app` domain: facts about the running app.

/// Version of the running Rune build.
#[tauri::command]
#[specta::specta]
pub fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_owned()
}
