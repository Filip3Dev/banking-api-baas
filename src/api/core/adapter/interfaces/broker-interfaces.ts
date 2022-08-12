export interface BrokerAdapter {
  registerQueue(queue: string): Promise<void>
  publish(queue: string, message: string, delay?: number): Promise<void>
}

export interface BrokerMessage {
  context: string
  useCase: string
  attempts: number
  payload: unknown
}
