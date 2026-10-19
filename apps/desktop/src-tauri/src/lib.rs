mod app;
mod commands;

pub fn run() {
    let builder = commands::builder();
    #[cfg(debug_assertions)]
    commands::export_bindings(&builder);

    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running Rune");
}
