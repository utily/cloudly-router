import { isly } from "isly"
import * as router from "../index"

describe("router.Api", () => {
	it("", () => {
		type Context = {
			a: string
		}
		const api = router.Api.create<Context>({})
		// api.add(router.OpenApi.create(api, "/help"))

		api.add({
			title: "Create Card",
			description: "",
			path: "",
			method: "POST",
			request: {
				parameters: { id: isly.number().rename("id").describe("4 digit base64 encoded id of card.") },
				body: isly.number().array(),
			},
			// response: { body: isly.number().array(), headers: { date: isly.string() } },
			execute: (request, context: Context): any => {
				const body = request.body
				const id = request.parameters.id
				return context.a && body && id && request
			},
		})
		api.add({
			method: "PATCH",
			path: "/time/:activity/",
			title: "Update Times",
			description: "Change times for activity on day.",
			request: {
				search: { client: isly.string() },
				parameters: { activity: isly.string("value", "planned", "fire", "planning", "overhead") },
				body: isly.object(
					{
						time: isly.number(),
					},
					"Time.Changeable"
				),
			},
			execute: (request, context) => {
				return { body: request.body, activity: request.parameters.activity, time: request.body.time, a: context.a }
			},
		})
		expect(api.definition).toMatchInlineSnapshot()
	})
})
