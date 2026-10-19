fn main() {
    // tauri-build embeds the Windows app manifest (Common Controls v6) only into the app
    // binary, so `cargo test` binaries die with STATUS_ENTRYPOINT_NOT_FOUND. Embed it into
    // every linked artifact instead.
    let mut windows = tauri_build::WindowsAttributes::new();
    if std::env::var("CARGO_CFG_TARGET_ENV").as_deref() == Ok("msvc") {
        windows = tauri_build::WindowsAttributes::new_without_app_manifest();
        let manifest =
            std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("windows-app-manifest.xml");
        println!("cargo:rerun-if-changed=windows-app-manifest.xml");
        println!("cargo:rustc-link-arg=/MANIFEST:EMBED");
        println!("cargo:rustc-link-arg=/MANIFESTINPUT:{}", manifest.display());
    }
    tauri_build::try_build(tauri_build::Attributes::new().windows_attributes(windows))
        .expect("failed to run tauri-build");
}
