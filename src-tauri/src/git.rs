use crate::utils::get_user_value;
use git2::{
    Cred,
    FetchOptions,
    PushOptions,
    RemoteCallbacks,
    Repository,
    Signature,
    Status,
    StatusOptions,
    build::CheckoutBuilder,
    Error,
};
use std::path::Path;
use serde::{ Serialize, Deserialize };

pub fn clone(repo_url: &str, local_path: &str) -> Result<String, Error> {
    match Repository::clone(repo_url, local_path) {
        Ok(_) => {
            let success_message = format!(
                "Repository cloned successfully. repo_url: {}, local_path: {}",
                repo_url,
                local_path
            );
            println!("[git_clone] {}", success_message);

            Ok(success_message)
        }
        Err(err) => {
            eprintln!("[git_clone] Error cloning repository: {}", err);
            Err(err)
        }
    }
}

pub fn pull(local_path: &str) -> Result<String, Error> {
    let repo: Repository = match Repository::open(local_path) {
        Ok(repo) => repo,
        Err(err) => {
            eprintln!("[git_pull] Error: {}", err);
            return Err(err);
        }
    };
    let remote_name: &str = "origin";
    let mut remote: git2::Remote = repo
        .find_remote(remote_name)
        .expect("[git_pull] Failed to find remote");

    let callbacks: RemoteCallbacks<'_> = RemoteCallbacks::new();

    let mut fetch_options = FetchOptions::new();
    fetch_options.remote_callbacks(callbacks);

    remote
        .fetch::<&str>(&[], Some(&mut fetch_options), None)
        .expect("[git_pull] Failed to fetch from remote");
    Ok("Successfully pulled from remote.".to_string())
}

pub fn commit(local_path: &str, message: &str) -> Result<String, Error> {
    // 打开本地仓库
    let repo: Repository = Repository::open(local_path).expect(
        "[git_commit] Failed to open repository"
    );
    // 获取索引
    let mut index: git2::Index = repo.index().expect("[git_commit] Failed to open index");

    // 获取仓库状态
    let statuses: git2::Statuses<'_> = repo
        .statuses(None)
        .expect("[git_commit] Failed to get statuses");

    for entry in statuses.iter() {
        let entry_path = entry.path().expect("[git_commit] Failed to get entry path");
        match entry.status() {
            | Status::WT_NEW
            | Status::WT_MODIFIED
            | Status::WT_DELETED
            | Status::WT_RENAMED
            | Status::WT_TYPECHANGE => {
                index
                    .add_path(Path::new(entry_path))
                    .expect("[git_commit] Failed to add file to index");
            }
            _ => {}
        }
    }

    // 写入索引
    index.write().expect("[git_commit] Failed to write index");

    // 创建提交
    let head: git2::Object<'_> = repo
        .revparse_single("HEAD")
        .expect("[git_commit] Failed to get HEAD");
    let tree_id: git2::Oid = index.write_tree().expect("[git_commit] Failed to write tree");
    let tree: git2::Tree<'_> = repo.find_tree(tree_id).expect("[git_commit] Failed to find tree");

    let username = get_user_value("username");
    let email = get_user_value("email");

    let signature: Signature<'_> = Signature::now(&username, &email).expect(
        "[git_commit] Failed to create signature"
    );
    let commit_id: git2::Oid = repo
        .commit(
            Some("HEAD"), // 更新 HEAD
            &signature, // 提交者信息
            &signature, // 提交者信息
            message, // 提交信息
            &tree, // 树对象
            &[&head.as_commit().expect("[git_commit] HEAD is not a commit")] // 父提交对象
        )
        .expect("[git_commit] Failed to create commit");

    println!("[git_commit] New commit created: {}", commit_id);

    Ok(format!("Successfully created commit: {}.", commit_id))
}

pub fn push(local_path: &str) -> Result<String, Error> {
    let repo: Repository = Repository::open(local_path).expect(
        "[git_push] Failed to open repository"
    );
    let remote_name: &str = "origin"; // 远程仓库的名称

    let mut remote: git2::Remote<'_> = repo
        .find_remote(remote_name)
        .expect("[git_push] Failed to find remote");

    let mut push_options: PushOptions<'_> = PushOptions::new();

    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, _username_from_url, _allowed_types| {
        let username = get_user_value("username");
        let token = get_user_value("token");

        // 使用 Token 进行认证
        Cred::userpass_plaintext(&username, &token)
    });

    push_options.remote_callbacks(callbacks);

    // 推送到远程仓库
    remote
        .push(&["refs/heads/main"], Some(&mut push_options))
        .map_err(|err| {
            eprintln!("[git_push] Failed to push to remote: {}", err);
            err
        })
        .ok()
        .map(|_| println!("[git_push] Push successful!"));

    Ok("Successfully push.".to_string())
}

pub fn git_status(local_path: &str) -> Result<Vec<String>, Error> {
    // 打开当前工作目录下的 Git 仓库
    let repo = Repository::open(local_path).expect("[git_status] Failed to open repository");

    // 更新仓库状态
    repo.statuses(None).expect("[git_status] Failed to update repository status");

    // 设置状态选项，用于获取工作目录中的文件状态
    let mut status_opts = StatusOptions::new();
    status_opts.include_ignored(false);
    status_opts.include_untracked(true);

    // 获取工作目录中的文件状态
    let statuses = repo
        .statuses(Some(&mut status_opts))
        .expect("[git_status] Failed to get statuses");

    // 创建一个 Vec 以存储改动的文件路径和状态信息的元组
    let mut changed_files = Vec::new();

    // 遍历并将改动的文件路径和状态信息添加到 Vec 中
    for entry in statuses.iter() {
        if let Some(file_path) = entry.path() {
            let status_str = match entry.status() {
                Status::WT_NEW | Status::INDEX_NEW => "Untracked",
                Status::CONFLICTED => "Conflicted",
                Status::WT_MODIFIED | Status::INDEX_MODIFIED => "Modified",
                Status::WT_RENAMED | Status::INDEX_RENAMED => "Rename",
                Status::WT_DELETED | Status::INDEX_DELETED => "Deleted",
                Status::WT_TYPECHANGE | Status::INDEX_TYPECHANGE => "Typechange",
                _ => "Unknown",
            };
            changed_files.push(format!("{}###{}", status_str, file_path));
        }
    }

    // 返回包含改动文件路径和状态信息的 Vec
    Ok(changed_files)
}

pub fn git_discard_changes(repo_path: &str, file_path: &str) -> Result<String, Error> {
    // 打开仓库
    let repo = Repository::open(repo_path).expect(
        "[git_discard_changes] Failed to open repository"
    );

    let mut checkout_builder = CheckoutBuilder::new();
    checkout_builder.force();

    let mut message = "all files";
    if !file_path.is_empty() {
        message = file_path;
        checkout_builder.path(file_path);
    }

    repo.checkout_index(None, Some(&mut checkout_builder))?;

    let result = format!("Discarded changes for {} successfully.", message);
    println!("[git_discard_changes] {}", result);

    Ok(result)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitItem {
    id: String,
    name: String,
    email: String,
    message: String,
    time: String,
}

pub fn git_log(repo_path: &str) -> Result<Vec<CommitItem>, Error> {
    // 打开 Git 仓库
    let repo = Repository::open(repo_path).expect("[git_log] Failed to open repository");
    let mut commits = Vec::new();

    // 获取提交历史
    // let head = repo.head()?;
    let mut revwalk = repo.revwalk()?;
    revwalk.push_head()?;

    for commit_id in revwalk {
        let commit_id = commit_id?;
        let commit = repo.find_commit(commit_id)?;
        let author = commit.author();
        let message = commit.message().unwrap_or("");
        let commit_time = commit.time().seconds();

        let commit_info = CommitItem {
            id: commit_id.to_string(),
            name: author.name().unwrap_or("").to_string(),
            email: author.email().unwrap_or("").to_string(),
            message: message.to_string(),
            time: commit_time.to_string(),
        };
        commits.push(commit_info);
    }

    Ok(commits)
}
