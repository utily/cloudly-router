import { http } from "cloudly-http"
import { isly } from "isly"
import { Endpoint, Endpoint as RouterEndpoint } from "./Endpoint"
import { Handler } from "./Handler"
import { Route } from "./Route"
import { Schedule as RouterSchedule } from "./Schedule"
import { schema } from "./schema"

export class Router<T extends object> {
	private readonly routes: Route<T>[] = []
	readonly schedule = new RouterSchedule<T>()
	private readonly options: Router.Options
	private readonly endpoints: Router.Endpoint<T, any, any, any, any>[] = []
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
				result = await http.Serializer.serialize(
					typeof this.options.catch == "function"
						? http.Response.create(this.options.catch(error), "application/json; charset=utf-8")
						: http.Response.create(
								{
									status: 500,
									header: {
										accessControlAllowOrigin: allowOrigin,
									},
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
		if (http.Request.is(request)) {
			const matches = this.routes.reduce<[http.Request, Route<T>][]>((result, route) => {
				const r = route.match(request, ...this.options.alternatePrefix)
				return r ? [...result, [r, route]] : result
			}, [])
			const match = matches.find(([request, route]) => route.methods.some(m => m == request.method))
			const allowOrigin = this.getOrigin(request)
			result = match
				? await this.catch(
						() => match[1].handle(match[0], typeof context == "function" ? context(match[0]) : context),
						allowOrigin
				  )
				: matches.length == 0
				? (await fallback?.notFound(request, typeof context == "function" ? context(request) : context)) ??
				  http.Response.create({ status: 404 })
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
			result = await http.Response.to(
				await this.handle(await http.Request.from(request, "none"), context, fallback),
				"none"
			)
		else
			result = await this.handle(http.Request.create(request), context, fallback)
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

	declare<
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(endpoint: Endpoint<T, S, P, H, B>): void {
		this.endpoints.push(endpoint)

		const doer = async (request: http.Request, context: T) => {
			let result: any
			// TODO: return errors
			// TODO: fix the types
			const path: P = (endpoint.request.parameters &&
				Object.fromEntries(
					Object.entries(endpoint.request.parameters).map(
						([name, value]) => [name, value.get(endpoint.request.parameters?.[name])] as [string, P[string]]
					)
				)) as P
			const headers: H = (endpoint.request.headers &&
				Object.fromEntries(
					Object.entries(endpoint.request.headers).map(([name, value]) => [
						name,
						value.get(endpoint.request.headers?.[name]),
					])
				)) as H
			const search: S = (endpoint.request.search &&
				Object.fromEntries(
					Object.entries(endpoint.request.search).map(([name, value]) => [
						name,
						value.get(endpoint.request.search?.[name]),
					])
				)) as S
			const body: Endpoint.Request["body"] = endpoint.request.body
				? endpoint.request.body.get(await request.body)
				: undefined
			const thingy: Endpoint.Request<S, P, H, B> = {
				body,
				headers: headers,
				search: search,
				parameters: path,
			}
			return await endpoint.execute(thingy, context)
		}

		this.add(endpoint.method, endpoint.path, doer)
	}
	docs(path: string, settings: { url: string; title: string; version: string }) {
		this.add("GET", path, async () => {
			const result: schema.OpenAPI = {
				info: { title: settings.title, version: settings.version },
				servers: [{ url: settings.url }],
				openapi: "3.1.0",
				paths: this.endpoints.reduce<schema.Paths>((result, endpoint) => {
					return { ...result, [endpoint.path]: { ...RouterEndpoint.schemaify(endpoint), ...result[endpoint.path] } }
				}, {}),
			}
			return result
		})
	}
}

export namespace Router {
	export import Endpoint = RouterEndpoint
	export type Fallback<T = unknown> = {
		notFound: (request: http.Request, context: T) => Promise<http.Response>
	}
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
