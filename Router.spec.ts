import "isomorphic-fetch"
import * as http from "cloudly-http"
import * as cloudRouter from "./index"

describe("Router", () => {
	it("create", () => {
		const router = new cloudRouter.Router()
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(router).toMatchObject({
			origin: ["*"],
			routes: [
				{
					pattern: { pathname: "/test" },
					methods: ["GET"],
				},
			],
		})
	})
	it("handle", async () => {
		const router = new cloudRouter.Router()
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(await router.handle(http.Request.create("https://example.com/test"), {})).toMatchObject({
			body: "/test",
		})
	})
	it("alternate prefix", async () => {
		const router = new cloudRouter.Router("/api")
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(await router.handle(http.Request.create("https://example.com/api/test"), {})).toMatchObject({
			body: "/api/test",
		})
	})
	it("custom allow headers on options", async () => {
		const router = new cloudRouter.Router()
		router.allowedHeaders.push("X-Auth-Token")
		router.add("POST", "/test", async (request: http.Request) => request.url.pathname)
		expect(
			await router.handle(http.Request.create({ method: "OPTIONS", url: "https://example.com/test" }), {})
		).toMatchObject({
			header: {
				accessControlAllowMethods: ["POST"],
				accessControlAllowOrigin: "*",
				accessControlAllowHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
			},
		})
	})
})
