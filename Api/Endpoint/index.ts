import { http } from "cloudly-http"
import { Definition as _Definition } from "./Definition"
import { Request as _Request } from "./Request"

export interface Endpoint<
	C extends object = object, //Context
	S extends Record<string, any> = Record<string, never>, //Search parameters
	P extends Record<string, any> = Record<string, never>, //Path arguments
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>, //Headers
	B = never //Body
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
	export import Definition = _Definition
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
