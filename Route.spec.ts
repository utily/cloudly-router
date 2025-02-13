import { http } from "cloudly-http"
import { Route } from "./Route"

describe("Route", () => {
	it("create", () => {
		const route = Route.create("GET", "/test", async (request: any) => request.url, undefined)
		expect(route).toMatchObject({ pattern: {}, methods: ["GET"] })
	})
	it("match", () => {
		const route = Route.create("GET", "/test", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test")
		expect(route.match(request)).toEqual({ ...request, parameter: {} })
	})
	it("match trailing /", () => {
		const route = Route.create("GET", "/test", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test/")
		expect(route.match(request)).toEqual({ ...request, parameter: {} })
	})
	it("match trailing / parameter", () => {
		const route = Route.create("GET", "/test/:id", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test/asdf/")
		expect(route.match(request)).toEqual({ ...request, parameter: { id: "asdf" } })
	})
	it("match alternatePrefix", () => {
		const route = Route.create("GET", "/test", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/api/test")
		expect(route.match(request, "/api")).toEqual({ ...request, parameter: {} })
	})
	it("match repeating group with a minimum of one", () => {
		const route = Route.create("GET", "/test/:id/:trailingPath+", async (request: any) => request.url, undefined)
		const request = http.Request.create("https://example.com/test/someid/path/to/something?testquery=value")
		expect(route.match(request)).toEqual({
			...request,
			parameter: { id: "someid", trailingPath: "path/to/something" },
			search: { testquery: "value" },
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
			search: { testquery: "value" },
		})
	})
})
