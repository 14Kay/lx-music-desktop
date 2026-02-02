import { getDB } from '../../db'
import {
    createPlayHistoryInsertStatement,
    createMostPlayedQueryStatement,
    createRecentlyPlayedQueryStatement,
} from './statements'

export interface PlayHistoryRecord {
    musicId: string
    name: string
    singer: string
    source: string
    meta: string
    playedAt: number
}

export interface MostPlayedResult {
    musicId: string
    name: string
    singer: string
    source: string
    meta: string
    playCount: number
}

/**
 * 保存播放记录
 * @param record 播放记录
 */
export const savePlayRecord = (record: PlayHistoryRecord) => {
    const insertStatement = createPlayHistoryInsertStatement()
    insertStatement.run(record)
}

/**
 * 获取最常播放的歌曲
 * @param limit 限制数量
 * @returns 最常播放的歌曲列表
 */
export const getMostPlayed = (limit: number = 10): MostPlayedResult[] => {
    const queryStatement = createMostPlayedQueryStatement()
    return queryStatement.all(limit) as MostPlayedResult[]
}

/**
 * 获取最近播放的歌曲
 * @param limit 限制数量
 * @returns 最近播放的歌曲列表
 */
export const getRecentlyPlayed = (limit: number = 20): PlayHistoryRecord[] => {
    const queryStatement = createRecentlyPlayedQueryStatement()
    return queryStatement.all(limit) as PlayHistoryRecord[]
}
