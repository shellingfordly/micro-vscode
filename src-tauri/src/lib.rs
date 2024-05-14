mod file;
mod git;
mod path;
mod project;
mod utils;
use file::read_file_content;
use git::{ChangedFile, CommitItem};
use path::{check_path_and_create, get_path, get_path_str};
use project::{get_project_all_files, get_project_list};
use std::fs;
use utils::{create_res, create_res_err, create_res_ok, get_url_name, Response};

#[tauri::command]
fn git_set_user(data: &str) -> Response<String> {
    let path: String = get_path_str("../data/user.json");

    match fs::write(path, data) {
        Ok(_) => create_res_ok("Write successful!".to_string()),
        Err(err) => create_res_err(format!("Write failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_get_user() -> Response<String> {
    let path = get_path_str("../data/user.json");

    match fs::read_to_string(path) {
        Ok(content) => create_res_ok(content),
        Err(err) => create_res_err(format!("Get user info failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_clone(url: &str) -> Response<String> {
    let name = get_url_name(url);
    let path = get_path_str(&format!("../templates/{}", name));

    check_path_and_create(&path);

    match git::clone(url, &path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git clone failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_pull(name: &str) -> Response<String> {
    let path = get_path_str(&format!("../templates/{}", name));
    match git::pull(&path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git pull failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_status(name: &str) -> Response<Vec<ChangedFile>> {
    let path = get_path_str(&format!("../templates/{}", name));
    match git::git_status(&path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res(vec![], err.to_string()),
    }
}

#[tauri::command]
fn git_add(name: &str, files: Vec<&str>) -> Response<Vec<String>> {
    let path = get_path_str(&format!("../templates/{}", name));

    match git::git_add(&path, files) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res(Vec::new(), err.to_string()),
    }
}

#[tauri::command]
fn git_commit(name: &str, message: &str) -> Response<String> {
    let path = get_path_str(&format!("../templates/{}", name));

    match git::commit(&path, message) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git commit failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_log(name: &str) -> Response<Vec<CommitItem>> {
    let repo_path = get_path_str(&format!("../templates/{}", name));
    match git::git_log(&repo_path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res(vec![], err.to_string()),
    }
}

#[tauri::command]
fn git_push(name: &str) -> Response<String> {
    let path = get_path_str(&format!("../templates/{}", name));

    match git::push(&path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git push failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_reset_head(name: &str, file: &str) -> Response<String> {
    let path = get_path_str(&format!("../templates/{}", name));

    match git::git_reset_head(&path, file) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git push failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_discard_changes(name: &str, path: &str) -> Response<String> {
    let repo_path = get_path_str(&format!("../templates/{}", name));

    match git::git_discard_changes(&repo_path, path) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git discard changes failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn git_diff_commit(name: &str, commit_id: &str) -> Response<String> {
    let repo_path = get_path_str(&format!("../templates/{}", name));

    match git::git_diff_commit(&repo_path, commit_id) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Git discard changes failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn get_projects() -> Response<Vec<String>> {
    match get_project_list(get_path("../templates/")) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res(vec![], err),
    }
}

#[tauri::command]
fn get_project_files(name: String) -> Response<Vec<String>> {
    match get_project_all_files(get_path(&format!("../templates/{}", name))) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res(vec![], err),
    }
}

#[tauri::command]
fn read_file(path: String) -> Response<String> {
    match read_file_content(get_path(&format!("../templates/{}", path))) {
        Ok(data) => create_res_ok(data),
        Err(err) => create_res_err(format!("Read file failed: [{:?}].", err)),
    }
}

#[tauri::command]
fn write_file(path: &str, content: &str) -> Response<String> {
    match fs::write(get_path(&format!("../templates/{}", path)), content) {
        Ok(_) => create_res_ok("Write file successful!".to_string()),
        Err(err) => create_res_err(format!("Write file failed: [{:?}].", err)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            git_clone,
            git_pull,
            git_status,
            git_add,
            git_commit,
            git_log,
            git_push,
            git_reset_head,
            git_discard_changes,
            git_diff_commit,
            read_file,
            write_file,
            get_projects,
            get_project_files,
            git_set_user,
            git_get_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
