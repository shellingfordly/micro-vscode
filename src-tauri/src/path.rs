use std::fs;
use std::{ env, path::PathBuf };

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
    let dir_path: PathBuf = base_dir.join(path);

    return dir_path;
    // return dir_path.canonicalize().unwrap();
}

pub fn check_path_and_create(path: &str) {
    if !fs::metadata(path).is_ok() {
        match fs::create_dir_all(path) {
            Ok(_) => println!("[check_path_and_create] Directory created: {}", path),
            Err(err) => eprintln!("[check_path_and_create] Error creating directory: {}", err),
        }
    }
}

// pub fn absolute_to_relative_path(absolute_path: &str, root_path: &str) -> String {
//     let relative_path = absolute_path
//         .strip_prefix(root_path)
//         .expect("[absolute_to_relative_path] Failed to get relative path");

//     return relative_path.to_string();
// }
