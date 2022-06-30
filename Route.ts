import "urlpattern-polyfill"
import * as http from "cloudly-http"
import { Handler } from "./Handler"

export class Route<T> {
	private constructor(readonly pattern: URLPattern, readonly methods: http.Method[], readonly handler: Handler<T>) {}
	match(request: http.Request, ...alternatePrefix: string[]): http.Request | undefined {
		let path = request.url.pathname
		const prefix = alternatePrefix.find(prefix => path.startsWith(prefix))
		if (prefix)
			path = path.substring(prefix.length)
		const match = this.pattern.exec({ pathname: path })
		return (match && { ...request, parameter: match?.pathname.groups || {} }) || undefined
	}
	static create<T>(method: http.Method | http.Method[], pattern: URLPattern | string, handler: Handler<T>): Route<T> {
		return new Route(
			typeof pattern == "string" ? new URLPattern({ pathname: pattern }) : pattern,
			Array.isArray(method) ? method : [method],
			handler
		)
	}
}
