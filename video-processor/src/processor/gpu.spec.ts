const mockExecFileAsync = jest.fn()

jest.mock('child_process', () => ({
  execFile: Object.assign(jest.fn(), {
    [require('util').promisify.custom]: (...args: unknown[]) => mockExecFileAsync(...args),
  }),
}))

import {
  isGpuEncodingAvailable,
  resetGpuDetectionCache,
  getVideoCodec,
  GPU_VIDEO_CODEC,
  CPU_VIDEO_CODEC,
} from './gpu'

beforeEach(() => {
  resetGpuDetectionCache()
  mockExecFileAsync.mockReset()
})

describe('isGpuEncodingAvailable', () => {
  it('returns true when nvidia-smi succeeds and ffmpeg lists h264_nvenc', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.resolve({ stdout: '', stderr: '' })
      if (cmd === 'ffmpeg') return Promise.resolve({ stdout: 'h264_nvenc  NVIDIA NVENC', stderr: '' })
      return Promise.reject(new Error('unexpected command'))
    })

    await expect(isGpuEncodingAvailable()).resolves.toBe(true)
  })

  it('returns false when nvidia-smi is not available', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.reject(new Error('not found'))
      if (cmd === 'ffmpeg') return Promise.resolve({ stdout: 'h264_nvenc', stderr: '' })
      return Promise.reject(new Error('unexpected command'))
    })

    await expect(isGpuEncodingAvailable()).resolves.toBe(false)
  })

  it('returns false when ffmpeg lacks the nvenc encoder', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.resolve({ stdout: '', stderr: '' })
      if (cmd === 'ffmpeg') return Promise.resolve({ stdout: 'libx264', stderr: '' })
      return Promise.reject(new Error('unexpected command'))
    })

    await expect(isGpuEncodingAvailable()).resolves.toBe(false)
  })

  it('caches the detection result across calls', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.resolve({ stdout: '', stderr: '' })
      if (cmd === 'ffmpeg') return Promise.resolve({ stdout: 'h264_nvenc', stderr: '' })
      return Promise.reject(new Error('unexpected command'))
    })

    await isGpuEncodingAvailable()
    await isGpuEncodingAvailable()

    expect(mockExecFileAsync).toHaveBeenCalledTimes(2)
  })
})

describe('getVideoCodec', () => {
  it('returns the GPU codec when GPU encoding is available', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.resolve({ stdout: '', stderr: '' })
      return Promise.resolve({ stdout: 'h264_nvenc', stderr: '' })
    })

    await expect(getVideoCodec()).resolves.toBe(GPU_VIDEO_CODEC)
  })

  it('returns the CPU codec when GPU encoding is not available', async () => {
    mockExecFileAsync.mockImplementation((cmd: string) => {
      if (cmd === 'nvidia-smi') return Promise.reject(new Error('not found'))
      return Promise.resolve({ stdout: '', stderr: '' })
    })

    await expect(getVideoCodec()).resolves.toBe(CPU_VIDEO_CODEC)
  })
})
