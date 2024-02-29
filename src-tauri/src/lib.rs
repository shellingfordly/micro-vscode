mod file;
mod git;
mod utils;
use file::{get_files_name, get_files_path_deep, read_file_content};
use utils::{get_name, get_path, get_path_str};

#[tauri::command]
fn git_clone(url: &str) -> String {
    let name = get_name(url);
    let path = get_path_str(&format!("../templates/{}", name));
    let success = git::clone(url, &path);

    if success {
        format!("ok")
    } else {
        format!("err")
    }
}

#[tauri::command]
fn git_pull(url: &str, name: &str) -> String {
    let path = get_path_str(&format!("../templates/{}", name));
    git::pull(url, &path);
    format!("ok")
}

#[tauri::command]
fn get_projects() -> Result<Vec<String>, String> {
    get_files_name(get_path("../templates/"))
}

#[tauri::command]
fn get_files(name: String) -> Result<Vec<String>, String> {
    get_files_path_deep(get_path(&format!("../templates/{}", name)))
}

#[tauri::command]
fn read_file(name: String) -> String {
    read_file_content(get_path(&format!("../templates/{}", name)))
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
            get_projects,
            read_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
