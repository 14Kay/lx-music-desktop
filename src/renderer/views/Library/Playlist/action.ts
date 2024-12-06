import { playList } from '@renderer/core/player/action'
import { appSetting } from '@renderer/store/setting'
import { userLists } from '@renderer/store/list/state'
import { removeUserList } from '@renderer/store/list/action'
import { dialog } from '@renderer/plugins/Dialog'
import { useI18n } from '@renderer/plugins/i18n'

const t = useI18n()
const randomFrom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const playUserList = (listId: string, count: number) => {
  let index = 0
  if (appSetting['player.togglePlayMethod'] === 'random' || appSetting['player.togglePlayMethod'] === 'singleLoop') {
    index = randomFrom(0, count - 1)
  }
  playList(listId, index)
}

export const removeUserListAction = (id: string, name: string, callback: () => any) => {
  void dialog.confirm({
    message: t('lists__remove_tip', { name }),
    confirmButtonText: t('lists__remove_tip_button'),
  }).then(isRemove => {
    if (!isRemove) return
    const targetList = userLists.find(l => l.id == id)
    if (!targetList) return
    void removeUserList([targetList.id])
    callback()
  })
}
