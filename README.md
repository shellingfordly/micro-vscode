# micro-vscode

The micro-vscode is a lightweight code editing and submission tool build by [tauri](https://github.com/tauri-apps/tauri). It integrated the basic function of git.

This project is only used for learning.

code is licensed under [MIT](https://github.com/shellingfordly/micro-vscode/blob/main/LICENSE),
words and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Preview

![project_light](./public/readme/project_light.png)

## TodoList

## Features

- [ ] read file system
- [ ] new file
- [ ] new folder
- [ ] search
  - search content
  - search file by name
- [ ] add i18n support
- [ ] add more themes
- [x] Integrated the basic function of git
  - git config - set user/email/github token
  - git add/commit/pull/push/clone - need to set github token
  - view changed files, open file
  - discard changes and all changes
  - git show commit
- [x] Folder directory structure
  - show directory tree
    - file/folder icon
    - used vscode-icons(Not all transplanted)
    - implement opening/closing of folder
  - show file switching tab
    - whether to edit icon tips
    - close file
- [x] Monaco editor
  - used monaco editor
  - file editor/save/save all functions
  - only supports code highlighting for html/js/json/ts/vue

## Development

### In Browser

open http://localhost:1420/

```bash
pnpm run dev
```

### In Tauri Window

```bash
pnpm tauri dev
```

### Build

```bash
pnpm tauri build
```

## Usage

- git clone

![git_clone](./public/readme/git_clone.png)

- git pull / git push

![git_pull](./public/readme/git_pull.png)

- git commit

![git_commit](./public/readme/git_commit.png)

- git log

![git_log](./public/readme/git_log.png)

- set git user

![git_user](./public/readme/git_user.png)

- discard changes

![discard_changes](./public/readme/discard_changes.png)
![discard_all_changes](./public/readme/discard_all_changes.png)

- git diff

![git_diff](./public/readme/git_diff.png)

- editor file

![editor_file](./public/readme/editor_file.png)
