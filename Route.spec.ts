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
	it("match repeating group with a minimum of one", () => {
		const route = cloudRouter.Route.create("GET", "/test/:id/:trailingpath+", async (request: any) => request.url)
		const request = http.Request.create("https://example.com/test/someid/path/to/something?testquery=value")
		expect(route.match(request)).toEqual({
			...request,
			parameter: { id: "someid", trailingpath: "path/to/something" },
			search: { testquery: "value" },
		})
		const request2 = http.Request.create("https://example.com/test/someid/?testquery=value")
		expect(route.match(request2)).toEqual(undefined)
		const request3 = http.Request.create("https://example.com/test/someid?testquery=value")
		expect(route.match(request3)).toEqual(undefined)
	})
	it("match wildcard", () => {
		const route = cloudRouter.Route.create("GET", "/test/:id/*", async (request: any) => request.url)
		const request = http.Request.create("https://example.com/test/someid/path/to/something?testquery=value")
		expect(route.match(request)).toEqual({
			...request,
			parameter: { id: "someid" },
			search: { testquery: "value" },
		})
	})
})
