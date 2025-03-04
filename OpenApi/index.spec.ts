import { isly } from "isly"
import * as router from "../index"

describe("OpenApi", () => {
	it("from", () => {
		expect(JSON.stringify(router.OpenApi.from(api))).toMatchInlineSnapshot(
			`"{"info":{"description":"Api documentation for the pet store","title":"Pet Store","version":"v1"},"openapi":"3.0.4","paths":{"/pet":{"post":{"description":"Adds a new pet","summary":"Create Pet","parameters":[{"in":"header","description":"An example request header.","name":"test","schema":{"type":"string","description":"An example request header."},"required":true}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}},"responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pet created","headers":{"test":{"description":"An example response header.","schema":{"type":"string","description":"An example response header."},"required":true}}}},"tags":["Pet"]},"get":{"description":"Returns a list of pets","summary":"List Pets","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pets listed","headers":{}}},"tags":["Pet"]}},"/pet/{id}":{"get":{"description":"Returns a single pet","summary":"Fetch a single Pet","parameters":[{"in":"path","description":"The pet's id","name":"id","schema":{"type":"string","description":"The pet's id"},"required":true}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"","headers":{}}},"tags":["Pet"]}},"/food":{"get":{"description":"Returns a list of foods","summary":"List Food","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Foods"}}},"description":"Food listed","headers":{}}},"tags":["Food"]}}},"components":{"schemas":{"Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."},"tuple":{"type":"array","description":"Description of test tuple.","oneOf":[{"type":"number","description":"Description of value1"},{"type":"string","description":"Description of value2"}],"minItems":2,"maxItems":2},"foods":{"type":"array","description":"The pet's favorite foods.","items":{"type":"object","description":"A food.","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string","enum":["Dog","Cat"]}}},"required":["name","for"]}}},"required":["name","breed","age","tuple","foods"]},"Foods":{"type":"array","description":"List of foods","items":{"type":"object","description":"A food.","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string","enum":["Dog","Cat"]}}},"required":["name","for"]}}}},"tags":[{"description":"Endpoints to handle pets.","name":"Pet"}]}"`
		)
	})
	it("/help", async () => {
		const response = await api.router.handle(new Request("https://www.example.com/help"), {})
		expect(JSON.stringify(await response.json())).toMatchInlineSnapshot(
			`"{"info":{"description":"Api documentation for the pet store","title":"Pet Store","version":"v1"},"openapi":"3.0.4","paths":{"/pet":{"post":{"description":"Adds a new pet","summary":"Create Pet","parameters":[{"in":"header","description":"An example request header.","name":"test","schema":{"type":"string","description":"An example request header."},"required":true}],"requestBody":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}}},"responses":{"201":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pet created","headers":{"test":{"description":"An example response header.","schema":{"type":"string","description":"An example response header."},"required":true}}}},"tags":["Pet"]},"get":{"description":"Returns a list of pets","summary":"List Pets","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"Pets listed","headers":{}}},"tags":["Pet"]}},"/pet/{id}":{"get":{"description":"Returns a single pet","summary":"Fetch a single Pet","parameters":[{"in":"path","description":"The pet's id","name":"id","schema":{"type":"string","description":"The pet's id"},"required":true}],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Pet"}}},"description":"","headers":{}}},"tags":["Pet"]}},"/food":{"get":{"description":"Returns a list of foods","summary":"List Food","parameters":[],"responses":{"200":{"content":{"application/json":{"schema":{"$ref":"#/components/schemas/Foods"}}},"description":"Food listed","headers":{}}},"tags":["Food"]}}},"components":{"schemas":{"Pet":{"type":"object","description":"A pet.","properties":{"name":{"type":"string","description":"The pet's name."},"breed":{"type":"string","description":"The pet's breed."},"age":{"type":"number","description":"The pet's age."},"tuple":{"type":"array","description":"Description of test tuple.","oneOf":[{"type":"number","description":"Description of value1"},{"type":"string","description":"Description of value2"}],"minItems":2,"maxItems":2},"foods":{"type":"array","description":"The pet's favorite foods.","items":{"type":"object","description":"A food.","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string","enum":["Dog","Cat"]}}},"required":["name","for"]}}},"required":["name","breed","age","tuple","foods"]},"Foods":{"type":"array","description":"List of foods","items":{"type":"object","description":"A food.","properties":{"name":{"type":"string","description":"The food's name."},"for":{"type":"array","description":"The animals the food is for.","items":{"type":"string","enum":["Dog","Cat"]}}},"required":["name","for"]}}}},"tags":[{"description":"Endpoints to handle pets.","name":"Pet"}]}"`
		)
	})
})
interface Food {
	name: string
	for: string[]
}
const food = isly
	.object<Food>({
		name: isly.string().rename("Name").describe("The food's name."),
		for: isly.string("value", ["Dog", "Cat"]).array().rename("For").describe("The animals the food is for."),
	})
	.rename("Food")
	.describe("A food.")
const pet = isly
	.object({
		name: isly.string().rename("name").describe("The pet's name."),
		breed: isly.string().rename("breed").describe("The pet's breed."),
		age: isly.number().rename("age").describe("The pet's age."),
		tuple: isly
			.tuple(
				isly.number().rename("value1").describe("Description of value1"),
				isly.string().rename("value2").describe("Description of value2")
			)
			.rename("testTuple")
			.describe("Description of test tuple."),
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
api.add(router.OpenApi.endpoint(api, "/help"))
api.add({
	title: "Create Pet",
	description: "Adds a new pet",
	collection: ["Pet"],
	path: "/pet",
	method: "POST",
	request: {
		body: pet,
		header: { test: isly.string().rename("test").describe("An example request header.") },
	},
	response: {
		body: pet,
		header: { test: isly.string().rename("test").describe("An example response header.") },
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
