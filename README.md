# micro-vscode

A lightweight code editing and submission tool. The micro-vscode integrated the basic function of git.

This project is only used for learning.

code is licensed under [MIT](https://github.com/shellingfordly/micro-vscode/blob/main/LICENSE),
words and images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Preview

![project_light](./public/project_light.png)

## Todo List

- [ ] read file system
- [ ] new file
- [ ] new folder
- [ ] update git operation same width vscode
- [ ] search
  - [ ] search content
  - [ ] search file by name

## Features

- Integrated the basic function of git
  - git clone
  - git pull
  - git commit
  - git push
  - set git config username, email and token
- about file
  - view project file
  - editor project file
  - write project file

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

![git_clone](./public/git_clone.png)

- git commit

![git_commit](./public/git_commit.png)

- set git user

![git_user](./public/git_user.png)

- editor file

![editor_file](./public/editor_file.png)
