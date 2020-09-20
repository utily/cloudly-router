import { Handler } from "./Handler"
import { Method } from "./Method"

export class Route {
	private constructor(readonly expression: RegExp, readonly methods: Method[], readonly handler: Handler) {}
	private getPath(url: string): string {
		return (
			url &&
			"/" +
				url
					.split("/")
					.slice(url.includes("//") ? 3 : 1)
					.join("/")
		)
	}
	match(request: Request): (Request & { parameter: { [key: string]: string | undefined } }) | undefined {
		const match = this.getPath(request.url).match(this.expression)
		return (match && { ...request, parameter: match.groups || {} }) || undefined
	}
	static create(method: Method | Method[], pattern: string, handler: Handler): Route {
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
