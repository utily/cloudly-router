import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"
import { model } from "../model"

api.add({
	title: "Change Item",
	description: "Change an existing item.",
	tags: ["item"],
	method: "PATCH",
	path: "/item/:id",
	request: {
		parameter: { id: isly.string().rename("id").describe("Identifier of item to change.") },
		identity: Context.Identity.getConfigurations(["bearer"], { item: { write: true } }),
		body: model.Item.type.partial(),
	},
	async execute(request, context: Context) {
		const before = context.items.fetch(request.parameter.id)
		const result = before && context.items.replace({ ...before, ...request.body })
		return result
			? { status: 200, body: result }
			: before
			? gracely.server.databaseFailure()
			: gracely.client.notFound()
	},
	response: {
		status: isly.number("value", 200),
		body: model.Item.type,
	},
})
