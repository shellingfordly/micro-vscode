use std::fs;
use std::{env, path::PathBuf};

pub fn get_path_str(path: &str) -> String {
    let path_buf = get_path(path);
    let path_ref = &path_buf;
    if let Some(path_str) = path_ref.to_str() {
        return path_str.to_string();
    } else {
        return String::new();
    }
}

pub fn get_path(path: &str) -> PathBuf {
    let base_dir: std::path::PathBuf = env::current_dir().unwrap();
    let dir_path = base_dir.join(path);

    return dir_path;
}

pub fn check_path_and_create(path: &str) {
    if !fs::metadata(path).is_ok() {
        match fs::create_dir_all(path) {
            Ok(_) => println!("[check_path_and_create] Directory created: {}", path),
            Err(err) => eprintln!("[check_path_and_create] Error creating directory: {}", err),
        }
    }
}
