import { gracely } from "gracely"
import { http } from "cloudly-http"
import { Definition as _Definition } from "./Definition"
import { Request as _Request } from "./Request"
import { Response as _Response } from "./Response"

export interface Endpoint<
	C extends object = object, //Context
	S extends Record<string, any> = Record<string, never>, //Search parameters
	P extends Record<string, any> = Record<string, never>, //Path arguments
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>, //Headers
	B = never, //Body
	RH extends Record<keyof http.Response.Header, any> = Record<keyof http.Response.Header, never>, //Response Headers
	RB = never //Response Body
> {
	// TODO:
	// * support response type (and verification?)
	title: string
	tags?: string[]
	description: string
	path: string
	method: http.Method
	request: Endpoint.Request.Configuration<S, P, H, B>
	response: Endpoint.Response.Configuration<RH, RB>
	execute: (
		request: Endpoint.Request<S, P, H, B>,
		context: C
	) => Promise<Endpoint.Response<RH, RB> | gracely.Error> | Endpoint.Response<RH, RB> | gracely.Error
}
export namespace Endpoint {
	export import Request = _Request
	export import Response = _Response
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
