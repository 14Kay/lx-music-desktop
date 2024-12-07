import { File } from '../../../common/constants_sync'
import fs from 'node:fs'
import path from 'node:path'

export default async(dataPath: string, name: string, file: Buffer) => {
  const avatarSyncDataPath = path.join(dataPath, File.avatarDataPath)
  if (!fs.existsSync(avatarSyncDataPath)) {
    await fs.promises.mkdir(avatarSyncDataPath, { recursive: true })
  }
  const avatarPath = path.join(avatarSyncDataPath, name)
  if (fs.existsSync(avatarPath)) {
    return avatarPath
  }
  fs.writeFileSync(avatarPath, file)
  return avatarPath
}
