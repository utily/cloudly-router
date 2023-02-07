import * as http from "cloudly-http"
import * as platform from "./platform"

export type Handler<T> =
	| ((
			request: http.Request | (platform.Request & { parameter: Record<string, string | undefined> }),
			context: T
	  ) => Promise<http.Response.Like | platform.Response | any>)
	| ((
			request: http.Request | (platform.Request & { parameter: Record<string, string | undefined> })
	  ) => Promise<http.Response.Like | platform.Response | any>)
