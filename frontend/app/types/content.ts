import type { ContentStatus } from '~/constants/contentStatus'

export interface Content {
  id: string
  title: string
  description: string
  status?: ContentStatus
  userId: string
  thumbnailUrl: string
}
