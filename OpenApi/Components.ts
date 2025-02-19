import { Api } from "../Api"
import { Schema } from "./Schema"

export interface Components {
	// callbacks?:  { [key: string]: Callback | Reference }
	// examples?:  { [key: string]: Example | Reference }
	// headers?:  { [key: string]: Header | Reference }
	// links?:  { [key: string]: Link | Reference }
	// parameters?:  { [key: string]: Parameter | Reference }
	// pathItems?:  { [key: string]: PathItem | Reference }
	// requestBodies?:  { [key: string]: RequestBody | Reference }
	// responses?:  { [key: string]: Response | Reference }
	schemas?: { [key: string]: Schema }
	// securitySchemes?:  { [key: string]: SecurityScheme | Reference }
}
export namespace Components {
	export function from(endpoints: Api.Endpoint.Definition[]): Components {
		const result: Record<string, Schema> = { schemas: {} }
		for (const endpoint of endpoints) {
			const request = result[endpoint.request.body.name] ?? Schema.from(endpoint.request.body)
			const response = result[endpoint.response.body.name] ?? Schema.from(endpoint.response.body)
			result.schemas = {
				...result.schemas,
				[endpoint.request.body.name]: request,
				[endpoint.response.body.name]: response,
			}
		}
		return result
	}
}
