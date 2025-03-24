import { isly } from "isly"

export type Identifier = string

export namespace Identifier {
	export const { type, is, flawed } = isly.string("value", /^[0-9,A-Z,a-z]{4}$/).bind()
	export function generate(): Identifier {
		return Math.random().toString(36).substring(2, 6)
	}
	export const range = ["0000", "zzzz"] as const
}
