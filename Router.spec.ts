import { http } from "cloudly-http"
import { Router } from "./index"

describe("Router", () => {
	it("create", () => {
		const router = new Router({ catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(router).toMatchObject({
			options: { origin: ["*"] },
			routes: [{ pattern: { pathname: "/test" }, methods: ["GET"] }],
		})
	})
	it("handle", async () => {
		const router = new Router({ catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(await router.handle(http.Request.create("https://example.com/test"), {})).toEqual({
			body: "/test",
			header: { contentType: "text/plain; charset=utf-8" },
			status: 200,
		})
	})
	it("handle global request", async () => {
		const router = new Router({ catch: true })
		router.add("GET", "/test", async (request: http.Request) => ({ body: "body", status: 201 }))
		const headers = (
			await router.handle(
				new Request("https://example.com/test", { method: "GET", headers: { origin: "http://origin:42" } }),
				{}
			)
		).headers
		expect({
			"access-control-allow-origin": headers.get("access-control-allow-origin"),
			"content-type": headers.get("content-type"),
		}).toEqual({ "access-control-allow-origin": "http://origin:42", "content-type": "text/plain; charset=utf-8" })
	})
	it("handle exception", async () => {
		const router = new Router({ catch: true })
		router.add("GET", "/test", async (request: http.Request) => {
			throw new Error("error on line 42!")
		})
		const headers = (
			await router.handle(
				new Request("https://example.com/test", { method: "GET", headers: { origin: "http://origin:42" } }),
				{}
			)
		).headers
		expect({
			"access-control-allow-origin": headers.get("access-control-allow-origin"),
			"content-type": headers.get("content-type"),
		}).toEqual({ "access-control-allow-origin": "http://origin:42", "content-type": "application/json; charset=utf-8" })
	})

	it("handle options", async () => {
		const router = new Router({ catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(
			await router.handle(
				http.Request.create({
					method: "OPTIONS",
					url: "https://example.com/test",
					header: { origin: "http://origin:42" },
				}),
				{}
			)
		).toEqual({
			body: undefined,
			header: {
				accessControlAllowHeaders: ["Content-Type", "Authorization"],
				accessControlAllowMethods: ["GET"],
				accessControlAllowOrigin: "http://origin:42",
				contentType: undefined,
			},
			status: 204,
		})
	})
	it("alternate prefix", async () => {
		const router = new Router({ alternatePrefix: ["/api"], catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(await router.handle(http.Request.create("https://example.com/api/test"), {})).toEqual({
			status: 200,
			header: { contentType: "text/plain; charset=utf-8" },
			body: "/api/test",
		})
	})
	it("custom allow headers on options", async () => {
		const router = new Router({ allowHeaders: ["contentType", "authorization", "xAuthToken"], catch: false })
		router.add("POST", "/test", async (request: http.Request) => request.url.pathname)
		expect(
			await router.handle(
				http.Request.create({
					method: "OPTIONS",
					url: "https://example.com/test",
					header: { origin: "http://origin:42" },
				}),
				{}
			)
		).toEqual({
			status: 204,
			header: {
				accessControlAllowMethods: ["POST"],
				accessControlAllowOrigin: "http://origin:42",
				accessControlAllowHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
			},
		})
	})
	it("fallback", async () => {
		const router = new Router({ allowHeaders: ["contentType", "authorization", "xAuthToken"], catch: false })
		router.add("POST", "/test", async (request: http.Request) => request.url.pathname)
		const notFound: Router.Fallback = {
			notFound: async (request: http.Request, context) =>
				http.Response.create(
					{
						status: 404,
						body: {
							error: `No endpoint found with url "${request.url}"`,
							description: `Please use url "${request.url.origin}/test" and method "POST"`,
						},
					},
					"application/json; charset=utf-8"
				),
		}
		expect(
			await router.handle(http.Request.create({ method: "OPTIONS", url: "https://example.com/notFound" }), {}, notFound)
		).toEqual({
			body: {
				description: 'Please use url "https://example.com/test" and method "POST"',
				error: 'No endpoint found with url "https://example.com/notFound"',
			},
			header: { accessControlAllowOrigin: undefined, contentType: "application/json; charset=utf-8" },
			status: 404,
		})
	})
	it("caught error", async () => {
		const router = new Router({ allowHeaders: ["contentType", "authorization", "xAuthToken"], catch: true })
		router.add("POST", "/test", async (request: http.Request) => {
			throw new Error("Test Error")
		})
		expect(
			await (
				await router.handle(new Request("https://example.com/test", { method: "POST", body: JSON.stringify({}) }), {})
			).json()
		).toEqual({ description: "Error: Test Error", error: "exception", status: 500, type: "unknown error" })
	})
	it("working endpoint", async () => {
		const router = new Router({ allowHeaders: ["contentType", "authorization", "xAuthToken"], catch: true })
		router.add("POST", "/test", async (request: http.Request) => {
			return { test: "test" }
		})
		expect(
			await (
				await router.handle(new Request("https://example.com/test", { method: "POST", body: JSON.stringify({}) }), {})
			).json()
		).toEqual({ test: "test" })
	})
	it("empty body", async () => {
		const router = new Router({
			catch: true,
			alternatePrefix: [],
			allowHeaders: ["contentType", "authorization", "organization", "account", "realm", "cursor", "limit"],
		})
		router.add("GET", "/test", async (request: http.Request) => undefined)
		expect(await (await router.handle(new Request("https://example.com/test", { method: "GET" }), {})).text()).toEqual(
			""
		)
	})
})
