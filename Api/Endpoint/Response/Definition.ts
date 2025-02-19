import { isly } from "isly"
import { typedly } from "typedly"
import type { Response } from "."

export interface Definition {
	headers: Record<string, isly.Definition>
	body: isly.Definition
}
export namespace Definition {
	export function from(response: Response.Configuration): Definition {
		return {
			headers: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				{},
				([name, type]) => [name, type.definition] as const
			),
			body: (response.body ?? isly.undefined()).definition,
		}
	}
}
