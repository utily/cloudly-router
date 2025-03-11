import { gracely } from "gracely"
import { isly } from "isly"
import { api } from "../api"
import { Context } from "../Context"
import { model } from "../model"

api.add({
	title: "List Items",
	description: "List items.",
	tags: ["item"],
	method: "GET",
	path: "/item",
	request: {
		identity: Context.Identity.getConfigurations(["bearer"], { item: { read: true } }),
	},
	async execute(request, context: Context) {
		const result = context.items.list()
		return result
			? {
					status: 200,
					body: result,
			  }
			: gracely.server.databaseFailure()
	},
	response: {
		status: isly.number("value", 200),
		body: model.Item.type,
	},
})
