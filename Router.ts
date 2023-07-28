import { http } from "cloudly-http"
import { Handler } from "./Handler"
import { Route } from "./Route"
import { Schedule as RouterSchedule } from "./Schedule"

export class Router<T> {
	private readonly routes: Route<T>[] = []
	readonly schedule = new RouterSchedule<T>()
	private readonly options: Router.Options
	constructor(options?: Partial<Router.Options>) {
		this.options = {
			alternatePrefix: [],
			origin: ["*"],
			allowHeaders: ["contentType", "authorization"],
			middleware: http.Middleware.create("server"),
			catch: false,
			...options,
		}
	}
	add(
		method: http.Method | http.Method[],
		pattern: URLPattern | string,
		handler: Handler<T>,
		middleware?: http.Middleware
	) {
		this.routes.push(Route.create(method, pattern, handler, middleware ?? this.options.middleware))
	}
	private async catch(process: () => Promise<http.Response>, allowOrigin: string | undefined): Promise<http.Response> {
		let result: http.Response
		if (this.options.catch)
			try {
				result = await process()
			} catch (error) {
				result =
					typeof this.options.catch == "function"
						? http.Response.create(this.options.catch(error))
						: http.Response.create({
								status: 500,
								header: {
									accessControlAllowOrigin: allowOrigin,
								},
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
				const r = route.match(request, ...this.options.alternatePrefix)
				return r ? [...result, [r, route]] : result
			}, [])
			const match = matches.find(([request, route]) => route.methods.some(m => m == request.method))
			const allowOrigin = this.getOrigin(request)
			result = match
				? await this.catch(() => match[1].handle(match[0], context), allowOrigin)
				: matches.length == 0
				? http.Response.create({ status: 404 })
				: request.method == "OPTIONS"
				? http.Response.create({
						status: 204,
						header: {
							accessControlAllowMethods: matches.flatMap(([_, r]) => r.methods),
							accessControlAllowHeaders: this.options.allowHeaders.map(http.Request.Header.Name.to),
						},
				  })
				: http.Response.create({ status: 405, header: { allow: matches.flatMap(([_, r]) => r.methods) } })
			result = {
				...result,
				header: {
					...result.header,
					accessControlAllowOrigin: allowOrigin,
				},
			}
		} else if (request instanceof Request)
			result = await http.Response.to(await this.handle(await http.Request.from(request, "none"), context), "none")
		else
			result = await this.handle(http.Request.create(request), context)
		return result
	}

	private getOrigin(request: http.Request): string | undefined {
		return this.options.origin.some(
			origin =>
				origin == "*" ||
				(typeof origin != "string" && origin.test(request.url.origin)) ||
				origin == request.header.origin
		)
			? request.header.origin
			: undefined
	}
}

export namespace Router {
	export type Schedule<T> = RouterSchedule<T>
	export namespace Schedule {
		export const Event = RouterSchedule.Event
		export type Event = RouterSchedule.Event
	}
	export interface Options {
		readonly alternatePrefix: string[]
		readonly origin: (string | RegExp)[]
		readonly allowHeaders: (keyof http.Request.Header | string)[]
		readonly middleware: http.Middleware
		readonly catch: boolean | ((exception: unknown) => http.Response.Like)
	}
}
