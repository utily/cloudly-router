import { Event } from "./Event"

export type Handler<T> = ((event: Event, context?: T) => Promise<boolean>) | ((event: Event) => Promise<boolean>)
