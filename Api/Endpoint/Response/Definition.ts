import { isly } from "isly"
import { typedly } from "typedly"
import type { Response } from "."

export interface Definition {
	header: Record<string, isly.Definition>
	body: isly.Definition
}
export namespace Definition {
	export function from(response: Response.Configuration): Definition {
		return {
			header: typedly.Object.map<Record<string, isly.Type>, Record<string, isly.Definition>>(
				{},
				([name, type]) => [name, type.definition] as const
			),
			body: (response.body ?? isly.undefined()).definition,
		}
	}
}
