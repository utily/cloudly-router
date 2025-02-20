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
	schemas?: Partial<Record<string, Schema>>
	// securitySchemes?:  { [key: string]: SecurityScheme | Reference }
}
export namespace Components {
	export function from(endpoints: Api.Endpoint.Definition[]): Components {
		const result: Required<Components> = { schemas: {} }
		for (const endpoint of endpoints) {
			if (endpoint.request.body)
				result.schemas[endpoint.request.body.name] ??= Schema.from(endpoint.request.body)
			result.schemas[endpoint.response.body.name] ??= Schema.from(endpoint.response.body)
		}
		return result
	}
}
