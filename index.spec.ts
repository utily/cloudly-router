import { use, expect } from "chai"
import chaiSubset from "chai-subset"
use(chaiSubset)
import * as CloudRouter from "./index"

describe("cloud-router", () => {
	it("create router", () => {
		const router = new CloudRouter.Router()
		expect(router).containSubset({})
	})
	it("add route", () => {
		const router = new CloudRouter.Router()
		router.add(["GET", "POST"], "/test/:id/handler", async request => request.url )
		expect(router).containSubset({
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
