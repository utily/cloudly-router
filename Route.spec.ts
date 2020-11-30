import { use, expect } from "chai"
import chaiSubset from "chai-subset"
use(chaiSubset)
import * as cloudRouter from "./index"

describe("Route", () => {
	it("create router", () => {
		const route = cloudRouter.Route.create("GET", "/test", async request => request.url)
		expect(route).containSubset({
			expression: /\/test/,
			methods: [
				"GET",
			],
		})
	})
})
