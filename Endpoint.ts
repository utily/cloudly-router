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
import { schema } from "./schema"

export interface Endpoint<T> {
	title: string
	description: string
	path: string
	method: http.Method | http.Method[]
	deprecated?: boolean
	request: {
		authentication: ((request: Request) => any)[]
		search: Record<string, isly.Type>
		parameters: Record<string, isly.Type>
		headers: Record<string, isly.Type>
		body: isly.Type
	}
	response: { headers: Record<string, isly.Type>; body: isly.Type; status: number; description: string }
	execute: Handler<T>
}
export namespace Endpoint {
	export function schemaify(endpoint: Endpoint<unknown>): schema.PathItem {
		const result: schema.PathItem = {
			[endpoint.method as string]: {
				summary: endpoint.title,
				description: endpoint.description,
				deprecated: endpoint.deprecated,
				parameters: generateParameters(endpoint),
				requestBody: generateBody(endpoint),
				responses: generateResponses(endpoint),
			},
		}
		return result
	}
	function generateBody(endpoint: Endpoint<unknown>): schema.RequestBody {
		const result: schema.RequestBody = {
			content: {
				"application/json": {
					/* value.doc() */
				},
			},
		}
		return result
	}
	function generateParameters(endpoint: Endpoint<unknown>): schema.Parameter[] {
		const result: schema.Parameter[] = []
		Object.entries(endpoint.request.search).forEach(([name, value]) => {
			const parameter: schema.Parameter = { name, in: "query" }
			result.push(parameter)
		})
		Object.entries(endpoint.request.headers).forEach(([name, value]) => {
			const parameter: schema.Parameter = { name, in: "header" }
			result.push(parameter)
		})
		Object.entries(endpoint.request.parameters).forEach(([name, value]) => {
			const parameter: schema.Parameter = { name, in: "path", required: true }
			result.push(parameter)
		})
		return result
	}
	function generateResponses(endpoint: Endpoint<unknown>): schema.Responses {
		return {
			[endpoint.response.status]: {
				headers: generateHeaders(endpoint),
				description: endpoint.response.description,
				content: {
					"application/json": {
						/* value.doc() */
					},
				},
			},
		}
	}
	function generateHeaders(endpoint: Endpoint<unknown>): Record<string, schema.Header> {
		return Object.entries(endpoint.response.headers).reduce(
			(result, [name, value]) => ({
				...result,
				[name]: {
					/* value.doc() */
				},
			}),
			{}
		)
	}
}
