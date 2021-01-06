import * as http from "cloud-http"
import { Handler } from "./Handler"
import { Route } from "./Route"

export class Router {
	private readonly routes: Route[] = []
	origin: string[] = ["*"]
	add(method: http.Method | http.Method[], pattern: string, handler: Handler) {
		this.routes.push(Route.create(method, pattern, handler))
	}
	async handle(request: http.Request.Like | http.Request): Promise<http.Response> {
		let result: http.Response
		if (http.Request.is(request)) {
			let response: http.Response.Like | undefined
			let allowedMethods: http.Method[] = []
			for (const route of this.routes) {
				const r = route.match(request)
				if (r)
					if (route.methods.some(m => m == request.method)) {
						response = await route.handler(request)
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
									accessControlAllowOrigin: this.origin,
									accessControlAllowMethods: allowedMethods,
									accessControlAllowHeaders: "Content-Type",
								},
						  }
						: { status: 405, header: { allow: allowedMethods } })
			)
		} else
			result = await this.handle(http.Request.create(request))
		return result
	}
}
