import { execFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execFileAsync = promisify(execFile)

const hasAudio = async (inputPath: string): Promise<boolean> => {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'a',
    '-show_entries', 'stream=index',
    '-of', 'csv=p=0',
    inputPath
  ])
  return stdout.trim().length > 0
}

export const generateHLS = async (inputPath: string, outputDir: string) => {
  await fs.promises.mkdir(outputDir, { recursive: true })

  const hasAudioStream = await hasAudio(inputPath)

  const args = [
    '-y',
    '-i', inputPath,
    '-map', '0:v',
    ...(hasAudioStream ? ['-map', '0:a?'] : []),
    '-s:v:0', '1920x1080',
    '-c:v:0', 'libx264',
    '-preset', 'veryfast',
    '-b:v:0', '5000k',
    '-map', '0:v',
    ...(hasAudioStream ? ['-map', '0:a?'] : []),
    '-s:v:1', '1280x720',
    '-c:v:1', 'libx264',
    '-preset', 'veryfast',
    '-b:v:1', '2500k',
    '-map', '0:v',
    ...(hasAudioStream ? ['-map', '0:a?'] : []),
    '-s:v:2', '854x480',
    '-c:v:2', 'libx264',
    '-preset', 'veryfast',
    '-b:v:2', '1200k',
    '-map', '0:v',
    ...(hasAudioStream ? ['-map', '0:a?'] : []),
    '-s:v:3', '640x360',
    '-c:v:3', 'libx264',
    '-preset', 'veryfast',
    '-b:v:3', '800k',
    '-map', '0:v',
    ...(hasAudioStream ? ['-map', '0:a?'] : []),
    '-s:v:4', '256x144',
    '-c:v:4', 'libx264',
    '-preset', 'veryfast',
    '-b:v:4', '200k',
    ...(hasAudioStream ? ['-c:a', 'aac', '-b:a', '128k'] : []),
    '-threads', '4',
    '-f', 'hls',
    '-hls_time', '4',
    '-hls_playlist_type', 'vod',
    '-hls_segment_filename',
    path.join(outputDir, '%v_%05d.ts'),
    '-master_pl_name', 'master.m3u8',
    '-var_stream_map',
    hasAudioStream
      ? 'v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3 v:4,a:4'
      : 'v:0 v:1 v:2 v:3 v:4',

    path.join(outputDir, '%v.m3u8'),
  ]
  await execFileAsync('ffmpeg', args)
  return path.join(outputDir, 'master.m3u8')
}
