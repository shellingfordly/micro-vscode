mod file;
mod git;
mod utils;
use file::{get_files_name, get_files_path_deep};

#[tauri::command]
fn git_clone(url: &str) -> String {
    let name = utils::get_name(url);
    let path = utils::get_path(&format!("../templates/ {}", name));
    let success = git::clone(url, path);

    format!("clone {} is [{}]", name, success)
}

#[tauri::command]
fn git_pull(url: &str, name: &str) -> String {
    let path: &str = utils::get_path(&format!("../templates/ {}", name));
    git::pull(url, path);
    format!("pull {}", name)
}

#[tauri::command]
fn get_projects() -> Result<Vec<String>, String> {
    let base_dir: std::path::PathBuf = std::env::current_dir().unwrap();
    let path: &str = utils::get_path(&format!("../templates/"));
    let dir_path = base_dir.join(path);
    get_files_name(dir_path.canonicalize().unwrap())
}

#[tauri::command]
fn get_files(name: String) -> Result<Vec<String>, String> {
    let base_dir = std::env::current_dir().unwrap();
    let path: &str = utils::get_path(&format!("../templates/{}", name));
    let dir_path = base_dir.join(path);
    get_files_path_deep(dir_path.canonicalize().unwrap())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            git_clone,
            git_pull,
            get_files,
            get_projects
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
