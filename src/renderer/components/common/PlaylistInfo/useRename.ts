import { nextTick, type Ref } from '@common/utils/vueTools'
import { userLists } from '@renderer/store/list/state'
import { updateUserList } from '@renderer/store/list/action'

export default ({ title, listId, input_dom, isRename }: {
  title: Ref<string>
  listId: string
  isRename: Ref<boolean>
  input_dom: Ref<HTMLInputElement | null | undefined>
}) => {
  const handleRename = () => {
    isRename.value = true
    const dom = input_dom.value
    if (!dom) return
    void nextTick(() => {
      dom.querySelector('input')?.focus()
    })
  }

  const handleSaveListName = async() => {
    const targetList = userLists.find(list => list.id === listId)
    if (!targetList) return
    if (title.value.length) await updateUserList([{ ...targetList, name: title.value }])
    isRename.value = false
  }

  return {
    handleSaveListName,
    handleRename,
  }
}
