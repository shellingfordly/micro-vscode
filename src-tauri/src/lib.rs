mod git;
mod utils;

#[tauri::command]
fn gitClone(url: &str) -> String {
    let name = utils::get_name(url);
    let path = utils::get_path(&format!("../templates/ {}", name));
    let success = git::clone(url, path);

    format!("clone {} is [{}]", name, success)
}

#[tauri::command]
fn gitPull(url: &str, name: &str) -> String {
    let path: &str = utils::get_path(&format!("../templates/ {}", name));
    git::pull(url, path);
    format!("pull {}", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![gitClone, gitPull])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
