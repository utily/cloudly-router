import { http } from "cloudly-http"
import { Router } from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new Router()
		expect(router).toMatchObject({})
	})
	it.each([
		{ name: "object", context: {} },
		{ name: "factory", context: (request: http.Request.Like) => ({ request, environment: { secret: true } }) }
	])("handle context as $name", async ({ context }) => {
		const request: http.Request.Like = { url: new URL("http://localhost") }
		const router = new Router({ catch: true })
		const result = await router.handle(request, context)
		expect(result).toMatchObject({ status: 404 })
	})
	it("add route", () => {
		const router = new Router()
		router.add(["GET", "POST"], "/test/:id/handler", async (request: any) => request.url)
		expect(router).toMatchObject({ routes: [{ pattern: { pathname: "/test/:id/handler" }, methods: ["GET", "POST"] }] })
	})
})
