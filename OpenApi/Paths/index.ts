import { Api } from "../../Api"
import { Item } from "./Item"

export interface Paths {
	[path: string]: Item
}
export namespace Paths {
	export function from(endpoints: Api.Endpoint.Definition[]): Paths {
		const sorted = endpoints.reduce<Record<string, Api.Endpoint.Definition[]>>(
			(r, endpoint) => ({
				...r,
				[convert(endpoint.path)]: [...(r[convert(endpoint.path)] ?? []), endpoint],
			}),
			{}
		)
		return Object.entries(sorted).reduce(
			(r, [path, endpoints]) => ({
				...r,
				[path]: Item.from(endpoints),
			}),
			{}
		)
	}
	function convert(httpPath: string): string {
		return httpPath.replace(/:(\w+)/g, "{$1}")
	}
}
