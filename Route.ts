import "urlpattern-polyfill"
import * as http from "cloudly-http"
import { Handler } from "./Handler"
import * as platform from "./platform"

export class Route<T> {
	private constructor(
		readonly pattern: URLPattern,
		readonly methods: http.Method[],
		readonly handler: Handler<T>,
		readonly parse: boolean
	) {}
	match(
		request: http.Request | platform.Request,
		...alternatePrefix: string[]
	): http.Request | (platform.Request & { parameter: Record<string, string | undefined> }) | undefined {
		if (http.Request.is(request) || (this.parse && (request = http.Request.from(request)))) {
			let path = request.url.pathname
			const prefix = alternatePrefix.find(prefix => path.startsWith(prefix))
			if (prefix)
				path = path.substring(prefix.length)
			const match = this.pattern.exec({ pathname: path })
			return (match && { ...request, parameter: match?.pathname.groups || {} }) || undefined
		} else {
			const url = new URL(request.url)
			let path = url.pathname
			const prefix = alternatePrefix.find(prefix => path.startsWith(prefix))
			if (prefix)
				path = path.substring(prefix.length)
			const match = this.pattern.exec({ pathname: path })
			return (match && { ...request, parameter: match?.pathname.groups || {} }) || undefined
		}
	}
	static create<T>(
		method: http.Method | http.Method[],
		pattern: URLPattern | string,
		handler: Handler<T>,
		parse = true
	): Route<T> {
		return new Route(
			typeof pattern == "string" ? new URLPattern({ pathname: pattern }) : pattern,
			Array.isArray(method) ? method : [method],
			handler,
			parse
		)
	}
}
