import { Api } from "../../../../Api"
import { Parameter } from "../Parameter"
import { RequestBody } from "../RequestBody"
import { Responses } from "./Responses"

export interface Operation {
	// callbacks?: undefined | { [callbackIdentifier: string]: Callback | Reference }
	deprecated?: boolean
	description?: string
	// externalDocs?: undefined | ExternalDocumentation
	operationId?: string
	parameters?: Parameter[]
	requestBody?: RequestBody
	responses?: Responses
	// security?: undefined | Array<SecurityRequirement>
	// servers?: undefined | Array<Server>
	summary?: string
}
export namespace Operation {
	export function from(endpoint: Api.Endpoint.Definition): Operation {
		return {
			description: endpoint.description,
			summary: endpoint.title,
			responses: Responses.from(endpoint.response),
		}
	}
}
