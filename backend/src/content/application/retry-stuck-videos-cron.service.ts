import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RetryStuckVideosUseCase } from './retry-stuck-videos.use-case'

@Injectable()
export class RetryStuckVideosCronService {
  private readonly logger = new Logger(RetryStuckVideosCronService.name)
  constructor(private readonly retryStuckVideos: RetryStuckVideosUseCase) {}
  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.log('Running RetryStuckVideosCronService...')
    try {
      const count = await this.retryStuckVideos.execute()
      this.logger.log(`RetryStuckVideosCronService processed ${count} stuck videos`)
    } catch (err: any) {
      this.logger.error('RetryStuckVideosCronService failed', err.stack)
    }
  }
}
