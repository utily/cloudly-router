import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"
import { model } from "../model"

api.add({
	title: "Replace Item",
	description: "Change an existing item.",
	tags: ["item"],
	method: "PUT",
	path: "/item/:id",
	request: {
		parameter: { id: isly.string().rename("id").describe("Identifier of item to replace.") },
		identity: Context.Identity.getConfigurations(["bearer"], { item: { write: true } }),
		body: model.Item.type,
	},
	async execute(request, context: Context) {
		const result = context.items.replace(request.body)
		return result ? { status: 200, body: result } : gracely.client.notFound()
	},
	response: {
		status: isly.number("value", 200),
		body: model.Item.type,
	},
})
