import { isly } from "isly"
import * as router from "../index"

describe("OpenApi", () => {
	api.add(router.OpenApi.endpoint(api, "/help"))
	it("from", () => {
		expect(JSON.stringify(router.OpenApi.from(api))).toMatchInlineSnapshot(
			`"{"info":{"description":"Api documentation for the pet store","title":"Pet Store","version":"v1"},"openapi":"3.0.2","paths":{"/pet":{"post":{"description":"Adds a new pet","summary":"Create Pet","parameters":[],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Store.Pet"}}}},"responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Store.Pet"}}},"description":"Successful operation"}},"tags":["Pet"]},"get":{"description":"Returns a list of pets","summary":"List Pets","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Store.Pet"}}},"description":"Successful operation"}},"tags":["Pet"]}},"/pet/{id}":{"get":{"description":"Returns a single pet","summary":"Fetch a single Pet","parameters":[{"in":"path","description":"The pet's id","name":"id","schema":{"type":"string","description":"The pet's id"},"required":true}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Store.Pet"}}},"description":"Successful operation"}},"tags":["Pet"]}},"/food":{"get":{"description":"Returns a list of foods","summary":"List Food","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Foods"}}},"description":"Successful operation"}},"tags":["Food"]}}},"components":{"schemas":{"Store.Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."}}},"Foods":{"type":"array","description":"List of foods","items":{"type":"string"}}}},"tags":[{"description":"Endpoints to handle pets.","name":"Pet"}]}"`
		)
	})
	it("/help", async () => {
		const response = await api.router.handle(new Request("https://www.example.com/help"), {})
		expect(JSON.stringify(await response.json())).toMatchInlineSnapshot(
			`"{"info":{"description":"Api documentation for the pet store","title":"Pet Store","version":"v1"},"openapi":"3.0.2","paths":{"/pet":{"post":{"description":"Adds a new pet","summary":"Create Pet","parameters":[],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}},"responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pet created"}},"tags":["Pet"]},"get":{"description":"Returns a list of pets","summary":"List Pets","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pets listed"}},"tags":["Pet"]}},"/pet/{id}":{"get":{"description":"Returns a single pet","summary":"Fetch a single Pet","parameters":[{"in":"path","description":"The pet's id","name":"id","schema":{"type":"string","description":"The pet's id"},"required":true}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":""}},"tags":["Pet"]}},"/food":{"get":{"description":"Returns a list of foods","summary":"List Food","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Foods"}}},"description":"Food listed"}},"tags":["Food"]}}},"components":{"schemas":{"Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."},"foods":{"type":"array","description":"The pet's favorite foods.","items":{"type":"object","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string"}}}}}}},"Foods":{"type":"array","description":"List of foods","items":{"type":"object","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string"}}}}}}},"tags":[{"description":"Endpoints to handle pets.","name":"Pet"}]}"`
		)
	})
})
const food = isly.object({
	name: isly.string().rename("Name").describe("The food's name."),
	for: isly.string().array().rename("For").describe("The animals the food is for."),
})
const pet = isly
	.object({
		name: isly.string().rename("name").describe("The pet's name."),
		breed: isly.string().rename("breed").describe("The pet's breed."),
		age: isly.number().rename("age").describe("The pet's age."),
		foods: food.array().rename("Foods").describe("The pet's favorite foods."),
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
	title: "Fetch a single Pet",
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
		body: food.array().rename("Foods").describe("List of foods"),
		status: isly.number("value", 200).describe("Food listed"),
	},
	execute: (request, context) => {
		return {
			body: [
				{ name: "Formula 1", for: "Dog" },
				{ name: "Flight Fuel", for: ["Pigeon", "Parrot"] },
			],
			status: 200,
		}
	},
})
