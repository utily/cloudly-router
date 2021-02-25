import * as http from "cloud-http"
import { Handler } from "./Handler"
import { Route } from "./Route"
import { Callback } from "./Callback"

export class Router {
	private readonly routes: Route[] = []
	private readonly callbacks: Callback[] = []
	origin: string[] = ["*"]
	add(method: http.Method | http.Method[], pattern: string, handler: Handler) {
		this.routes.push(Route.create(method, pattern, handler))
	}
	async finish(): Promise<void> {
		console.log(`Executing ${this.callbacks.length} Callbacks!`)
		await Promise.all(this.callbacks.map(c => c.execute()))
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
						try {
							response = await route.handler(r, this.callbacks)
						} catch (error) {
							this.callbacks.every(c => c.error(error))
							error.message
						}
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
			result = await this.handle(http.Request.create(request))
		return { ...result, header: { ...result.header, accessControlAllowOrigin: this.origin[0] } }
	}
}
