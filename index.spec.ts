import "isomorphic-fetch"
import { http } from "cloudly-http"
import { Router } from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new Router()
		expect(router).toMatchObject({})
	})
	it("context as object", async () => {
		const request: http.Request.Like = { url: new URL("http://localhost") }

		const router = new Router<object>({ catch: true })
		const result = await router.handle(request, {})
		expect(result).toMatchObject({ status: 404 })
	})
	it("context as factory", async () => {
		type Context = { request: http.Request.Like; environment: Record<string, unknown> }
		const environment = { secret: true }
		const request: http.Request.Like = { url: new URL("http://localhost") }

		const router = new Router<Context>({ catch: true })
		const result = await router.handle(request, request => ({ request, environment }))
		expect(result).toMatchObject({ status: 404 })
	})
	it("add route", () => {
		const router = new Router()
		router.add(["GET", "POST"], "/test/:id/handler", async (request: any) => request.url)
		expect(router).toMatchObject({
			routes: [
				{
					pattern: { pathname: "/test/:id/handler" },
					methods: ["GET", "POST"],
				},
			],
		})
	})
})
