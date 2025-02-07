import "isomorphic-fetch"
import { isly } from "isly"
import { Router } from "./index"

interface Item {
	id: string
	value: number
}
const itemType = isly.object<Item>({ id: isly.string(), value: isly.number() })

describe("Declarative endpoints", () => {
	const router = new Router<object>()
	const endpoint: Router.Endpoint<object> = {
		title: "Item fetch",
		description: "Get item by id",
		method: "GET",
		path: "/item/:id",
		execute: async () => ({ id: "1", value: 1 }),
		request: { authentication: [], search: {}, parameters: { id: isly.string() }, headers: {}, body: isly.undefined() },
		response: { status: 200, headers: {}, body: itemType, description: "item" },
	}
	router.endpoint(endpoint)
	router.docs("/docs", { title: "Test", url: "http://localhost", version: "1.0.0" })
	it("should find an endpoint", async () => {
		const request: Request = new Request("http://localhost/item/1", { method: "GET" })
		const response = await router.handle(request, {})
		const body = await response.json()
		expect(body).toMatchObject({ id: "1", value: 1 })
	})
	it("should generate docs", async () => {
		const request: Request = new Request("http://localhost/docs", { method: "GET" })
		const response = await router.handle(request, {})
		const body = await response.json()
		expect(body).toMatchObject({
			info: { title: "Test", version: "1.0.0" },
			openapi: "3.1.0",
			paths: {
				"/item/:id": {
					GET: {
						description: "Get item by id",
						parameters: [{ in: "path", name: "id", required: true }],
						requestBody: { content: { "application/json": {} } },
						responses: { "200": { content: { "application/json": {} }, description: "item", headers: {} } },
						summary: "Item fetch",
					},
				},
			},
			servers: [{ url: "http://localhost" }],
		})
	})
})
