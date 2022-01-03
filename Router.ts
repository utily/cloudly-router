import * as http from "cloudly-http"
import { Handler } from "./Handler"
import { Route } from "./Route"

export class Router<T> {
	private readonly alternatePrefix: string[]
	private readonly routes: Route<T>[] = []
	origin: string[] = ["*"]
	constructor(...alternatePrefix: string[]) {
		this.alternatePrefix = alternatePrefix
	}
	add(method: http.Method | http.Method[], pattern: string, handler: Handler<T>) {
		this.routes.push(Route.create(method, pattern, handler))
	}
	async handle(request: http.Request.Like | http.Request, context: T): Promise<http.Response> {
		let result: http.Response
		if (http.Request.is(request)) {
			let response: http.Response.Like | undefined
			let allowedMethods: http.Method[] = []
			for (const route of this.routes) {
				const r = route.match(request, ...this.alternatePrefix)
				if (r)
					if (route.methods.some(m => m == request.method)) {
						response = await route.handler(r, context)
						break
					} else
						allowedMethods = allowedMethods.concat(...route.methods)
			}
			result = http.Response.create(
				response ||
					(allowedMethods.length == 0
						? { status: 404 }
						: request.method == "OPTIONS"
						? {
								status: 204,
								header: {
									accessControlAllowMethods: allowedMethods,
									accessControlAllowHeaders: ["Content-Type", "Authorization"],
								},
						  }
						: { status: 405, header: { allow: allowedMethods } })
			)
		} else
			result = await this.handle(http.Request.create(request), context)
		return { ...result, header: { ...result.header, accessControlAllowOrigin: this.origin[0] } }
	}
}
