import { http } from "cloudly-http"
import { Route } from "../Route"

describe("Route", () => {
	it.each([
		{ name: "string pattern", method: "GET" as http.Method, pattern: "/test", methods: ["GET"], middleware: undefined },
		{
			name: "URLPattern and middleware",
			method: ["GET", "POST"] as http.Method[],
			pattern: new URLPattern({ pathname: "/test/:id" }),
			methods: ["GET", "POST"],
			middleware: http.Middleware.create("identity")
		}
	])("create $name", ({ method, pattern, methods, middleware }) => {
		const route = Route.create(method, pattern, async (request: any) => request.url, middleware)
		expect(route.methods).toEqual(methods)
		if (middleware) expect(route.middleware).toBe(middleware)
	})
	it.each([
		{ name: "match", pattern: "/test", url: "https://example.com/test", prefix: undefined, parameter: {} },
		{ name: "no match", pattern: "/test", url: "https://example.com/other", prefix: undefined, parameter: undefined },
		{ name: "trailing slash", pattern: "/test", url: "https://example.com/test/", prefix: undefined, parameter: {} },
		{
			name: "trailing slash parameter",
			pattern: "/test/:id",
			url: "https://example.com/test/asdf/",
			prefix: undefined,
			parameter: { id: "asdf" }
		},
		{ name: "alternate prefix", pattern: "/test", url: "https://example.com/api/test", prefix: "/api", parameter: {} }
	])("match $name", ({ pattern, url, prefix, parameter }) => {
		const route = Route.create("GET", pattern, async (request: any) => request.url, undefined)
		const request = http.Request.create(url)
		expect(route.match(request, ...(prefix ? [prefix] : []))).toEqual(
			parameter === undefined ? undefined : { ...request, parameter }
		)
	})
	it("match missing groups", () => {
		const route = Route.create(
			"GET",
			{ exec: () => ({ pathname: { groups: undefined } }) } as unknown as URLPattern,
			async (request: any) => request.url,
			undefined
		)
		const request = http.Request.create("https://example.com/test")
		expect(route.match(request)).toEqual({ ...request, parameter: {} })
	})
	it("match repeating group with a minimum of one", () => {
		const route = Route.create("GET", "/test/:id/:trailingPath+", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test/someid/path/to/something?testquery=value")
		expect(route.match(request)).toEqual({
			...request,
			parameter: { id: "someid", trailingPath: "path/to/something" },
			search: { testquery: "value" }
		})
		const request2 = http.Request.create("https://example.com/test/someid/?testquery=value")
		expect(route.match(request2)).toEqual(undefined)
		const request3 = http.Request.create("https://example.com/test/someid?testquery=value")
		expect(route.match(request3)).toEqual(undefined)
	})
	it("match wildcard", () => {
		const route = Route.create("GET", "/test/:id/*", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test/someid/path/to/something?testquery=value")
		expect(route.match(request)).toEqual({
			...request,
			parameter: { "0": "path/to/something", id: "someid" },
			search: { testquery: "value" }
		})
	})
	it("handle wraps handler result", async () => {
		let fromMiddleware: http.Response | undefined
		const middleware: http.Middleware = async (request, next) => {
			fromMiddleware = await next(request)
			return fromMiddleware
		}
		const route = Route.create("GET", "/test", async () => ({ message: "ok" }), middleware)
		const request = http.Request.create("https://example.com/test")
		const response = await route.handle(request, {})
		expect(fromMiddleware).toEqual(http.Response.create({ message: "ok" }))
		expect(response).toEqual(http.Response.create({ message: "ok" }))
	})
})
