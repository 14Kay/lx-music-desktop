import type { LastFMAuthGetSessionParams, LastFMAuthSessionResponse } from 'lastfm-ts-api'

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

      type SessionParams = Base & LastFMAuthGetSessionParams
      type SessionResponse = LastFMAuthSessionResponse
    }
  }
}
