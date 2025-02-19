import { Api } from "../../../../Api"
import { MediaType } from "../MediaType"
import { Header } from "../Parameter"

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
		headers?: { [headerName: string]: Header }
	}
	export namespace Response {
		export function from(response: Api.Endpoint.Response.Definition): Response {
			return {
				content: response.body ? { "application/json": MediaType.from(response.body) } : undefined,
				description: "Successful operation",
				// headers: Object.entries(response.header).reduce((r, [name, type]) => ({ ...r, [name]: Header.from(type) }), {}),
			}
		}
	}
}
