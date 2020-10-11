import * as http from "cloud-http"
import { Handler } from "./Handler"

export class Route {
	private constructor(readonly expression: RegExp, readonly methods: http.Method[], readonly handler: Handler) {}
	match(request: http.Request): http.Request | undefined {
		const match = request.url.pathname.match(this.expression)
		return (match && { ...request, parameter: match.groups || {} }) || undefined
	}
	static create(method: http.Method | http.Method[], pattern: string, handler: Handler): Route {
		return new Route(
			new RegExp(
				pattern
					.split("/")
					.map(folder => (folder.startsWith(":") ? `(?<${folder.substr(1)}>[^/\\?#]*)` : folder))
					.join("/")
			),
			Array.isArray(method) ? method : [method],
			handler
		)
	}
}
