import * as CloudRouter from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new CloudRouter.Router()
		expect(router).toMatchObject({})
	})
})
