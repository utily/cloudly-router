import { isly } from "isly"
import * as router from "../index"

describe("router.Api", () => {
	// api.add(router.OpenApi.create(api, "/help"))
	it("isly.Definition", () => {
		expect(pet.definition).toMatchInlineSnapshot(`
			{
			  "class": "object",
			  "description": "A pet.",
			  "name": "Pet",
			  "properties": {
			    "age": {
			      "class": "number",
			      "description": "The pet's age.",
			      "name": "age",
			    },
			    "breed": {
			      "class": "string",
			      "description": "The pet's breed.",
			      "name": "breed",
			    },
			    "name": {
			      "class": "string",
			      "description": "The pet's name.",
			      "name": "name",
			    },
			  },
			}
		`)
	})
	it("from", () => {
		expect(JSON.stringify(router.OpenApi.from(api))).toMatchInlineSnapshot(
			`"{"info":{"description":"This is a test api.","title":"Test server","version":"v1"},"openapi":"3.0.2","paths":{"/pet":{"post":{"description":"Add a new pet","summary":"Create Pet","responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}}},"get":{"description":"Returns a list of pets","summary":"List Pets","responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}}}},"/pet/:id":{"get":{"description":"Returns a single pet","summary":"Get Pet","responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}}}}},"components":{"schemas":{"Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."}}}}}}"`
		)
	})
})
const pet = isly
	.object({
		name: isly.string().rename("name").describe("The pet's name."),
		breed: isly.string().rename("breed").describe("The pet's breed."),
		age: isly.number().rename("age").describe("The pet's age."),
	})
	.rename("Pet")
	.describe("A pet.")
const api = router.Api.create<object>({}, { name: "Test server", description: "This is a test api.", version: "v1" })
api.add({
	title: "Create Pet",
	description: "Add a new pet",
	path: "/pet",
	method: "POST",
	request: {
		body: pet,
	},
	response: {
		body: pet,
		header: { test: isly.string() },
		status: isly.number("value", 201),
	},
	execute: (request, context: object) => {
		return { body: request.body, header: { test: "success" }, status: 201 }
	},
})
api.add({
	title: "List Pets",
	description: "Returns a list of pets",
	path: "/pet",
	method: "GET",
	request: {},
	response: {
		body: pet,
		status: isly.number("value", 200),
	},
	execute: (request, context) => {
		return { body: { name: "Egon Husk", breed: "Dog", age: 2 }, status: 200 }
	},
})
// api.add({
// 	title: "Get Pet",
// 	description: "Returns a single pet",
// 	path: "/pet/:id",
// 	method: "GET",
// 	request: { parameter: { id: isly.string() } },
// 	response: {
// 		body: pet,
// 		status: isly.number("value", 200),
// 	},
// 	execute: (request, context) => {
// 		return { body: { name: "Egon Husk", breed: "Dog", age: 2 }, status: 200 }
// 	},
// })
