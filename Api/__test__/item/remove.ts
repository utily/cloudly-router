import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"

api.add({
	title: "Remove Item",
	description: "Remove an existing item.",
	tags: ["item"],
	method: "DELETE",
	path: "/item/:id",
	request: {
		parameter: { id: isly.string().rename("id").describe("Identifier of item to remove.") },
		identity: Context.Identity.getConfigurations(["bearer"], { item: { write: true } }),
	},
	async execute(request, context: Context) {
		const result = context.items.remove(request.parameter.id)
		return result ? { status: 204, body: undefined } : gracely.client.notFound()
	},
	response: {
		status: isly.number("value", 204),
		body: isly.undefined(),
	},
})
