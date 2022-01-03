import * as cloudRouter from "./index"
import * as http from "cloudly-http"

describe("Route", () => {
	it("create", () => {
		const route = cloudRouter.Route.create("GET", "/test", async (request: any) => request.url)
		expect(route).toMatchObject({
			expression: /\/test/,
			methods: ["GET"],
		})
	})
	it("match", () => {
		const route = cloudRouter.Route.create("GET", "/test", async (request: any) => request.url)
		const request = http.Request.create("https://example.com/test")
		expect(route.match(request)).toEqual({
			...request,
			parameter: {},
		})
	})
	it("match alternatePrefix", () => {
		const route = cloudRouter.Route.create("GET", "/test", async (request: any) => request.url)
		const request = http.Request.create("https://example.com/api/test")
		expect(route.match(request, "api")).toEqual({
			...request,
			parameter: {},
		})
	})
})
