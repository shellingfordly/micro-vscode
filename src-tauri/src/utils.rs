use std::env;

pub fn get_path(_path: &str) -> &'static str {
    let current_dir = match env::current_dir() {
        Ok(path) => path.join(_path).to_string_lossy().into_owned(),
        Err(err) => {
            eprintln!("Failed to get current directory: {}", err);
            String::new() // Return an empty string or handle the error differently
        }
    };

    Box::leak(current_dir.into_boxed_str())
}

pub fn get_name(url: &str) -> &str {
    let url = url.trim_end_matches(".git");
    if let Some(last_part) = url.split('/').last() {
        return last_part;
    } else {
        return "";
    }
}
