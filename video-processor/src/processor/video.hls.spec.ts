import path from 'path'

const mockExecFileAsync = jest.fn()

jest.mock('child_process', () => ({
  execFile: Object.assign(jest.fn(), {
    [require('util').promisify.custom]: (...args: unknown[]) => mockExecFileAsync(...args),
  }),
}))

jest.mock('fs', () => ({
  promises: { mkdir: jest.fn().mockResolvedValue(undefined) },
}))

jest.mock('./gpu', () => ({
  ...jest.requireActual('./gpu'),
  getVideoCodec: jest.fn(),
}))

import { generateHLS } from './video.hls'
import { getVideoCodec, GPU_VIDEO_CODEC, CPU_VIDEO_CODEC } from './gpu'

const mockedGetVideoCodec = jest.mocked(getVideoCodec)

beforeEach(() => {
  mockExecFileAsync.mockReset()
  mockedGetVideoCodec.mockReset()
})

describe('generateHLS', () => {
  it('falls back to the CPU codec when the GPU ffmpeg attempt fails', async () => {
    mockedGetVideoCodec.mockResolvedValue(GPU_VIDEO_CODEC)

    mockExecFileAsync.mockImplementation((cmd: string, args: string[]) => {
      if (cmd === 'ffprobe' && args.includes('a')) return Promise.resolve({ stdout: '', stderr: '' })
      if (cmd === 'ffprobe') return Promise.resolve({ stdout: '1080\n', stderr: '' })
      if (cmd === 'ffmpeg' && args.includes('-hwaccel')) return Promise.reject(new Error('nvenc failed'))
      if (cmd === 'ffmpeg') return Promise.resolve({ stdout: '', stderr: '' })
      return Promise.reject(new Error('unexpected command'))
    })

    const result = await generateHLS('/tmp/input.mp4', '/tmp/output')

    expect(result).toBe(path.join('/tmp/output', 'master.m3u8'))

    const ffmpegCalls = mockExecFileAsync.mock.calls.filter(([cmd]) => cmd === 'ffmpeg')
    expect(ffmpegCalls).toHaveLength(2)
    expect(ffmpegCalls[0][1]).toContain('-hwaccel')
    expect(ffmpegCalls[1][1]).not.toContain('-hwaccel')
    expect(ffmpegCalls[1][1]).toContain(CPU_VIDEO_CODEC)
  })

  it('does not retry when the CPU codec attempt fails', async () => {
    mockedGetVideoCodec.mockResolvedValue(CPU_VIDEO_CODEC)

    mockExecFileAsync.mockImplementation((cmd: string, args: string[]) => {
      if (cmd === 'ffprobe' && args.includes('a')) return Promise.resolve({ stdout: '', stderr: '' })
      if (cmd === 'ffprobe') return Promise.resolve({ stdout: '1080\n', stderr: '' })
      if (cmd === 'ffmpeg') return Promise.reject(new Error('ffmpeg failed'))
      return Promise.reject(new Error('unexpected command'))
    })

    await expect(generateHLS('/tmp/input.mp4', '/tmp/output')).rejects.toThrow('ffmpeg failed')

    const ffmpegCalls = mockExecFileAsync.mock.calls.filter(([cmd]) => cmd === 'ffmpeg')
    expect(ffmpegCalls).toHaveLength(1)
  })
})
