import { Api } from "../../../Api"
import { MediaType } from "./MediaType"

export interface RequestBody {
	content: { [mediaType: string]: MediaType }
	description?: string
	required?: boolean
}
export namespace RequestBody {
	export function from(request: Api.Endpoint.Request.Definition): RequestBody | undefined {
		return request.body && { content: { "application/json": MediaType.from(request.body) } }
	}
}
