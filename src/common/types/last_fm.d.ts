import type {
  LastFMAuthGetSessionParams as LastFMAuthGetSessionParamsAlias,
  LastFMAuthSessionResponse as LastFMAuthSessionResponseAlias,
  LastFMTrackScrobbleParams as LastFMTrackScrobbleParamsAlias,
  LastFMTrackScroblleResponse as LastFMTrackScroblleResponseAlias,
  LastFMTrackParams as LastFMTrackParamsAlias,
  LastFMTrackUpdateNowPlayingParams as LastFMTrackUpdateNowPlayingParamsAlias,
  LastFMUpdateNowPlayingResponse as LastFMUpdateNowPlayingResponseAlias,
} from 'lastfm-ts-api'

declare global {
  declare namespace LX {
    namespace LastFM {
      interface Token {
        token: string
      }

      interface Base {
        api_key: string
        secret: string
      }

      type SessionParams = Base & LastFMAuthGetSessionParamsAlias
      type AuthSessionResponse = LastFMAuthSessionResponseAlias
      type TrackScrobbleParams = LastFMTrackScrobbleParamsAlias
      type TrackScroblleResponse = LastFMTrackScroblleResponseAlias
      type TrackParams = LastFMTrackParamsAlias
      type TrackUpdateNowPlayingParams = LastFMTrackUpdateNowPlayingParamsAlias
      type UpdateNowPlayingResponse = LastFMUpdateNowPlayingResponseAlias
    }
  }
}
