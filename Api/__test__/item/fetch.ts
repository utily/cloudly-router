import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"
import { model } from "../model"

api.add({
	title: "Fetch Item",
	description: "Fetch an item by its identifier.",
	tags: ["item"],
	method: "GET",
	path: "/item/:id",
	request: {
		parameter: { id: isly.string().rename("id").describe("Identifier of item to fetch.") },
		identity: Context.Identity.getConfigurations(["bearer"], { item: { read: true } }),
	},
	async execute(request, context: Context) {
		const result = context.items.fetch(request.parameter.id)
		return result
			? {
					status: 200,
					body: result,
			  }
			: gracely.client.notFound()
	},
	response: {
		status: isly.number("value", 200),
		body: model.Item.type,
	},
})
