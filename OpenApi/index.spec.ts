import { isly } from "isly"
import * as router from "../index"

describe("OpenApi", () => {
	// api.add(router.OpenApi.create(api, "/help"))
	it("from", () => {
		expect(JSON.stringify(router.OpenApi.from(api))).toMatchInlineSnapshot(
			`"{"info":{"description":"Api documentation for the pet store","title":"Pet Store","version":"v1"},"openapi":"3.0.2","paths":{"/pet":{"post":{"description":"Adds a new pet","summary":"Create Pet","parameters":[],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}},"responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}},"tags":["Pet"]},"get":{"description":"Returns a list of pets","summary":"List Pets","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}},"tags":["Pet"]}},"/pet/{id}":{"get":{"description":"Returns a single pet","summary":"Get Pet","parameters":[{"in":"path","description":"The pet's id","name":"id","schema":{"type":"string","description":"The pet's id"},"required":true}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Successful operation"}},"tags":["Pet"]}},"/food":{"get":{"description":"Returns a list of foods","summary":"List Food","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/foods"}}},"description":"Successful operation"}},"tags":["Food"]}}},"components":{"schemas":{"Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."}}},"foods":{"type":"array","description":"List of foods"}}},"tags":[{"description":"Endpoints to handle pets.","name":"Pet"}]}"`
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
const api = router.Api.create<object>(
	{},
	{
		name: "Pet Store",
		description: "Api documentation for the pet store",
		version: "v1",
		collections: [{ name: "Pet", description: "Endpoints to handle pets." }],
	}
)
api.add({
	title: "Create Pet",
	description: "Adds a new pet",
	collection: ["Pet"],
	path: "/pet",
	method: "POST",
	request: {
		body: pet,
	},
	response: {
		body: pet,
		header: { test: isly.string() },
		status: isly.number("value", 201).describe("Pet created"),
	},
	execute: (request, context: object) => {
		return { body: request.body, header: { test: "success" }, status: 201 }
	},
})
api.add({
	title: "List Pets",
	description: "Returns a list of pets",
	collection: ["Pet"],
	path: "/pet",
	method: "GET",
	request: {},
	response: {
		body: pet,
		status: isly.number("value", 200).describe("Pets listed"),
	},
	execute: (request, context) => {
		return { body: { name: "Egon Husk", breed: "Dog", age: 2 }, status: 200 }
	},
})
api.add({
	title: "Get Pet",
	description: "Returns a single pet",
	collection: ["Pet"],
	path: "/pet/:id",
	method: "GET",
	request: { parameter: { id: isly.string().rename("id").describe("The pet's id") } },
	response: {
		body: pet,
		status: isly.number("value", 200),
	},
	execute: (request, context) => {
		return { body: { name: "Egon Husk", breed: "Dog", age: 2 }, status: 200 }
	},
})
api.add({
	title: "List Food",
	description: "Returns a list of foods",
	collection: ["Food"],
	path: "/food",
	method: "GET",
	request: {},
	response: {
		body: isly.string().array().rename("foods").describe("List of foods"),
		status: isly.number("value", 200).describe("Food listed"),
	},
	execute: (request, context) => {
		return { body: ["Dog food", "Cat food"], status: 200 }
	},
})
