export interface EventBus {
  publish<T = any>(topic: string, event: T): Promise<void>
}
