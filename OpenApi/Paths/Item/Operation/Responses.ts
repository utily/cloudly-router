import { isly } from "isly"
import { Api } from "../../../../Api"
import { Schema } from "../../../Schema"
import { MediaType } from "../MediaType"
import { Parameter } from "../Parameter"

export interface Responses {
	[httpStatusCode: string]: Responses.Response
}
export namespace Responses {
	export function from(response: Api.Endpoint.Response.Definition): Responses {
		return { [response.status.name]: Response.from(response) }
	}
	export interface Response {
		content?: { [mediaType: string]: MediaType }
		description: string
		headers?: Response.Headers
	}
	export namespace Response {
		export function from(response: Api.Endpoint.Response.Definition): Response {
			return {
				content: response.body ? { "application/json": MediaType.from(response.body) } : undefined,
				description: response.status.description ?? "",
				headers: Headers.from(response.header),
			}
		}
		export type Headers = Record<string, Omit<Parameter.Header, "in" | "name">>
		export namespace Headers {
			export function from(header: Record<string, isly.Definition>): Headers {
				return Object.entries(header).reduce(
					(r, [key, value]) => ({
						...r,
						[key]: {
							description: value.description,
							schema: Schema.from(value),
							required: true,
						},
					}),
					{}
				)
			}
		}
	}
}
