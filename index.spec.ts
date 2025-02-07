import { http } from "cloudly-http"
import { isly } from "isly"
import { Endpoint, Router } from "./index"

describe("cloud-router", () => {
	it("", () => {
		const fetch = Endpoint.add({
			title: "Create Card",
			description: "",
			path: "",
			method: "POST",
			request: {
				parameters: { id: isly.number() },
				body: isly.number().array(),
			},
			execute: (request, context: { a: string }): any => {
				request.body
				request.parameters.id
				return context.a || request
			},
		})
	})
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
		expect(router).toMatchObject({ routes: [{ pattern: { pathname: "/test/:id/handler" }, methods: ["GET", "POST"] }] })
	})
})
