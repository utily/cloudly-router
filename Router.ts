import * as http from "cloudly-http"
import { Handler } from "./Handler"
import * as platform from "./platform"
import { Route } from "./Route"

export class Router<T> {
	private readonly alternatePrefix: string[]
	private readonly routes: Route<T>[] = []
	origin: string[] = ["*"]
	allowedHeaders = ["Content-Type", "Authorization"]

	constructor(...alternatePrefix: string[]) {
		this.alternatePrefix = alternatePrefix
	}
	add(method: http.Method | http.Method[], pattern: URLPattern | string, handler: Handler<T>, parse = true) {
		this.routes.push(Route.create(method, pattern, handler, parse))
	}
	async handle(
		request: http.Request.Like | http.Request | platform.Request,
		context: T
	): Promise<http.Response | platform.Response> {
		let result: http.Response | platform.Response
		if (http.Request.is(request) || request instanceof platform.Request) {
			let response: http.Response.Like | platform.Response | undefined
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
			result =
				response instanceof platform.Response
					? response
					: http.Response.create(
							response ||
								(allowedMethods.length == 0
									? { status: 404 }
									: request.method == "OPTIONS"
									? {
											status: 204,
											header: {
												accessControlAllowMethods: allowedMethods,
												accessControlAllowHeaders: this.allowedHeaders,
											},
									  }
									: { status: 405, header: { allow: allowedMethods } })
					  )
		} else
			result = await this.handle(http.Request.create(request), context)
		return result instanceof platform.Response
			? result
			: { ...result, header: { ...result.header, accessControlAllowOrigin: this.origin[0] } }
	}
}
