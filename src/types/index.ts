import type { MenuOption } from 'naive-ui'
import { GitStatus } from '~/constants/enums'

export type MenuItem = MenuOption & {
  type: MenuType
  open: boolean
  children?: MenuItem[]
}

export type MenuType = 'file' | 'dir'

export type GitStageType = 'staged' | 'unstage'

export interface ChangedFile {
  status: GitStatus // 修改状态
  stage: GitStageType // 是否添加到暂存区
  path: string // 相对路径
  fullPath: string // 绝对路径
  name: string // 文件名
}

export interface GitLogInfo {
  id: string
  name: string
  email: string
  message: string
  time: string
}

export interface Response<T = any> {
  status: 'ok' | 'err'
  data: T
  err: string
}
