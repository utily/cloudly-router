import * as http from "cloud-http"
import { Handler } from "./Handler"
import { Route } from "./Route"

export class Router {
	private readonly routes: Route[] = []
	origin: string[] = ["*"]
	add(method: http.Method | http.Method[], pattern: string, handler: Handler) {
		this.routes.push(Route.create(method, pattern, handler))
	}
	async handle(event: FetchEvent): Promise<void> {
		let result: Response | undefined
		const request = http.Request.from(event.request)
		let allowedMethods: http.Method[] = []
		for (const route of this.routes) {
			const r = route.match(request)
			if (r)
				if (route.methods.some(m => m == event.request.method)) {
					result = await http.Response.to(http.Response.create(await route.handler(request)))
					break
				} else
					allowedMethods = allowedMethods.concat(...route.methods)
		}
		event.respondWith(
			result ||
				(allowedMethods.length == 0
					? new Response(undefined, { status: 404 })
					: event.request.method == "OPTIONS"
					? new Response(undefined, {
							status: 204,
							headers: [
								["Access-Control-Allow-Origin", this.origin.join(", ")],
								["Access-Control-Allow-Methods", allowedMethods.join(", ")],
								["Access-Control-Allow-Headers", "Content-Type"],
							],
					  })
					: new Response(undefined, { status: 405, headers: [["Allow", allowedMethods.join(", ")]] }))
		)
	}
}
