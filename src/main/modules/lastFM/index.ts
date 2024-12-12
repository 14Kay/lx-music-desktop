import {
  LastFMAuth,
  LastFMTrack,
} from 'lastfm-ts-api'
import type { LastFMAuthGetSessionParams, LastFMAuthSessionResponse, LastFMTrackScrobbleParams, LastFMTrackParams, LastFMTrackUpdateNowPlayingParams } from 'lastfm-ts-api'

interface Base {
  api_key: string
  secret: string
}
export async function getToken(apikey: string, secret: string) {
  const auth = new LastFMAuth(apikey, secret)
  return await auth.getToken()
}

export async function getSession(data: Base & LastFMAuthGetSessionParams): Promise<LastFMAuthSessionResponse> {
  const auth = new LastFMAuth(data.api_key, data.secret)
  return auth.getSession({ token: data.token })
}

export async function trackScrobble(auth: Base & { session: string }, data: LastFMTrackScrobbleParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.scrobble(data)
}

export async function trackLove(auth: Base & { session: string }, data: LastFMTrackParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.love(data)
}

export async function trackUnlove(auth: Base & { session: string }, data: LastFMTrackParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.unlove(data)
}

export async function trackUpdateNowPlaying(auth: Base & { session: string }, data: LastFMTrackUpdateNowPlayingParams) {
  const track = new LastFMTrack(auth.api_key, auth.secret, auth.session)
  return track.updateNowPlaying(data)
}
