import { Api } from "../Api"
import { Schema } from "./Schema"

export interface Components {
	schemas?: Partial<Record<string, Schema>>
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
