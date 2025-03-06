import { isly } from "isly"
import { typedly } from "typedly"
import type { Request } from "."

export interface Definition {
	parameter: Record<string, isly.Definition>
	search: Record<string, isly.Definition>
	header: Record<string, isly.Definition>
	body?: isly.Definition
}
export namespace Definition {
	export function from(request: Request.Configuration): Definition {
		return {
			parameter: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.parameter ?? {},
				([name, type]) => [name, type.definition] as const
			),
			search: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.search ?? {},
				([name, type]) => [name, type.definition] as const
			),
			header: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				request.header ?? {},
				([name, type]) => [name, type.definition] as const
			),
			body: request.body?.definition,
		}
	}
}
