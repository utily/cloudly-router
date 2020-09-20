export type Handler = (event: FetchEvent, parameter?: { [key: string]: string | undefined }) => Promise<Response>
