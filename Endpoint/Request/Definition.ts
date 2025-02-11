import { isly } from "isly"
import { typedly } from "typedly"
import type { Request } from "."

export interface Definition {
	parameters: Record<string, isly.Definition>
	search: Record<string, isly.Definition>
	headers: Record<string, isly.Definition>
	body: isly.Definition
}
export namespace Definition {
	export function from(request: Request.Configuration): Definition {
		return {
			parameters: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.parameters ?? {},
				([name, type]) => [name, type.definition] as const
			),
			search: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.search ?? {},
				([name, type]) => [name, type.definition] as const
			),
			headers: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.headers ?? {},
				([name, type]) => [name, type.definition] as const
			),
			body: (request.body ?? isly.undefined()).definition,
		}
	}
}
