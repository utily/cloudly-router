import "isomorphic-fetch"
import { http } from "cloudly-http"
import { isly } from "isly"
import { Router } from "./index"

interface Item {
	id: string
	value: number
}
const itemType = isly.object<Item>({ id: isly.string(), value: isly.number() })

describe("cloud-router", () => {
	const router = new Router<object>()
	const endpoint: Router.Endpoint<object> = {
		title: "Item fetch",
		description: "Get item by id",
		method: "GET",
		path: "/item/:id",
		execute: () => {
			return {} as any
		},
		request: { authentication: [], search: {}, parameters: { id: isly.string() }, headers: {}, body: isly.undefined() },
		response: [{ status: 200, headers: {}, body: itemType }],
	}
	router.endpoint(endpoint)
	router.it("create router", () => {
		const router = new Router()
		expect(router).toMatchObject({})
	})
})
