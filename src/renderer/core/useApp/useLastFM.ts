import { onBeforeUnmount } from '@common/utils/vueTools'
import { appSetting } from '@renderer/store/setting'
import {
  onEnded,
  onTimeupdate,
  onPlaying,
} from '@renderer/plugins/player'

import {
  musicInfo,
  type PlayerMusicInfo,
} from '@renderer/store/player/state'
import { addTrackMusic } from '@renderer/utils/ipc'
import { playProgress } from '@renderer/store/player/playProgress'

export default () => {
  let currentMusicInfo!: PlayerMusicInfo
  let times = 0
  let timestamp = 0
  let duration = 0
  const rOnPlaying = onPlaying(() => {
    setTimeout(() => {
      currentMusicInfo = { ...musicInfo }
      timestamp = Math.floor(Date.now() / 1000)
      duration = Math.floor(playProgress.maxPlayTime)
    }, 2000)
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
      const auth = {
        api_key: appSetting['lastFM.api_key'],
        secret: appSetting['lastFM.secret'],
        session: appSetting['lastFM.session.key'],
      }
      const { name, album, singer } = currentMusicInfo
      addTrackMusic({
        auth,
        data: {
          duration,
          track: name,
          album,
          artist: singer,
          timestamp,
        },
      }).then((trackResponse) => {
        console.log(`scrobble ${name} to last.fm accepted result:`, trackResponse.scrobbles['@attr'].accepted == 1 ? 'success' : 'failed')
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
