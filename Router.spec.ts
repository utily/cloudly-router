import * as cloudRouter from "./index"

describe("Router", () => {
	it("create router", () => {
		const router = new cloudRouter.Router()
		router.add("GET", "/test", async (request: any) => request.url)
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
})
