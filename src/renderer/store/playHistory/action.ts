import { mostPlayedList, recentlyPlayedList } from './state'
import type { PlayHistoryMusic } from './state'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import { rendererInvoke } from '@common/rendererIpc'

/**
 * 保存播放记录
 */
export const savePlayRecord = async (musicInfo: LX.Music.MusicInfo) => {
    try {
        await rendererInvoke<LX.Music.MusicInfo>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_save, musicInfo)
        // 保存成功后自动刷新播放历史列表
        void loadRecentlyPlayed(5)
        void loadMostPlayed(4)
    } catch (error) {
        console.error('Failed to save play record:', error)
    }
}

/**
 * 加载最常播放的歌曲
 */
export const loadMostPlayed = async (limit: number = 10) => {
    try {
        const results = await rendererInvoke<number, PlayHistoryMusic[]>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_get_most_played, limit)
        mostPlayedList.splice(0, mostPlayedList.length, ...results)
    } catch (error) {
        console.error('Failed to load most played:', error)
    }
}

/**
 * 加载最近播放的歌曲
 */
export const loadRecentlyPlayed = async (limit: number = 20) => {
    try {
        const results = await rendererInvoke<number, PlayHistoryMusic[]>(WIN_MAIN_RENDERER_EVENT_NAME.play_history_get_recently_played, limit)
        recentlyPlayedList.splice(0, recentlyPlayedList.length, ...results)
    } catch (error) {
        console.error('Failed to load recently played:', error)
    }
}

export type { PlayHistoryMusic }
