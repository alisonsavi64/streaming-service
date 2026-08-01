import type { ContentStatus } from '~/constants/contentStatus'
import type { ContentGenre } from '~/constants/contentGenre'

export interface Content {
  id: string
  title: string
  description: string
  status?: ContentStatus
  userId: string
  thumbnailUrl: string
  genre?: ContentGenre
  viewsCount?: number
  createdAt?: string
}
