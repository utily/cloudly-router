import * as cloudRouter from "./index"
import * as http from "cloudly-http"

describe("Router", () => {
	it("create", () => {
		const router = new cloudRouter.Router()
		router.add("GET", "/test", async (request: http.Request) => request.url.pathname)
		expect(router).toMatchObject({
			origin: ["*"],
			routes: [
				{
					expression: /\/test/,
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
})
