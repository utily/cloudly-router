import * as CloudRouter from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new CloudRouter.Router()
		expect(router).toMatchObject({})
	})
	it("add route", () => {
		const router = new CloudRouter.Router()
		router.add(["GET", "POST"], "/test/:id/handler", async request => request.url )
		expect(router).toMatchObject({
			origin: ["*"],
			routes: [
				{ 
					expression: /\/test\/(?<id>[^/\?#]*)\/handler/,
					methods: [
						"GET",
						"POST",
					]
				}
			],
		})
	})
})
