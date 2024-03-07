mod file;
mod git;
mod path;
mod project;
mod utils;
use std::fs;
use file::read_file_content;
use path::{ check_path_and_create, get_path, get_path_str };
use project::{ get_project_files_deep, get_project_name };
use utils::get_url_name;

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
    let name = get_url_name(url);
    let path = get_path_str(&format!("../templates/{}", name));

    check_path_and_create(&path);

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
fn git_pull(name: &str) -> String {
    let path = get_path_str(&format!("../templates/{}", name));
    git::pull(&path);
    format!("ok")
}

#[tauri::command]
fn git_commit(name: &str, message: &str) -> String {
    let path = get_path_str(&format!("../templates/{}", name));

    git::commit(&path, message);
    format!("ok")
}

#[tauri::command]
fn git_push(name: &str) -> String {
    let path = get_path_str(&format!("../templates/{}", name));

    git::push(&path);
    format!("ok")
}

#[tauri::command]
fn git_status(name: &str) -> Vec<String> {
    let path = get_path_str(&format!("../templates/{}", name));
    git::git_status(&path)
}

#[tauri::command]
fn get_projects() -> Result<Vec<String>, String> {
    get_project_name(get_path("../templates/"))
}

#[tauri::command]
fn get_project_files(name: String) -> Result<Vec<String>, String> {
    get_project_files_deep(get_path(&format!("../templates/{}", name)))
}

#[tauri::command]
fn read_file(path: String) -> String {
    read_file_content(get_path(&format!("../templates/{}", path)))
}

#[tauri::command]
fn write_file(path: &str, content: &str) -> String {
    match fs::write(get_path(&format!("../templates/{}", path)), content) {
        Ok(_) => { format!("ok") }
        Err(err) => format!("Read filed [{}]", err),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(
            tauri::generate_handler![
                git_clone,
                git_pull,
                git_status,
                git_commit,
                git_push,
                read_file,
                write_file,
                get_projects,
                get_project_files,
                git_set_user,
                git_get_user
            ]
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
