import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

export const compressVideo = async (inputPath: string) => {
  const dir = path.dirname(inputPath)
  const ext = path.extname(inputPath)
  const base = path.basename(inputPath, ext)

  const tempOutput = path.join(dir, `${base}.processed${ext}`)

  await execFileAsync('ffmpeg', [
    '-y',
    '-i', inputPath,
    '-vcodec', 'libx264',
    '-crf', '28',
    '-preset', 'veryfast',
    '-acodec', 'aac',
    '-movflags', '+faststart',
    tempOutput,
  ])

  await fs.promises.rename(tempOutput, inputPath)
}
