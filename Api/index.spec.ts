import { http } from "cloudly-http"
import { isly } from "isly"
import * as router from "../index"

describe("router.Api", () => {
	// api.add(router.OpenApi.create(api, "/help"))
	it("Create Success", async () => {
		const response = await api.router.handle(
			new Request("https://example.com/resource", {
				method: "POST",
				body: JSON.stringify([1, 2, 3]),
				headers: { "content-type": "application/json" },
			}),
			context
		)
		expect(await response.json()).toMatchInlineSnapshot(`
			[
			  1,
			  2,
			  3,
			]
		`)
		expect(response.headers.get("test")).toMatchInlineSnapshot(`"success"`)
	})
	it("Create Failed", async () => {
		const response = await api.router.handle(
			new Request("https://example.com/resource", {
				method: "POST",
				body: JSON.stringify([1, 2, "3"]),
				headers: { "content-type": "application/json" },
			}),
			context
		)
		expect(await response.json()).toMatchInlineSnapshot(
			`
			{
			  "content": {
			    "flaws": [
			      {
			        "index": 2,
			        "name": "number",
			      },
			    ],
			    "name": "number[]",
			  },
			  "status": 400,
			  "type": "flawed content",
			}
		`
		)
		expect(response.headers.get("test")).toMatchInlineSnapshot(`null`)
	})
})

type Context = {
	id: string
}
const context: Context = { id: "test" }
const api = router.Api.create<Context>({}, { name: "Test server", description: "This is a test api.", version: "v1" })
api.add({
	title: "Create Resource",
	description: "",
	path: "/resource",
	method: "POST",
	request: {
		body: isly.number().array(),
	},
	response: {
		body: isly.number().array(),
		header: { test: isly.string() },
		status: isly.number("value", 201),
	},
	execute: (request, context: Context) => {
		return { body: request.body, header: { test: "success" }, status: 201 }
	},
})
