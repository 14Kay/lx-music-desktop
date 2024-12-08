type Func = (...args: any[]) => any
export default class EventBus {
  private readonly events = new Map<string, Func[]>()

  emit(eventName: string, data: any) {
    const handlers = this.events.get(eventName)
    if (handlers) {
      handlers.forEach((handler) => {
        handler(data)
      })
    }
  }

  on(eventName: string, handler: Func) {
    const handlers = this.events.get(eventName)
    this.events.set(eventName, handlers ? [...handlers, handler] : [handler])
  }

  off(eventName: string, fn: Func) {
    const handlers = this.events.get(eventName)
    if (handlers) {
      this.events.set(
        eventName,
        handlers.filter((handler) => handler !== fn),
      )
    }
  }
}
