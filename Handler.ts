import * as http from "cloud-http"

export type Handler<T> =
	| ((request: http.Request, context: T) => Promise<http.Response.Like | any>)
	| ((request: http.Request) => Promise<http.Response.Like | any>)
