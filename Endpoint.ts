import { http } from "cloudly-http"
import { isly } from "isly"
import { schema } from "./schema"

export interface Endpoint<
	C,
	S extends Record<string, any> | undefined = Record<string, never>,
	P extends Record<string, any> | undefined = Record<string, never>,
	H extends Record<keyof http.Request.Header, any> | undefined = Record<keyof http.Request.Header, never>,
	B = never
> {
	title: string
	description: string
	path: string
	method: http.Method
	request: {
		search?: { [N in keyof S]: isly.Type<S[N]> }
		parameters?: { [N in keyof P]: isly.Type<P[N]> }
		headers?: { [N in keyof H]: isly.Type<H[N]> }
		body?: isly.Type<B>
	}
	// TODO: response type
	execute: (request: Endpoint.Request<S, P, H, B>, context: C) => any
}
export namespace Endpoint {
	export function isParameters<P extends Record<string, any> | undefined>(
		checkers: [string, isly.Type<P[keyof P]>][],
		parameters: any
	): parameters is P {
		return parameters && checkers.every(([name, checker]) => checker.is(parameters[name]))
	}
	export interface Request<
		S extends Record<string, any> | undefined = Record<string, any>,
		P extends Record<string, any> | undefined = Record<string, any>,
		H extends Record<keyof http.Request.Header, any> | undefined = Record<keyof http.Request.Header, any>,
		B = any
	> {
		search: S
		parameters: P
		headers: H
		body: B
	}
	export namespace Request {
		// export const type = isly.object<Request>()
	}

	export function add<
		C,
		S extends Record<string, any> = Record<string, never>,
		P extends Record<string, any> = Record<string, never>,
		H extends Record<keyof http.Request.Header, any> = Record<keyof http.Request.Header, never>,
		B = never
	>(endpoint: Endpoint<C, S, P, H, B>): void {
		return
	}
	export function schemaify(endpoint: Endpoint<any, any, any, any, any>): schema.PathItem {
		const result: schema.PathItem = {
			[endpoint.method as string]: {
				summary: endpoint.title,
				description: endpoint.description,
				// deprecated: endpoint.deprecated,
				parameters: generateParameters(endpoint),
				requestBody: generateBody(endpoint),
				// responses: generateResponses(endpoint),
			},
		}
		return result
	}
	function generateBody(endpoint: Endpoint<any, any, any, any, any>): schema.RequestBody {
		const result: schema.RequestBody = {
			content: {
				"application/json": {
					/* value.doc() */
				},
			},
		}
		return result
	}
	function generateParameters(endpoint: Endpoint<any, any, any, any, any>): schema.Parameter[] {
		const result: schema.Parameter[] = []
		endpoint.request.search &&
			Object.entries(endpoint.request.search).forEach(([name, value]) => {
				const parameter: schema.Parameter = { name, in: "query" }
				result.push(parameter)
			})
		endpoint.request.headers &&
			Object.entries(endpoint.request.headers).forEach(([name, value]) => {
				const parameter: schema.Parameter = { name, in: "header" }
				result.push(parameter)
			})
		endpoint.request.parameters &&
			Object.entries(endpoint.request.parameters).forEach(([name, value]) => {
				const parameter: schema.Parameter = { name, in: "path", required: true }
				result.push(parameter)
			})
		return result
	}
	// function generateResponses(endpoint: Endpoint<any, any, any, any, any>): schema.Responses {
	// 	return {
	// 		[endpoint.response.status]: {
	// 			headers: generateHeaders(endpoint),
	// 			description: endpoint.response.description,
	// 			content: {
	// 				"application/json": {
	// 					/* value.doc() */
	// 				},
	// 			},
	// 		},
	// 	}
	// }
	// function generateHeaders(endpoint: Endpoint<any, any, any, any, any>): Record<string, schema.Header> {
	// 	return  Object.entries(endpoint.response.headers).reduce(
	// 		(result, [name, value]) => ({
	// 			...result,
	// 			[name]: {
	// 				/* value.doc() */
	// 			},
	// 		}),
	// 		{}
	// 	)
	// }
}
