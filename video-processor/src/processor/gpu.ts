import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export const GPU_VIDEO_CODEC = 'h264_nvenc'
export const CPU_VIDEO_CODEC = 'libx264'

let cachedGpuAvailable: boolean | undefined

const nvidiaSmiAvailable = async (): Promise<boolean> => {
  try {
    await execFileAsync('nvidia-smi', ['-L'])
    return true
  } catch {
    return false
  }
}

const ffmpegHasNvencEncoder = async (): Promise<boolean> => {
  try {
    const { stdout } = await execFileAsync('ffmpeg', ['-hide_banner', '-encoders'])
    return stdout.includes(GPU_VIDEO_CODEC)
  } catch {
    return false
  }
}

export const isGpuEncodingAvailable = async (): Promise<boolean> => {
  if (cachedGpuAvailable !== undefined) return cachedGpuAvailable

  const [hasNvidiaSmi, hasNvencEncoder] = await Promise.all([
    nvidiaSmiAvailable(),
    ffmpegHasNvencEncoder(),
  ])

  cachedGpuAvailable = hasNvidiaSmi && hasNvencEncoder
  return cachedGpuAvailable
}

export const resetGpuDetectionCache = (): void => {
  cachedGpuAvailable = undefined
}

export const getVideoCodec = async (): Promise<string> =>
  (await isGpuEncodingAvailable()) ? GPU_VIDEO_CODEC : CPU_VIDEO_CODEC
