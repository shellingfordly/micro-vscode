use dotenv::dotenv;
use git2::{Cred, FetchOptions, PushOptions, RemoteCallbacks, Repository, Signature, Status};
use std::env;
use std::path::Path;

pub fn get_env(key: &str) -> String {
    dotenv().ok();

    let env_str = env::var(key).unwrap_or_else(|_| {
        eprintln!("GitHub Token not set");
        std::process::exit(1);
    });

    return env_str;
}

pub fn clone(repo_url: &str, local_path: &str) -> bool {
    match Repository::clone(repo_url, local_path) {
        Ok(_repo) => {
            println!("Repository cloned successfully");
            return true;
        }
        Err(err) => {
            eprintln!("Error cloning repository: {}", err);
            return false;
        }
    }
}

pub fn pull(repo_url: &str, local_path: &str) {
    let repo: Repository = match Repository::open(local_path) {
        Ok(repo) => repo,
        Err(_) => {
            git2::Repository::clone(repo_url, local_path).expect("Failed to clone from remote")
        }
    };
    let remote_name: &str = "origin";
    let mut remote: git2::Remote = repo
        .find_remote(remote_name)
        .expect("Failed to find remote");

    let callbacks: RemoteCallbacks<'_> = RemoteCallbacks::new();

    let mut fetch_options = FetchOptions::new();
    fetch_options.remote_callbacks(callbacks);

    remote
        .fetch::<&str>(&[], Some(&mut fetch_options), None)
        .expect("Failed to fetch from remote");
}

pub fn commit(local_path: &str) {
    // 打开本地仓库
    let repo: Repository = Repository::open(local_path).expect("Failed to open repository");
    // 获取索引
    let mut index: git2::Index = repo.index().expect("Failed to open index");

    // 获取仓库状态
    let statuses: git2::Statuses<'_> = repo.statuses(None).expect("Failed to get statuses");

    for entry in statuses.iter() {
        let entry_path = entry.path().expect("Failed to get entry path");
        match entry.status() {
            Status::WT_NEW
            | Status::WT_MODIFIED
            | Status::WT_DELETED
            | Status::WT_RENAMED
            | Status::WT_TYPECHANGE => {
                index
                    .add_path(Path::new(entry_path))
                    .expect("Failed to add file to index");
            }
            _ => {}
        }
    }

    // 写入索引
    index.write().expect("Failed to write index");

    // 创建提交
    let head: git2::Object<'_> = repo.revparse_single("HEAD").expect("Failed to get HEAD");
    let tree_id: git2::Oid = index.write_tree().expect("Failed to write tree");
    let tree: git2::Tree<'_> = repo.find_tree(tree_id).expect("Failed to find tree");

    let username = get_env("USER_NAME");
    let email = get_env("USER_EMAIL");

    let signature: Signature<'_> =
        Signature::now(&username, &email).expect("Failed to create signature");
    let commit_id: git2::Oid = repo
        .commit(
            Some("HEAD"),                                        // 更新 HEAD
            &signature,                                          // 提交者信息
            &signature,                                          // 提交者信息
            "rust commit test",                                  // 提交信息
            &tree,                                               // 树对象
            &[&head.as_commit().expect("HEAD is not a commit")], // 父提交对象
        )
        .expect("Failed to create commit");

    println!("New commit created: {}", commit_id);
}

pub fn push(local_path: &str) {
    let repo: Repository = Repository::open(local_path).expect("Failed to open repository");
    let remote_name: &str = "origin"; // 远程仓库的名称

    let mut remote: git2::Remote<'_> = repo
        .find_remote(remote_name)
        .expect("Failed to find remote");

    let mut push_options: PushOptions<'_> = PushOptions::new();

    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, _username_from_url, _allowed_types| {
        let github_token = get_env("GITHUB_TOKEN");
        let username = get_env("USER_NAME");

        // 使用 Token 进行认证
        Cred::userpass_plaintext(&username, &github_token)
    });

    push_options.remote_callbacks(callbacks);

    // 推送到远程仓库
    remote
        .push(&["refs/heads/main"], Some(&mut push_options))
        .map_err(|err| {
            eprintln!("Failed to push to remote: {}", err);
            err
        })
        .ok()
        .map(|_| println!("Push successful!"));
}
