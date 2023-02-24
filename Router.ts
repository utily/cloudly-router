import { http } from "cloudly-http"
import { Handler } from "./Handler"
import { Route } from "./Route"

export class Router<T> {
	private readonly routes: Route<T>[] = []
	private readonly options: Router.Options
	constructor(options?: Partial<Router.Options>) {
		this.options = { alternatePrefix: [], origin: ["*"], allowHeaders: ["contentType", "authorization"], ...options }
	}
	add(
		method: http.Method | http.Method[],
		pattern: URLPattern | string,
		handler: Handler<T>,
		middleware?: http.Middleware
	) {
		this.routes.push(Route.create(method, pattern, handler, middleware ?? this.options.middleware))
	}
	private async catch(process: () => Promise<http.Response.Like>): Promise<http.Response.Like> {
		let result: http.Response.Like
		if (this.options.catch)
			try {
				result = await process()
			} catch (error) {
				result = http.Response.create({
					status: 500,
					type: "unknown error",
					error: "exception",
					description: (typeof error == "object" && error && error.toString()) || undefined,
				})
			}
		else
			result = await process()
		return result
	}
	async handle(request: http.Request.Like | http.Request, context: T): Promise<http.Response>
	async handle(request: Request, context: T): Promise<Response>
	async handle(request: http.Request.Like | http.Request | Request, context: T): Promise<http.Response | Response> {
		let result: http.Response | Response
		if (http.Request.is(request)) {
			const matches = this.routes.reduce<[http.Request, Route<T>][]>((result, route) => {
				const r = route.match(request)
				return r ? [...result, [r, route]] : result
			}, [])
			const match = matches.find(([request, route]) => route.methods.some(m => m == request.method))
			result = http.Response.create(
				match
					? this.catch(() => match[1].handle(match[0], context))
					: matches.length == 0
					? { status: 404 }
					: request.method == "OPTIONS"
					? {
							status: 204,
							header: {
								accessControlAllowMethods: matches.flatMap(([_, r]) => r.methods),
								accessControlAllowHeaders: this.options.allowHeaders,
							},
					  }
					: { status: 405, header: { allow: matches.flatMap(([_, r]) => r.methods) } }
			)
			result = {
				...result,
				header: {
					...result.header,
					accessControlAllowOrigin: this.options.origin.some(origin =>
						typeof origin == "string"
							? origin == "*" || origin == request.header.origin
							: request.header.origin && origin.test(request.header.origin)
					)
						? request.header.origin
						: "",
				},
			}
		} else if (request instanceof Request)
			result = await http.Response.to(await this.handle(await http.Request.from(request, "none"), context), "none")
		else
			result = await this.handle(http.Request.create(request), context)
		return result
	}
}

export namespace Router {
	export interface Options {
		readonly alternatePrefix: string[]
		readonly origin: (string | RegExp)[]
		readonly allowHeaders: (keyof http.Request.Header | string)[]
		readonly middleware?: http.Middleware
		readonly catch?: true | ((exception: unknown) => http.Response.Like)
	}
}
