import { http } from "cloudly-http"
import { Request as _Request } from "./Request"

export interface Endpoint<
	C extends object = object,
	S extends Record<string, any> = Record<string, never>,
	P extends Record<string, any> = Record<string, never>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
	B = never
> {
	// TODO:
	// * support response type (and verification?)
	title: string
	description: string
	path: string
	method: http.Method
	request: Endpoint.Request.Configuration<S, P, H, B>
	execute: (request: Endpoint.Request<S, P, H, B>, context: C) => any
}
export namespace Endpoint {
	export import Request = _Request
}

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
