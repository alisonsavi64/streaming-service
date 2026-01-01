export const contentStatusConfig = {
  UPLOADED: {
    color: 'bg-zinc-500',
    label: 'status.uploaded',
    pulse: false,
  },
  PROCESSING: {
    color: 'bg-yellow-500',
    label: 'status.processing',
    pulse: true,
  },
  PROCESSED: {
    color: 'bg-emerald-600',
    label: 'status.processed',
    pulse: false,
  },
  FAILED: {
    color: 'bg-red-600',
    label: 'status.failed',
    pulse: false,
  },
} as const

export type ContentStatus = keyof typeof contentStatusConfig
export type ContentStatusConfig =
  typeof contentStatusConfig[ContentStatus]
