import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

const RENDITIONS = [
  { width: 1920, height: 1080, bitrate: '5000k' },
  { width: 1280, height: 720,  bitrate: '2500k' },
  { width: 854,  height: 480,  bitrate: '1200k' },
  { width: 640,  height: 360,  bitrate: '800k' },
  { width: 256,  height: 144,  bitrate: '200k' },
]

const hasAudio = async (inputPath: string): Promise<boolean> => {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'a',
    '-show_entries', 'stream=index',
    '-of', 'csv=p=0',
    inputPath,
  ])

  return stdout.trim().length > 0
}

const getVideoHeight = async (inputPath: string): Promise<number> => {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=height',
    '-of', 'csv=p=0',
    inputPath,
  ])

  return Number(stdout.trim())
}

export const generateHLS = async (
  inputPath: string,
  outputDir: string
): Promise<string> => {
  await fs.promises.mkdir(outputDir, { recursive: true })

  const [audioPresent, sourceHeight] = await Promise.all([
    hasAudio(inputPath),
    getVideoHeight(inputPath),
  ])

  const renditions = RENDITIONS.filter(r => r.height <= sourceHeight)

  if (renditions.length === 0) {
    throw new Error('No valid renditions for this video')
  }

  const args: string[] = [
    '-y',
    '-i', inputPath,
  ]

  renditions.forEach((r, i) => {
    args.push(
      '-map', '0:v:0',
      ...(audioPresent ? ['-map', '0:a?'] : []),
      `-s:v:${i}`, `${r.width}x${r.height}`,
      `-c:v:${i}`, 'libx264',
      '-preset', 'veryfast',
      `-b:v:${i}`, r.bitrate,
    )
  })

  if (audioPresent) {
    args.push(
      '-c:a', 'aac',
      '-b:a', '128k'
    )
  }

  const varStreamMap = renditions
    .map((_, i) => (audioPresent ? `v:${i},a:${i}` : `v:${i}`))
    .join(' ')

  args.push(
    '-threads', '4',
    '-f', 'hls',
    '-hls_time', '4',
    '-hls_playlist_type', 'vod',
    '-hls_segment_filename',
    path.join(outputDir, '%v_%05d.ts'),
    '-master_pl_name', 'master.m3u8',
    '-var_stream_map', varStreamMap,
    path.join(outputDir, '%v.m3u8'),
  )

  await execFileAsync('ffmpeg', args)

  return path.join(outputDir, 'master.m3u8')
}
