import { mainHandle } from '@common/mainIpc'
import { WIN_MAIN_RENDERER_EVENT_NAME } from '@common/ipcNames'
import { getToken, getSession, trackScrobble, trackLove, trackUnlove, trackUpdateNowPlaying } from '@main/modules/lastFM'

export default () => {
  mainHandle<LX.LastFM.Base, LX.LastFM.Token>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_get_token, async({ params: data }) => {
    return getToken(data.api_key, data.secret)
  })

  mainHandle<LX.LastFM.SessionParams, LX.LastFM.AuthSessionResponse>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_get_session, async({ params: data }) => {
    return getSession({ api_key: data.api_key, secret: data.secret, token: data.token })
  })

  mainHandle<{ auth: LX.LastFM.Base & { session: string }, data: LX.LastFM.TrackScrobbleParams }, LX.LastFM.TrackScroblleResponse>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_add_track, async({ params: data }) => {
    return trackScrobble(data.auth, data.data)
  })

  mainHandle<{ auth: LX.LastFM.Base & { session: string }, data: LX.LastFM.TrackParams }>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_track_love, async({ params: data }) => {
    return trackLove(data.auth, data.data)
  })

  mainHandle<{ auth: LX.LastFM.Base & { session: string }, data: LX.LastFM.TrackParams }>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_track_unlove, async({ params: data }) => {
    return trackUnlove(data.auth, data.data)
  })

  mainHandle<{ auth: LX.LastFM.Base & { session: string }, data: LX.LastFM.TrackUpdateNowPlayingParams }, LX.LastFM.UpdateNowPlayingResponse>(WIN_MAIN_RENDERER_EVENT_NAME.last_fm_track_update_now_playing, async({ params: data }) => {
    return trackUpdateNowPlaying(data.auth, data.data)
  })
}
