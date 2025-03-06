import { Api } from "../../../Api"
import { Operation } from "./Operation"
import { Parameter } from "./Parameter"

export interface Item {
	$ref?: string
	delete?: Operation
	description?: string
	get?: Operation
	head?: Operation
	options?: Operation
	parameters?: Parameter[]
	patch?: Operation
	post?: Operation
	put?: Operation
	summary?: string
	trace?: Operation
}
export namespace Item {
	export function from(endpoints: Api.Endpoint.Definition[]): Item {
		return endpoints.reduce((r, endpoint) => ({ ...r, [endpoint.method.toLowerCase()]: Operation.from(endpoint) }), {})
	}
}
