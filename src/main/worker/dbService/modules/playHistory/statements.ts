import { getDB } from '../../db'
import type Database from 'better-sqlite3'

let playHistoryInsertStatement: Database.Statement | null = null
let mostPlayedQueryStatement: Database.Statement | null = null
let recentlyPlayedQueryStatement: Database.Statement | null = null

/**
 * 创建插入播放记录的语句
 */
export const createPlayHistoryInsertStatement = () => {
    if (!playHistoryInsertStatement) {
        const db = getDB()
        playHistoryInsertStatement = db.prepare(`
      INSERT INTO "play_history" ("musicId", "name", "singer", "source", "meta", "playedAt")
      VALUES (@musicId, @name, @singer, @source, @meta, @playedAt)
    `)
    }
    return playHistoryInsertStatement
}

/**
 * 创建查询最常播放歌曲的语句
 */
export const createMostPlayedQueryStatement = () => {
    if (!mostPlayedQueryStatement) {
        const db = getDB()
        mostPlayedQueryStatement = db.prepare(`
      SELECT 
        musicId,
        name,
        singer,
        source,
        meta,
        COUNT(*) as playCount
      FROM "play_history"
      GROUP BY musicId
      ORDER BY playCount DESC, MAX(playedAt) DESC
      LIMIT ?
    `)
    }
    return mostPlayedQueryStatement
}

/**
 * 创建查询最近播放歌曲的语句
 */
export const createRecentlyPlayedQueryStatement = () => {
    if (!recentlyPlayedQueryStatement) {
        const db = getDB()
        recentlyPlayedQueryStatement = db.prepare(`
      SELECT 
        musicId,
        name,
        singer,
        source,
        meta,
        MAX(playedAt) as playedAt
      FROM "play_history"
      GROUP BY musicId
      ORDER BY playedAt DESC
      LIMIT ?
    `)
    }
    return recentlyPlayedQueryStatement
}
