import {
  LastFMAuth,
  LastFMTrack,
} from 'lastfm-ts-api'

interface Base {
  api_key: string
  secret: string
}
export async function getToken(apikey: string, secret: string) {
  const auth = new LastFMAuth(apikey, secret)
  return await auth.getToken()
}

export async function getSession(data: LX.LastFM.SessionParams): Promise<LX.LastFM.AuthSessionResponse> {
  const auth = new LastFMAuth(data.api_key, data.secret)
  return auth.getSession({ token: data.token })
}

export async function trackScrobble(auth: Base & { session: string }, data: LX.LastFM.TrackScrobbleParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.scrobble(data)
}

export async function trackLove(auth: Base & { session: string }, data: LX.LastFM.TrackParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.love(data)
}

export async function trackUnlove(auth: Base & { session: string }, data: LX.LastFM.TrackParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.unlove(data)
}

export async function trackUpdateNowPlaying(auth: Base & { session: string }, data: LX.LastFM.TrackUpdateNowPlayingParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.updateNowPlaying(data)
}
