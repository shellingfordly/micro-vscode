import { defineStore } from 'pinia'
import { useProjectStore, clearFileContentHistory } from './project'
import { ChangedFile, GitLogInfo, GitStageType } from '~/types'
import { createInvoke } from '~/lib/utils/api'

export const useGitStore = defineStore('useGitStore', () => {
  const projectStore = useProjectStore()
  const changedFiles = ref<ChangedFile[]>([])
  const commitMessage = ref('')
  const loading = ref(false)
  const logList = ref<GitLogInfo[]>([])

  watch([() => projectStore.selectProjectName, () => projectStore.fileChangedCount], updateChangedFiles, {
    immediate: true,
  })

  function getChangeFilesByStageType(stage: GitStageType) {
    return changedFiles.value.filter((f) => stage === f.stage)
  }

  async function updateChangedFiles() {
    const name = projectStore.selectProjectName
    if (!name) return

    const result = await createInvoke<ChangedFile[]>('git_status', { name })
    if (result.status == 'ok') {
      changedFiles.value = result.data.map((item) => ({
        ...item,
        fullPath: name + '/' + item.path,
      }))
    }
  }

  async function updateLogList() {
    if (!projectStore.selectProjectName) return
    const { status, data } = await createInvoke<GitLogInfo[]>('git_log', {
      name: projectStore.selectProjectName,
    })
    if (status === 'ok') {
      logList.value = data
    }
  }

  async function onGitClone(url: string) {
    const { status } = await createInvoke('git_clone', { url })
    return status === 'ok'
  }

  async function onGitAdd(files: ChangedFile[]) {
    const { status } = await createInvoke('git_add', {
      name: projectStore.selectProjectName,
      files: files.map((f) => f.path),
    })
    return status === 'ok'
  }

  async function onGitCommit() {
    if (!projectStore.selectProjectName || !commitMessage.value) return false

    loading.value = true
    const { status } = await createInvoke('git_commit', {
      name: projectStore.selectProjectName,
      message: commitMessage.value,
    })
    loading.value = false

    return status === 'ok'
  }

  async function onGitPull() {
    if (projectStore.selectProjectName) {
      const { status } = await createInvoke('git_pull', {
        name: projectStore.selectProjectName,
      })

      return status === 'ok'
    }
    return false
  }

  async function onGitPush() {
    if (projectStore.selectProjectName) {
      const { status } = await createInvoke('git_push', {
        name: projectStore.selectProjectName,
      })
      return status === 'ok'
    } else {
      return false
    }
  }

  async function onGitResetHead(file = '') {
    const name = projectStore.selectProjectName
    if (!name) return false

    const { status } = await createInvoke('git_reset_head', {
      name,
      file,
    })
    return status === 'ok'
  }

  async function onDiscardChanges(file: ChangedFile) {
    const name = projectStore.selectProjectName
    if (!name) return false

    const { status } = await createInvoke('git_discard_changes', {
      name,
      path: file.path || '',
    })

    var success = status === 'ok'
    if (success) {
      clearFileContentHistory(file.fullPath)

      const hasFileTab = projectStore.fileTabs.findIndex((tab) => tab.value === file.fullPath) !== -1
      if (hasFileTab) {
        projectStore.getFileContent(file.fullPath)
      }
    }

    return success
  }

  return {
    changedFiles,
    commitMessage,
    loading,
    logList,
    onGitAdd,
    onGitPull,
    onGitPush,
    onGitClone,
    onGitCommit,
    onGitResetHead,
    onDiscardChanges,
    updateLogList,
    updateChangedFiles,
    getChangeFilesByStageType,
  }
})
