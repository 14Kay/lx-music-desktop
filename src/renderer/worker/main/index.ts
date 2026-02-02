import { exposeWorker } from '../utils/worker'

import * as common from './common'
import * as list from './list'
import * as music from './music'
import * as playHistory from './playHistory'


console.log('hello main worker')


exposeWorker(Object.assign({}, common, list, music, playHistory))

export type workerMainTypes = typeof common
  & typeof list
  & typeof music
  & typeof playHistory
