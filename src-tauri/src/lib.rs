mod file;
mod git;
mod utils;
use file::{get_files_name, get_files_path_deep, read_file_content};
use std::fs;
use utils::{get_name, get_path, get_path_str};

#[tauri::command]
fn git_set_user(data: &str) -> bool {
    let path = get_path_str("../data/user.json");
    let result = fs::write(path, data);
    if result.is_ok() {
        println!("[git_set_user] Write successful!");
        return true;
    } else {
        println!("[git_set_user] Write failed: {:?}", result);
        return false;
    }
}

#[tauri::command]
fn git_get_user() -> String {
    let path = get_path_str("../data/user.json");

    match fs::read_to_string(path) {
        Ok(content) => {
            return content;
        }
        Err(err) => {
            eprintln!("[git_get_user] Error reading file: {:?}", err);
            return String::new();
        }
    }
}

#[tauri::command]
fn git_clone(url: &str) -> String {
    let name = get_name(url);
    let path = get_path_str(&format!("../templates/{}", name));
    let success = git::clone(url, &path);

    if success {
        println!("[git_clone] successful!");
        format!("ok")
    } else {
        println!("[git_clone] failed!");
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
            read_file,
            git_set_user,
            git_get_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
