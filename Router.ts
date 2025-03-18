import { http } from "cloudly-http"
import { Handler } from "./Handler"
import { Route } from "./Route"
import { Schedule as RouterSchedule } from "./Schedule"

export class Router<T extends object> {
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
	private async catch(process: () => Promise<http.Response>): Promise<http.Response> {
		let result: http.Response
		if (this.options.catch)
			try {
				result = await process()
			} catch (error) {
				result = await http.Serializer.serialize(
					typeof this.options.catch == "function"
						? http.Response.create(this.options.catch(error), "application/json; charset=utf-8")
						: http.Response.create(
								{
									status: 500,
									type: "unknown error",
									error: "exception",
									description: (typeof error == "object" && error && error.toString()) || undefined,
								},
								"application/json; charset=utf-8"
						  )
				)
			}
		else
			result = await process()
		return result
	}
	async handle(
		request: Request,
		context: T | ((request: http.Request) => T),
		fallback?: Router.Fallback<T>
	): Promise<Response>
	async handle(
		request: http.Request.Like | http.Request,
		context: T | ((request: http.Request) => T),
		fallback?: Router.Fallback<T>
	): Promise<http.Response>
	async handle(
		request: http.Request.Like | http.Request | Request,
		context: T | ((request: http.Request) => T),
		fallback?: Router.Fallback<T>
	): Promise<http.Response | Response> {
		let result: http.Response | Response
		if (request instanceof Request)
			result = await http.Response.to(
				await this.handle(await http.Request.from(request, "none"), context, fallback),
				"none"
			)
		else if (!http.Request.is(request))
			result = await this.handle(http.Request.create(request), context, fallback)
		else {
			const matches = this.match(request)
			const match = matches.find(match => match.route.methods.some(m => m == request.method))
			if (match)
				result = await this.catch(() =>
					match.route.handle(match.request, typeof context == "function" ? context(match.request) : context)
				)
			else if (matches.length == 0)
				result =
					(await fallback?.notFound(request, typeof context == "function" ? context(request) : context)) ??
					http.Response.create({ status: 404 })
			else if (request.method == "OPTIONS")
				result = http.Response.create({
					status: 204,
					header: {
						accessControlAllowMethods: matches.flatMap(match => match.route.methods),
						accessControlAllowHeaders: this.options.allowHeaders.map(http.Request.Header.Name.to),
					},
				})
			else
				result = http.Response.create({ status: 405, header: { allow: matches.flatMap(match => match.route.methods) } })
			result = { ...result, header: { ...result.header, accessControlAllowOrigin: this.getOrigin(request) } }
		}
		return result
	}
	private match(request: http.Request): { request: http.Request; route: Route<T> }[] {
		return this.routes.reduce<{ request: http.Request; route: Route<T> }[]>((result, route) => {
			const match = route.match(request, ...this.options.alternatePrefix)
			if (match)
				result.push({ request: match, route })
			return result
		}, [])
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
	export type Fallback<T = unknown> = { notFound: (request: http.Request, context: T) => Promise<http.Response> }
	export import Schedule = RouterSchedule
	export interface Options {
		readonly alternatePrefix: string[]
		readonly origin: (string | RegExp)[]
		readonly allowHeaders: (keyof http.Request.Header | string)[]
		readonly middleware: http.Middleware
		readonly catch: boolean | ((exception: unknown) => http.Response.Like)
	}
}
