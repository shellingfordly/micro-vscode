use std::fs;
use std::path::PathBuf;

pub fn get_project_list(dir_path: PathBuf) -> Result<Vec<String>, String> {
    let mut file_name_list = Vec::new();

    if dir_path.is_dir() {
        if let Ok(entries) = fs::read_dir(dir_path.clone()) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path: PathBuf = entry.path();
                    if let Some(file_name) = path.file_name().and_then(|name| name.to_str()) {
                        if !file_name.starts_with('.') {
                            file_name_list.push(file_name.to_string());
                        }
                    }
                }
            }
        } else {
            return Err(format!("Error reading directory: {:?}", &dir_path));
        }
    } else {
        return Err(format!("{:?} is not a directory", dir_path));
    }

    Ok(file_name_list)
}

pub fn get_project_all_files(dir_path: PathBuf) -> Result<Vec<String>, String> {
    let mut file_path_list = Vec::new();

    if dir_path.is_dir() {
        if let Ok(entries) = fs::read_dir(dir_path.clone()) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path: PathBuf = entry.path();
                    if let Some(file_name) = path.file_name().and_then(|name| name.to_str()) {
                        if !file_name.starts_with('.') {
                            if path.is_dir() {
                                if let Ok(files) = get_project_all_files(path) {
                                    file_path_list.extend(files);
                                }
                            } else {
                                file_path_list.push(path.to_string_lossy().into_owned());
                            }
                        }
                    }
                }
            }
        } else {
            return Err(format!("Error reading directory: {:?}", &dir_path));
        }
    } else {
        return Err(format!("{:?} is not a directory", dir_path));
    }

    Ok(file_path_list)
}
