import { Event } from "./Event"

export type Handler<T> = ((event: Event, context: T) => Promise<void>) | ((event: Event) => Promise<void>)
