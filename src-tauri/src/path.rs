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

    return dir_path.canonicalize().unwrap();
}
