import { Api, Router } from "../../index"
import { Context } from "./Context"

export const api = Api.create(new Router<Context>(), {
	name: "Test",
	description: "Test API",
	tags: [{ name: "item", description: "Item handling API." }],
})
