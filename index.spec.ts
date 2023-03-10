import "isomorphic-fetch"
import { Router } from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new Router()
		expect(router).toMatchObject({})
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
