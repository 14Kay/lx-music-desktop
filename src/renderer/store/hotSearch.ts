import { reactive, markRaw } from '@common/utils/vueTools'
// 假设 musicSdk 的类型定义在全局或已正确引入
import music from '@renderer/utils/musicSdk'

// 定义源类型
export type Source = LX.OnlineSource | 'all'

// 定义列表存储结构：键是源ID，值是字符串数组
type SourceListMap = Partial<Record<Source, string[]>>

// 1. 初始化 sources 数组
// 使用 reactive 包装以便界面能感知源的变化（虽然源通常是静态的，但在初始化时动态添加）
// 或者如果源是静态的，直接用普通数组即可。这里保持原逻辑但优化写法。
const rawSources: Source[] = []
const rawSourceList: SourceListMap = {
  all: [], // 初始为空数组
}

// 预先填充数据结构
for (const source of music.sources) {
  // 必须确保类型断言正确，且该源确实支持 hotSearch
  const sourceId = source.id as LX.OnlineSource
  if (!music[sourceId]?.hotSearch) continue

  rawSources.push(sourceId)
  rawSourceList[sourceId] = []
}
rawSources.push('all')

// 导出响应式对象
// 注意：sources 列表通常不会变，可以用 markRaw；
// 但 sourceList 内部的数据会变，外层可以用 reactive，或者保持引用不变修改内部数组
export const sources = markRaw(rawSources)
// 使用 reactive 包裹整个对象，这样 sourceList.kw = [...] 也能触发更新
export const sourceList = reactive<SourceListMap>(rawSourceList)


/**
 * 更新单个源的列表
 */
const setList = (source: Source, list: string[]) => {
  // 截取前 20 个
  const truncatedList = list.slice(0, 20)
  // 赋值给响应式对象
  sourceList[source] = truncatedList
  return truncatedList
}

/**
 * 聚合所有源的热搜词
 */
const setLists = (results: Array<{ source: Source, list: string[] }>): string[] => {
  const wordsMap = new Map<string, number>()

  for (const { list } of results) {
    // 这里的 list 已经是 fetch 下来的新数据了
    for (const item of list) {
      const word = item.trim()
      if (!word) continue
      wordsMap.set(word, (wordsMap.get(word) ?? 0) + 1)
    }
  }

  // 转换为数组并排序
  // 排序规则：出现次数多的在前；次数相同，按字典序排列
  const sortedWords = Array.from(wordsMap.entries()).sort((a, b) => {
    const countDiff = b[1] - a[1]
    if (countDiff !== 0) return countDiff
    return a[0].localeCompare(b[0])
  })

  // 提取词并截取
  const finalWords = sortedWords.map(item => item[0]).slice(0, sources.length * 10)

  // 更新 'all' 的列表
  sourceList.all = finalWords
  return finalWords
}

/**
 * 获取热搜列表
 */
export const getList = async (source: Source): Promise<string[]> => {
  // 如果是 'all'，则并发请求所有源
  if (source === 'all') {
    const promises = sources
      .filter(s => s !== 'all') // 排除 'all' 本身
      .map(async (s) => {
        // 如果内存里已经有数据，直接用（缓存策略）
        // 注意：这里可能需要一个过期时间机制，否则永远不会刷新
        const currentList = sourceList[s]
        if (currentList && currentList.length > 0) {
          return { source: s, list: currentList }
        }

        // 确保类型安全
        const musicSource = s as LX.OnlineSource
        const sdk = music[musicSource]

        if (!sdk?.hotSearch) {
          return { source: s, list: [] as string[] }
        }

        try {
          const data = await sdk.hotSearch.getList()
          // 获取到数据后，顺便更新单源的缓存
          setList(s, data.list)
          return { source: s, list: data.list as string[] }
        } catch (err) {
          console.warn(`Fetch hot search failed for ${s}:`, err)
          return { source: s, list: [] as string[] }
        }
      })

    const results = await Promise.all(promises)
    return setLists(results)
  }

  // 获取单个源
  else {
    // 缓存检查
    const currentList = sourceList[source]
    if (currentList && currentList.length > 0) {
      return currentList
    }

    const musicSource = source as LX.OnlineSource
    const sdk = music[musicSource]

    if (!sdk?.hotSearch) {
      setList(source, [])
      return []
    }

    try {
      const data = await sdk.hotSearch.getList()
      return setList(source, data.list)
    } catch (error) {
      console.error(error)
      return []
    }
  }
}

export const clearList = (source: Source) => {
  sourceList[source] = []
}