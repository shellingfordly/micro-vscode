use std::fs;
use std::path::PathBuf;

pub fn read_file_content(file_path: PathBuf) -> Result<String, String> {
    // 尝试读取文件内容
    match fs::read_to_string(file_path) {
        Ok(content) => {
            // 读取成功，content 包含文件的内容
            Ok(content)
        }
        Err(err) => Err(format!("Read filed error: [{}]", err)),
    }
}
