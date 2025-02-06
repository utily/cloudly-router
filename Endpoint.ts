// EXAMPLE:
// router.add("PATCH", "/time/:activity/", {
// 	title: "Update Times",
// 	description: "Change times for activity on day.",
// 	request: {
// 		authentication: [],
// 		search: { client: weekmeter.Client.type },
// 		parameters: { activity: weekmeter.Activity.type },
// 		body: weekmeter.Time.Changeable.type,
// 	},
// 	execute: () => {},
// 	response: [
// 		gracely.server.DatabaseFailure.type as any,
// 		{
// 			headers: {},
// 			body: {},
// 		},
// 	],
// } as any)
import { http } from "cloudly-http"
import { isly } from "isly"
import { Handler } from "./Handler"

export interface Endpoint<T> {
	title: string
	description: string
	path: string
	method: http.Method | http.Method[]
	request: {
		authentication: []
		search: Record<string, isly.Type>
		parameters: Record<string, isly.Type>
		headers: Record<string, isly.Type>
		body: isly.Type
	}
	response: { headers: Record<string, isly.Type>; body: isly.Type; status: number }[]
	execute: Handler<T>
}
export namespace Endpoint {}
