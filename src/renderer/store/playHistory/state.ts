import { shallowReactive } from '@common/utils/vueTools'

export interface PlayHistoryMusic {
    musicId: string
    name: string
    singer: string
    source: string
    meta: any
    playCount?: number
    playedAt?: number
}

export const mostPlayedList = shallowReactive<PlayHistoryMusic[]>([])
export const recentlyPlayedList = shallowReactive<PlayHistoryMusic[]>([])
