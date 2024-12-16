import { onBeforeUnmount } from '@common/utils/vueTools'
import { appSetting, updateSetting } from '@renderer/store/setting'
import { lastFMTrackResult } from '@renderer/store'
import {
  onEnded,
  onTimeupdate,
  onPlaying,
} from '@renderer/plugins/player'

import {
  musicInfo,
  type PlayerMusicInfo,
} from '@renderer/store/player/state'
import { addTrackMusic, lastFMUpdateNowPlaying } from '@renderer/utils/ipc'
import { playProgress } from '@renderer/store/player/playProgress'

export default () => {
  const MAX_ERROR_TIMES = 3
  let currentMusicInfo!: PlayerMusicInfo
  let times = 0
  let timestamp = 0
  let duration = 0
  let errorTimes = 0
  const getAuth = () => ({
    api_key: appSetting['lastFM.api_key'],
    secret: appSetting['lastFM.secret'],
    session: appSetting['lastFM.session.key'],
  })

  const updateNowPlaying = () => {
    currentMusicInfo = { ...musicInfo }
    timestamp = Math.floor(Date.now() / 1000)
    duration = Math.floor(playProgress.maxPlayTime)

    lastFMUpdateNowPlaying({
      auth: getAuth(),
      data: {
        duration,
        track: currentMusicInfo.name,
        album: currentMusicInfo.album,
        artist: currentMusicInfo.singer,
        timestamp,
      },
    })
  }
  const rOnPlaying = onPlaying(() => {
    setTimeout(updateNowPlaying, 2000)
  })

  const resetTrackInfo = () => {
    times = 0
    timestamp = 0
    duration = 0
  }

  const rOnTimeupdate = onTimeupdate(() => {
    times++
  })

  const rOnEnded = onEnded(async() => {
    if (appSetting['lastFM.enable'] && times > 60) {
      lastFMTrackResult.value = 'tracking'
      const { name, album, singer } = currentMusicInfo
      addTrackMusic({
        auth: getAuth(),
        data: {
          duration,
          track: name,
          album,
          artist: singer,
          timestamp,
        },
      }).then((trackResponse) => {
        errorTimes = 0
        lastFMTrackResult.value = trackResponse.scrobbles['@attr'].accepted == 1 ? 'success' : 'error'
        setTimeout(() => {
          lastFMTrackResult.value = 'normal'
        }, 2500)
        console.log(`scrobble ${name} to last.fm accepted result:`, trackResponse.scrobbles['@attr'].accepted == 1 ? 'success' : 'failed')
      }).catch((e) => {
        lastFMTrackResult.value = 'error'
        errorTimes++
        setTimeout(() => {
          lastFMTrackResult.value = 'normal'
        }, 2500)

        if (errorTimes > MAX_ERROR_TIMES) {
          updateSetting({ 'lastFM.enable': false })
          errorTimes = 0
        }

        console.error('scrobble to last.fm error:', e)
      })
      resetTrackInfo()
    }
  })

  onBeforeUnmount(() => {
    rOnPlaying()
    rOnEnded()
    rOnTimeupdate()
  })
}
