import * as http from "cloud-http"
import { Handler } from "./Handler"

export class Route<T> {
	private constructor(readonly expression: RegExp, readonly methods: http.Method[], readonly handler: Handler<T>) {}
	match(request: http.Request): http.Request | undefined {
		const match = request.url.pathname.match(this.expression)
		return (match && { ...request, parameter: match.groups || {} }) || undefined
	}
	static create<T>(method: http.Method | http.Method[], pattern: string, handler: Handler<T>): Route<T> {
		return new Route(
			new RegExp(
				pattern
					.split("/")
					.map(folder => (folder.startsWith(":") ? `(?<${folder.substr(1)}>[^/\\?#]*)` : folder))
					.join("/") + "/*$"
			),
			Array.isArray(method) ? method : [method],
			handler
		)
	}
}
