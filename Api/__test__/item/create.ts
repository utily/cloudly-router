import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"
import { model } from "../model"

api.add({
	title: "Create Item",
	description: "Create a new item.",
	tags: ["item"],
	method: "POST",
	path: "/item",
	request: {
		identity: Context.Identity.getConfigurations(["bearer"], { item: { write: true } }),
		body: model.Item.Creatable.type,
	},
	async execute(request, context: Context) {
		const result = context.items.create(request.body)
		return result
			? {
					status: 201,
					body: result,
			  }
			: gracely.server.databaseFailure()
	},
	response: {
		status: isly.number("value", 201),
		body: model.Item.type,
	},
})
