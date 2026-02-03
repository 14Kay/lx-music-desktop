import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import { mainHandle } from '@common/mainIpc'

// 播放历史事件
export default () => {
    mainHandle<LX.Music.MusicInfo>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_save, async({ params: musicInfo }) => {
        await global.lx.worker.dbService.savePlayRecord({
            musicId: musicInfo.id,
            name: musicInfo.name,
            singer: musicInfo.singer,
            source: musicInfo.source,
            meta: JSON.stringify(musicInfo.meta),
            playedAt: Date.now(),
        })
    })

    mainHandle<number, any[]>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_get_most_played, async({ params: limit = 10 }) => {
        const results = await global.lx.worker.dbService.getMostPlayed(limit)
        return results.map((item: any) => ({
            ...item,
            meta: JSON.parse(item.meta),
        }))
    })

    mainHandle<number, any[]>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_get_recently_played, async({ params: limit = 20 }) => {
        const results = await global.lx.worker.dbService.getRecentlyPlayed(limit)
        return results.map((item: any) => ({
            ...item,
            meta: JSON.parse(item.meta),
        }))
    })
}
