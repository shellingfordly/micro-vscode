use crate::path::get_path_str;
use serde::{ Deserialize, Serialize };
use std::{ ffi::NulError, fs, ptr::NonNull };
use serde_json::to_string;

pub fn get_url_name(url: &str) -> String {
    let url = url.trim_end_matches(".git");
    if let Some(last_part) = url.split('/').last() {
        return last_part.replace(" ", "");
    } else {
        return String::new();
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserInfo {
    pub username: String,
    pub email: String,
    pub token: String,
}

impl UserInfo {
    pub fn get_field(&self, key: &str) -> Option<String> {
        match key {
            "username" => Some(self.username.clone()),
            "email" => Some(self.email.clone()),
            "token" => Some(self.token.clone()),
            _ => None,
        }
    }
}

pub fn get_user() -> Result<UserInfo, String> {
    let path = get_path_str("../data/user.json");

    let content = fs
        ::read_to_string(&path)
        .map_err(|err| format!("[get_user] Error reading file: {:?}", err))?;

    serde_json
        ::from_str::<UserInfo>(&content)
        .map_err(|err| format!("[get_user] Error deserializing JSON: {:?}", err))
}

pub fn get_user_value(key: &str) -> String {
    let user = match get_user() {
        Ok(user_info) => user_info,
        Err(err) => {
            eprintln!("[get_user_value] Error get_user: {}", err);
            return String::new();
        }
    };

    if let Some(value) = user.get_field(key) {
        return value;
    } else {
        eprintln!("[get_user_value] Error user is not found {}", key);
        return String::new();
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Response<T> {
    status: String,
    data: T,
    err: String,
}

pub fn create_data<T>(data: T) -> Response<T> {
    Response {
        status: "ok".to_string(),
        data,
        err: "".to_string(),
    }
}

pub fn create_error(err: String) -> Response<String> {
    Response {
        status: "err".to_string(),
        data: "".to_string(),
        err,
    }
}
