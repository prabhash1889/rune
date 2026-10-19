//! Collects every domain's IPC commands. Each domain adds its own lines here.

use crate::app;

pub fn builder() -> tauri_specta::Builder<tauri::Wry> {
    tauri_specta::Builder::new()
        .commands(tauri_specta::collect_commands![app::commands::app_version,])
}

/// Writes the TS bindings the UI imports from `src/ipc/`. Debug builds and tests only.
#[cfg(any(debug_assertions, test))]
pub fn export_bindings(builder: &tauri_specta::Builder<tauri::Wry>) {
    let path = concat!(env!("CARGO_MANIFEST_DIR"), "/../src/ipc/bindings.ts");
    builder
        .export(specta_typescript::Typescript::default(), path)
        .expect("failed to export TS bindings");
}

#[cfg(test)]
mod tests {
    // `pnpm test` runs this, so the committed bindings are always regenerated;
    // CI fails if they differ from what is committed.
    #[test]
    fn export_bindings() {
        super::export_bindings(&super::builder());
    }
}
