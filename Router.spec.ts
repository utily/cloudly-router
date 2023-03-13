import "isomorphic-fetch"
import { http } from "cloudly-http"
import { Router } from "./index"

describe("Router", () => {
	it("create", () => {
		const router = new Router({ catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(router).toMatchObject({
			options: { origin: ["*"] },
			routes: [
				{
					pattern: { pathname: "/test" },
					methods: ["GET"],
				},
			],
		})
	})
	it("handle", async () => {
		const router = new Router({ catch: false })
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(await router.handle(http.Request.create("https://example.com/test"), {})).toEqual({
			body: "/test",
			header: {
				contentType: "text/plain; charset=utf-8",
			},
			status: 200,
		})
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
})
