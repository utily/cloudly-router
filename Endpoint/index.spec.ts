import { isly } from "isly"
import * as router from "../index"

describe("router.Endpoint", () => {
	it("", () => {
		type Context = {
			a: string
		}
		const group = new router.Endpoint.Group<Context>({ name: "Worker A", description: "" })
		group.add({
			title: "Create Card",
			description: "",
			path: "",
			method: "POST",
			request: {
				parameters: { id: isly.number() },
				body: isly.number().array(),
			},
			execute: (request, context: Context): any => {
				request.body
				request.parameters.id
				return context.a || request
			},
		})
		group.add
		group.add({
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
				request.body
				request.parameters.activity
				request.body.time
				context.a
			},
		})
		expect(group.definition).toMatchInlineSnapshot()
	})
})
