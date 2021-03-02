import * as cloudRouter from "./index"

describe("Route", () => {
	it("create router", () => {
		const route = cloudRouter.Route.create("GET", "/test", async (request: any) => request.url)
		expect(route).toMatchObject({
			expression: /\/test/,
			methods: ["GET"],
		})
	})
})
