import "isomorphic-fetch"
import { http } from "cloudly-http"
import { Router } from "./index"

describe("cloud-router", () => {
	const router = new Router<object>()
	const endpoint: Router.Endpoint
	router.
	it("create router", () => {
		const router = new Router()
		expect(router).toMatchObject({})
	})
})
