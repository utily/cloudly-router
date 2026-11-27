import { isly } from "isly"
import * as router from "../index"

describe("router.Api", () => {
	it("serializes details and definitions", () => {
		expect(api.toJSON()).toMatchObject({
			name: "Test server",
			description: "This is a test api.",
			endpoints: expect.arrayContaining([expect.objectContaining({ title: "Create Resource" })])
		})
		expect(JSON.parse(JSON.stringify(api))).toMatchObject({ name: "Test server", endpoints: expect.any(Array) })
	})
	it("creates request and response definition types", () => {
		const requestDefinition = router.Api.Endpoint.Request.Definition.from({
			parameter: { id: isly.string() },
			search: { filter: isly.string() },
			header: { authorization: isly.string() },
			body: isly.number()
		})
		expect(requestDefinition).toMatchObject({
			parameter: { id: expect.objectContaining({ class: "string" }) },
			search: { filter: expect.objectContaining({ class: "string" }) },
			header: { authorization: expect.objectContaining({ class: "string" }) },
			body: expect.objectContaining({ class: "number" })
		})
		expect(router.Api.Endpoint.Request.Definition.from({ parameter: {}, search: {}, header: {} }).body).toBeUndefined()
		const responseType = router.Api.Endpoint.Response.Configuration.toType({
			status: isly.number("value", 200),
			header: { test: isly.string() },
			body: isly.string()
		})
		expect(responseType.prune({ status: 200, header: { test: "ok" }, body: "result" })).toEqual({
			status: 200,
			header: { test: "ok" },
			body: "result"
		})
	})
	it.each([
		{ name: "valid body", body: [1, 2, 3], expected: [1, 2, 3], header: "success" },
		{
			name: "invalid body",
			body: [1, 2, "3"],
			expected: {
				content: { flaws: [{ index: 2, name: "number" }], name: "number[]" },
				status: 400,
				type: "flawed content"
			},
			header: null
		}
	])("create $name", async ({ body, expected, header }) => {
		const response = await api.router.handle(
			new Request("https://example.com/resource", {
				method: "POST",
				body: JSON.stringify(body),
				headers: { "content-type": "application/json" }
			}),
			context
		)
		expect(await response.json()).toEqual(expected)
		expect(response.headers.get("test")).toBe(header)
	})
	it.each([
		["invalid parameter", "https://example.com/validated/other?filter=expected", validBody, "invalid path argument"],
		["missing search", "https://example.com/validated/expected", validBody, "invalid query argument"],
		["invalid search", "https://example.com/validated/expected?filter=other", validBody, "invalid query argument"],
		["invalid body", "https://example.com/validated/expected?filter=expected", '{"value":"wrong"}', "flawed content"]
	])("validate %s", async (_, url, body, type) => {
		const response = await validationApi.router.handle(
			new Request(url, {
				method: "POST",
				body,
				headers: { authorization: "valid", "content-type": "application/json" }
			}),
			context
		)
		expect(await response.json()).toMatchObject({ type, status: 400 })
	})
	it.each([
		["missing identity", undefined],
		["invalid identity", "invalid"]
	])("validate %s", async (_, authorization) => {
		const response = await validationApi.router.handle(
			new Request("https://example.com/validated/expected?filter=expected", {
				method: "POST",
				body: validBody,
				headers: { ...(authorization && { authorization }), "content-type": "application/json" }
			}),
			context
		)
		expect(await response.json()).toMatchObject({ type: "not authorized", status: 401 })
	})
	it("validate verified identity", async () => {
		const response = await validationApi.router.handle(
			new Request("https://example.com/validated/expected?filter=expected", {
				method: "POST",
				body: validBody,
				headers: { authorization: "valid", "content-type": "application/json" }
			}),
			context
		)
		expect(await response.text()).toBe("verified")
	})
})

type Context = { id: string }
const context: Context = { id: "test" }
const api = router.Api.create<Context>({}, { name: "Test server", description: "This is a test api." })
api.add({
	title: "Create Resource",
	description: "",
	path: "/resource",
	method: "POST",
	request: { body: isly.number().array() },
	response: { body: isly.number().array(), header: { test: isly.string() }, status: isly.number("value", 201) },
	execute: (request, context: Context) => {
		return { body: request.body, header: { test: "success" }, status: 201 }
	}
})

const validBody = JSON.stringify({ value: 1 })
const identity = isly.object<{ id: string }>({ id: isly.string() })
const validationApi = router.Api.create<Context>({})
validationApi.add({
	title: "Validate request",
	description: "",
	path: "/validated/:id",
	method: "POST",
	request: {
		parameter: { id: isly.string("value", "expected") },
		search: { filter: isly.string("value", "expected") },
		body: isly.object({ value: isly.number() }),
		identity: [
			{
				name: "test",
				description: "",
				header: { name: "authorization", type: isly.string() },
				type: identity,
				authenticate: async (token: string) => (token == "valid" ? { id: "verified" } : undefined)
			}
		]
	},
	response: { body: isly.string(), status: isly.number("value", 200) },
	execute: request => ({ body: request.identity.id, status: 200 })
})
