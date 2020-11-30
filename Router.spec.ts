import { use, expect } from "chai"
import chaiSubset from "chai-subset"
use(chaiSubset)
import * as cloudRouter from "./index"

describe("Router", () => {
	it("create router", () => {
		const router = new cloudRouter.Router()
		router.add("GET", "/test", async request => request.url)
		expect(router).containSubset({
			origin: [ "*" ],
			routes: [{
				expression: /\/test/,
				methods: [
					"GET",
				],
			}],
		})
	})
})
