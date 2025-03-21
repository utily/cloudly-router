import { Api } from "../../../../Api"
import { Parameter } from "../Parameter"
import { RequestBody } from "../RequestBody"
import { Responses } from "./Responses"

export interface Operation {
	deprecated?: boolean
	description?: string
	operationId?: string
	parameters?: Parameter[]
	requestBody?: RequestBody
	responses?: Responses
	summary?: string
	tags?: string[]
}
export namespace Operation {
	export function from(endpoint: Api.Endpoint.Definition): Operation {
		return {
			description: endpoint.description,
			summary: endpoint.title,
			parameters: Parameter.from(endpoint.request),
			requestBody: RequestBody.from(endpoint.request),
			responses: Responses.from(endpoint.response),
			tags: endpoint.tags,
		}
	}
}
