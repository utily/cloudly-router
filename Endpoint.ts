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

export interface Request<
	S extends Record<string, any> = Record<string, any>,
	P extends Record<string, any> = Record<string, any>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, any>,
	B = any
> {
	search: S
	parameters: P
	headers: H
	body: B
}

export interface Endpoint<
	C,
	S extends Record<string, any> = Record<string, never>,
	P extends Record<string, any> = Record<string, never>,
	H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
	B = never
> {
	title: string
	description: string
	path: string
	method: http.Method
	request: {
		search?: {
			[N in keyof S]: isly.Type<S[N]>
		}
		parameters?: {
			[N in keyof P]: isly.Type<P[N]>
		}
		headers?: {
			[N in keyof H]: isly.Type<H[N]>
		}
		body?: isly.Type<B>
	}
	execute: (request: Request<S, P, H, B>, context: C) => any
}
export namespace Endpoint {
	export function add<
		C,
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(endpoint: Endpoint<C, S, P, H, B>): void {
		return
	}
}
